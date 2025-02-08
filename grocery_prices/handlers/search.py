import logging

from pydantic import BaseModel

from grocery_prices.features.search import SearchByName
from grocery_prices.utils.output import to_lambda_response

_logger = logging.getLogger(__name__)
_logger.setLevel("INFO")


class SearchEvent(BaseModel):
    keyword: str
    page: int = 1


def lambda_handler(event: dict, _):
    search_request = SearchEvent(**event)
    search_result = SearchByName(search_request.keyword)

    _logger.info("found %d results for keyword=%s", len(search_result.results[0]), search_request.keyword)

    return to_lambda_response(search_result.results)
