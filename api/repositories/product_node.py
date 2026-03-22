from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import defer, load_only, selectinload
from sqlalchemy.sql import select

from api.db.models import Product, ProductNode
from api.deps import get_db
from api.utils.db import save_create


class ProductNodeRepository:

    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.db = db


    async def list_nodes(self) -> list[ProductNode]:
        # TODO: не витягувати відразу всі ноди, краще декілька рівнів і
        # ! робити запити по типу /nodes?parent_id=123&depth=2 
        stmt = (
            select(ProductNode)
            .options(
                selectinload(ProductNode.products), 
                selectinload(ProductNode.children),
                
            )
        )

        result = await self.db.scalars(stmt)

        return list(result.all())

    async def get_node_by_id(self, obj_id: int) -> ProductNode:
        return await self.db.scalar(select(ProductNode).where(ProductNode.id == obj_id))


    async def create_product_node(self, data) -> ProductNode:
        product_node = ProductNode(**data)
        await save_create(self.db, product_node)
        return product_node

    
    async def delete_product_node(self, product_node: ProductNode = None, obj_id: int = None):
        if product_node is None and obj_id is None:
            # TODO: check for repo errors
            return

        if obj_id is not None:
            product_node = await self.db.scalar(select(ProductNode).where(ProductNode.id == obj_id))

        await self.db.delete(product_node)
        await self.db.commit()
    