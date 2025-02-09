import abc
import logging
from typing import Annotated, Any

from pydantic import AnyHttpUrl, BaseModel, ConfigDict, Field, field_serializer
from pydantic.alias_generators import to_snake
from requests_cache import CachedSession

_logger = logging.getLogger(__name__)


class Product(BaseModel):
    model_config = ConfigDict(coerce_numbers_to_str=True, alias_generator=to_snake)
    index: int
    display_name: str = Field(alias="DisplayName")
    price: str | None
    size: str | None
    price_per_unit: str | None
    is_on_special: bool
    label: str | None  # discount labelling, e.g. '20% Off save $1.40'
    url: AnyHttpUrl | str
    code: str

    @field_serializer("url")
    def url2str(self, val) -> str:
        if isinstance(val, AnyHttpUrl):
            return str(val)
        return val


class SearchResult(BaseModel, abc.ABC):
    _keyword: str = ""
    products: list[Annotated[Product, "Merchant's product"]] = []
    _raw: dict[str, Any] = {}

    def __iter__(self):
        return iter(self.products)

    def __len__(self):
        return len(self.products)

    def read_response(self, raw: dict[str, Any], keyword: str):
        """Generate a SearchResult from a raw API response."""
        products = []
        results = self.preprocess_response(raw)
        for i, result in enumerate(results):
            try:
                product = self._generate_product(result, index=i)
                products.append(product)
            except TypeError:
                _logger.warning("ignoring product, could not parse: %s", result, exc_info=True)

        self._keyword = keyword
        self.products = products
        self._raw = raw

        return self

    @abc.abstractmethod
    def preprocess_response(self, raw: dict[str, Any]) -> list[dict[str, Any]]:
        """Preform any required preprocessing of API response to return list of product dictionaries."""

    @abc.abstractmethod
    def _generate_product(self, raw: dict[str, Any], index: int) -> Product:
        """Generate a product from a dictionary of raw product data."""


class Merchant(abc.ABC):
    _search_result: SearchResult
    name: str

    def search_by_name(self, session: CachedSession, keyword: str, page: int = 1) -> SearchResult:
        response = self._search(session, keyword, page)
        return self._search_result.read_response(response, keyword)

    @abc.abstractmethod
    def search_by_code(self, session: CachedSession, code: str) -> Product:
        pass

    @abc.abstractmethod
    def _search(self, session: CachedSession, keyword: str, page: int = 1) -> dict[str, Any]:
        pass
