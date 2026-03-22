

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import select

from api.db.models import Product
from api.deps import get_db
from api.utils.db import save_create


class ProductRepository:

    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.db = db


    async def list_products(self) -> list[Product]:
        result = await self.db.scalars(select(Product))

        return result.all()


    async def get_product_by_id(self, obj_id: int) -> Product:
        return await self.db.scalar(select(Product).where(Product.id == obj_id))


    async def create_product(self, data) -> Product:
        product = Product(**data)
        await save_create(self.db, product)
        return product


    async def delete_product(self, product: Product = None, obj_id: int = None):
        if product is None and obj_id is None:
            # TODO: check for repo errors
            return

        if obj_id is not None:
            product = await self.db.scalar(select(Product).where(Product.id == obj_id))

        await self.db.delete(product)
        await self.db.commit()
