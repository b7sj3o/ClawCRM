from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class ProductBase(BaseModel):
    name: str
    description: str
    buy_price: Decimal
    sell_price: Decimal
    quantity: int
    node_id: int


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    buy_price: Decimal | None = None
    sell_price: Decimal | None = None
    quantity: int | None = None
    node_id: int | None = None


class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProductList(BaseModel):
    items: list[ProductResponse]
    total: int
