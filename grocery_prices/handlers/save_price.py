import logging
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime

import boto3
from mypy_boto3_dynamodb.type_defs import WriteRequestTypeDef

from grocery_prices.features.search import SearchByCode
from grocery_prices.merchants.base import Product

_logger = logging.getLogger(__name__)
client = boto3.client("dynamodb")


def generate_put_request(item: Product, date: str, merchant: str) -> WriteRequestTypeDef:
    return {
        "PutRequest": {
            "Item": {
                "code-merchant": {"S": f"{item.code}-{merchant}"},
                "price": {"N": item.price},
                "size": {"S": item.size},
                "price_per_unit": {"S": item.price_per_unit},
                "is_on_special": {"BOOL": item.is_on_special},
                "label": {"S": item.label},
                "url": {"S": item.url},
                "date": {"S": date},
            }
        }
    }


def lambda_handler():
    """
    Lambda runs on a schedule to look up and save the prices of all saved grocery items.
    """
    saved_groceries = client.scan(TableName="grocery_items")["Items"]
    date = datetime.today().strftime("%Y-%m-%d")

    results: list[SearchByCode] = []

    with ThreadPoolExecutor() as executor:
        for item in saved_groceries:
            code = item["code"].get("S", "")
            merchant = item["merchant"].get("S", "")

            if code == "" or merchant == "":
                continue

            future = executor.submit(SearchByCode, code, merchant)
            results.append(future.result())

    successful_results = [item for item in results if item.result is not None]
    failed_searches = [item for item in results if item.result is None]
    _logger.info("Saving prices for %s items", len(successful_results))
    _logger.warning(
        "Failed to look up prices for %s items (%s)", len(failed_searches), [item.code for item in failed_searches]
    )

    response = client.batch_write_item(
        RequestItems={
            "grocery_prices": [
                generate_put_request(item.result, date, item.merchant)
                for item in successful_results
                if item.result is not None
            ]
        },
        ReturnConsumedCapacity="TOTAL",
    )

    if response.get("UnprocessedItems"):
        _logger.error("UnprocessedItems: %s", response.get("UnprocessedItems"))

    consumed_capacity = response.get("ConsumedCapacity")

    for capacity in consumed_capacity:
        _logger.info(
            "[%s] RCU=%s; WCU=%s",
            capacity.get("TableName"),
            capacity.get("ReadCapacityUnits"),
            capacity.get("WriteCapacityUnits"),
        )
