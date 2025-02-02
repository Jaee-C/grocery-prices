import logging
from concurrent.futures import ThreadPoolExecutor

import merchants.base
from requests_cache import CachedSession
from utils.session import new_session

_logger = logging.getLogger(__name__)


class Search:
    def __init__(self, keyword: str, session: CachedSession = None):
        self.keyword = keyword
        self._session = session or new_session()

        self.results: list[merchants.base.SearchResult] = []
        with ThreadPoolExecutor() as executor:
            for merchant in merchants.merchants:
                future = executor.submit(merchant.search, session=self._session, keyword=self.keyword)
                self.results.append(future.result())

        _logger.info(f'searched keyword="{self.keyword}" across {len(self.results)} merchants')
