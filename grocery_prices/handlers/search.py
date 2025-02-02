import logging

from aws_lambda_powertools.utilities.typing import LambdaContext
from pydantic import BaseModel

from grocery_prices.features.search import Search

_logger = logging.getLogger(__name__)


class SearchEvent(BaseModel):
    keyword: str
    page: int = 1


def lambda_handler(event: SearchEvent, context: LambdaContext):
    search_result = Search(event.keyword)

    _logger.info(f"found {len(search_result[0])} results for keyword={event.keyword}")
