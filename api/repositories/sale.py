from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import select

from api.db.models import Product, Sale
from api.deps import get_db
from api.utils.db import save_create


class SaleRepository:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.db = db

    async def list_sales(self) -> list[Sale]:
        result = await self.db.scalars(select(Sale))
        return result.all()

    async def list_sales_for_org(self, org_id: str) -> list[Sale]:
        # stmt = (
        #     select(Sale, Product.id, Product.name)
        #     .join(Sale.product)
        #     .where(Sale.org_id == org_id)
        # )
        # result = await self.db.execute(stmt)
        # return result.all()
        result = await self.db.scalars(select(Sale).where(Sale.org_id == org_id))
        return result.all()

    async def create_sale(self, data, product: Product) -> Sale:
        sale = Sale(**data)
        product.quantity -= data["quantity"]
        await save_create(self.db, sale)
        return sale