import __future__

from datetime import datetime
from decimal import Decimal

from api.schemas.base import BaseModel


class ProductReadDTO(BaseModel):
    id: int
    node_id: int
    name: str 
    description: str | None = None
    buy_price: Decimal
    sell_price: Decimal
    quantity: int
    created_at: datetime

class ProductSaleReadDTO(BaseModel):
    id: int
    name: str 

class ProductReadTreeDTO(BaseModel):
    id: int
    name: str 
    description: str | None = None
    buy_price: Decimal
    sell_price: Decimal
    quantity: int
    created_at: datetime


class ProductCreateDTO(BaseModel):
    node_id: int
    name: str
    description: str | None = None
    buy_price: Decimal
    sell_price: Decimal
    quantity: int
