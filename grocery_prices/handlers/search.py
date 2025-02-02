import logging

from pydantic import BaseModel

from grocery_prices.features.search import SearchByName
from grocery_prices.merchants.base import Product

_logger = logging.getLogger(__name__)


class SearchEvent(BaseModel):
    keyword: str
    page: int = 1


def lambda_handler(event: SearchEvent) -> list[Product]:
    search_result = SearchByName(event.keyword)

    _logger.info("found %d results for keyword=%s", len(search_result.results[0]), event.keyword)

    return search_result.results[0].products
