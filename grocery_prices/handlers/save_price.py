import logging
from datetime import datetime

import boto3
from pydantic import BaseModel

from grocery_prices.features.search import SearchByCode

_logger = logging.getLogger(__name__)
client = boto3.client("dynamodb")


class SavePriceEvent(BaseModel):
    code: str
    merchant: str


def lambda_handler(event: SavePriceEvent):
    result = SearchByCode(event.code, event.merchant).result

    if not result:
        _logger.error("no product found for code=%s", event.code)
        return

    date = datetime.today().strftime("%Y-%m-%d")

    _logger.info("[%s] Savcing price for %s: $%s", event.merchant, result.display_name, result.price)
    client.put_item(
        TableName="grocery_prices",
        Item={
            "code": {"S": event.code},
            "merchant": {"S": event.merchant},
            "price": {"N": result.price},
            "size": {"S": result.size},
            "price_per_unit": {"S": result.price_per_unit},
            "is_on_special": {"BOOL": result.is_on_special},
            "label": {"S": result.label},
            "url": {"S": result.url},
            "date": {"S": date},
        },
    )
