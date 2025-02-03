import logging

import boto3
from pydantic import BaseModel


class GroceryItemInput(BaseModel):
    """Input model for the remove_grocery_item lambda function."""

    code: str
    merchant: str


_logger = logging.getLogger(__name__)
client = boto3.client("dynamodb")


def lambda_handler(event: GroceryItemInput):
    """
    Lambda function to remove a grocery item from the database.
    """
    _logger.info("Removing grocery item code=%s, merchant=%s", event.code, event.merchant)
    try:
        response = client.delete_item(
            TableName="grocery_items",
            Key={
                "code": {"S": event.code},
                "merchant": {"S": event.merchant},
            },
            ReturnConsumedCapacity="TOTAL",
        )
        _logger.info(
            "Successfully removed grocery item: %s. Capacity consumed: %s", event.code, response.get("ConsumedCapacity")
        )

    except client.exceptions.ResourceNotFoundException:
        _logger.warning("Item does not exist in the database: %s", event.code)
