from datetime import datetime
from decimal import Decimal

from api.schemas.base import BaseModel
from api.schemas.product import ProductSaleReadDTO


class SaleReadDTO(BaseModel):
    id: int
    # product: ProductSaleReadDTO
    product_id: int
    buy_price: Decimal
    sell_price: Decimal
    quantity: int
    created_by: str
    org_id: str
    created_at: datetime


class SaleCreateDTO(BaseModel):
    product_id: int
    buy_price: Decimal
    sell_price: Decimal
    quantity: int
