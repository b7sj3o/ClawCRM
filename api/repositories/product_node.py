from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from api.db.models import ProductNode

from .base import BaseRepository


class ProductNodeRepository(BaseRepository[ProductNode]):
    def __init__(self) -> None:
        super().__init__(ProductNode)

    async def get_by_parent_id(
        self, db: AsyncSession, parent_id: int | None
    ) -> list[ProductNode]:
        if parent_id is None:
            result = await db.execute(
                select(ProductNode).where(ProductNode.parent_id.is_(None))
            )
        else:
            result = await db.execute(
                select(ProductNode).where(ProductNode.parent_id == parent_id)
            )
        return list(result.scalars().all())
