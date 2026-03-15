from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from api.db.models import Product

from .base import BaseRepository


class ProductRepository(BaseRepository[Product]):
    def __init__(self) -> None:
        super().__init__(Product)

    async def get_by_node_id(
        self, db: AsyncSession, node_id: int
    ) -> list[Product]:
        result = await db.execute(select(Product).where(Product.node_id == node_id))
        return list(result.scalars().all())
