import logging

from .features import search

_logger = logging.getLogger(__name__)

search_result = search.SearchByName("lindt")

print(f"found {len(search_result.results[0])} results for keyword=lindt")

for product in search_result.results[0]:
    print(product.display_name)
