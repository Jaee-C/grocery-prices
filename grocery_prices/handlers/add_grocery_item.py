import logging

import boto3
from pydantic import BaseModel


class GroceryItemInput(BaseModel):
    """Input model for the add_grocery_item lambda function."""

    code: str
    merchant: str


_logger = logging.getLogger(__name__)
client = boto3.client("dynamodb")


def lambda_handler(event: GroceryItemInput):
    """
    Lambda function to save a grocery item to the database.
    """
    _logger.info("Saving grocery item code=%s, merchant=%s", event.code, event.merchant)

    try:
        response = client.put_item(
            TableName="grocery_items",
            Item={
                "code": {"S": event.code},
                "merchant": {"S": event.merchant},
            },
            ConditionExpression="attribute_not_exists(code) AND attribute_not_exists(merchant)",
            ReturnConsumedCapacity="TOTAL",
        )
        _logger.info(
            "Successfully saved grocery item: %s. Capacity consumed: %s", event.code, response.get("ConsumedCapacity")
        )

    except client.exceptions.ConditionalCheckFailedException:
        _logger.warning("Item already exists in the database: %s", event.code)
