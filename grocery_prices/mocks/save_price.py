import logging
from datetime import datetime

import boto3
from mypy_boto3_dynamodb.type_defs import WriteRequestTypeDef

_logger = logging.getLogger(__name__)
_logger.setLevel("INFO")
client = boto3.client("dynamodb")


def generate_put_request(_, date: str, merchant: str) -> WriteRequestTypeDef:
    return {
        "PutRequest": {
            "Item": {
                "code-merchant": {"S": f"1111-{merchant}"},
                "price": {"N": 11.11},
                "size": {"S": 100},
                "price_per_unit": {"S": 11},
                "is_on_special": {"BOOL": True},
                "label": {"S": ""},
                "url": {"S": "test.com"},
                "date": {"S": date},
            }
        }
    }


def lambda_handler(event, context):
    """
    Lambda runs on a schedule to look up and save the prices of all saved grocery items.
    """
    date = datetime.today().strftime("%Y-%m-%d")

    response = client.batch_write_item(
        RequestItems={"grocery_prices": [generate_put_request("", date, "woolworths")]},
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
