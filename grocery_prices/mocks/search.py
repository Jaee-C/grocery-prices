import json


def lambda_handler(event, context):
    with open("grocery_prices/mocks/data/search_response.json", "r", encoding="utf-8") as file:
        return json.load(file)
