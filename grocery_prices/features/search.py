import logging
from concurrent.futures import ThreadPoolExecutor

from pydantic import ValidationError
from requests_cache import CachedSession

from grocery_prices.merchants import base, merchants
from grocery_prices.utils.session import new_session

_logger = logging.getLogger(__name__)


class SearchByName:
    """Represents the search by name result across multiple merchants."""

    def __init__(self, keyword: str, session: CachedSession | None = None):
        self.keyword = keyword
        self._session = session or new_session()

        self.results: list[base.SearchResult] = []
        with ThreadPoolExecutor() as executor:
            for merchant in merchants:
                future = executor.submit(merchant.search_by_name, session=self._session, keyword=self.keyword)
                self.results.append(future.result())

        _logger.info('searched keyword="%s" across %d merchants', self.keyword, len(self.results))


class SearchByCode:
    """Searches for the exact product by its code for a specific merchant."""

    def __init__(self, code: str, merchant: str, session: CachedSession | None = None):
        self.code = code
        self.merchant = merchant
        self._session = session or new_session()

        self.result: base.Product | None = None

        for merchant_cls in merchants:
            if merchant_cls.name == merchant:
                try:
                    self.result = merchant_cls.search_by_code(self._session, self.code)
                except ValidationError as e:
                    _logger.error("Error searching for code=%s: %s", self.code, e)

                return
