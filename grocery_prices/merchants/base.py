import abc
import logging

from pydantic import BaseModel, Field, AnyHttpUrl
from typing import Annotated, Any
from requests_cache import CachedSession


_logger = logging.getLogger(__name__)


class Product(BaseModel):
    index: int
    display_name: str
    price: str | None
    size: Annotated[str, Field(to_lower=True)] | None
    price_per_unit: str | None
    is_on_special: bool
    label: str | None  # discount labelling, e.g. '20% Off save $1.40'
    url: AnyHttpUrl


class SearchResult(BaseModel, abc.ABC):
    _product: Product
    keyword: str
    products: list[Annotated[Product, "Merchant's product"]]
    raw: dict[str, Any]

    def __iter__(self):
        return iter(self.products)

    def __len__(self):
        return len(self.products)

    @staticmethod
    @abc.abstractmethod
    def preprocess_response(raw: dict[str, Any]) -> list[dict[str, Any]]:
        """Preform any required preprocessing of API response to return list of product dictionaries."""
        pass

    @classmethod
    def from_response(cls, raw: dict[str, Any], keyword: str):
        products = []
        results = SearchResult.preprocess_response(raw)
        for i, result in enumerate(results):
            try:
                product = cls._product(**result, index=i)
                products.append(product)
            except TypeError:
                _logger.warning(f"ignoring product, could not parse: {result}", exc_info=True)
        return cls(products=products, raw=raw, keyword=keyword)


class Merchant(abc.ABC):
    _search_result: SearchResult
    name: str

    def search(self, session: CachedSession, keyword: str, page: int = 1) -> SearchResult:
        logging.error(f"search() not implemented for {self.__class__.__name__}")
        response = self._search(session, keyword, page)
        return self._search_result.from_response(response)

    @staticmethod
    @abc.abstractmethod
    def _search(session: CachedSession, keyword: str, page: int = 1) -> dict[str, Any]:
        pass
