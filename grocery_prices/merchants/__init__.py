from . import woolworths
from .base import Merchant

merchants: list[Merchant] = [woolworths.Woolworths()]
merchant_names = {"woolworths"}
