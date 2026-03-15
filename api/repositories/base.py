from collections.abc import Sequence
from typing import Generic, TypeVar

from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from api.db.base import Base

ModelT = TypeVar("ModelT", bound=Base)


class BaseRepository(Generic[ModelT]):
    def __init__(self, model: type[ModelT]):
        self.model = model

    async def get_by_id(self, db: AsyncSession, id: int) -> ModelT | None:
        result = await db.execute(select(self.model).where(self.model.id == id))
        return result.scalar_one_or_none()

    async def get_all(
        self,
        db: AsyncSession,
        *,
        skip: int = 0,
        limit: int = 100,
    ) -> Sequence[ModelT]:
        result = await db.execute(
            select(self.model).offset(skip).limit(limit).order_by(self.model.id)
        )
        return result.scalars().all()

    async def count(self, db: AsyncSession) -> int:
        result = await db.execute(select(func.count()).select_from(self.model))
        return result.scalar_one() or 0

    async def create(self, db: AsyncSession, **kwargs) -> ModelT:
        instance = self.model(**kwargs)
        db.add(instance)
        await db.flush()
        await db.refresh(instance)
        return instance

    async def update(self, db: AsyncSession, instance: ModelT, **kwargs) -> ModelT:
        for key, value in kwargs.items():
            if hasattr(instance, key):
                setattr(instance, key, value)
        await db.flush()
        await db.refresh(instance)
        return instance

    async def delete_by_id(self, db: AsyncSession, id: int) -> bool:
        result = await db.execute(delete(self.model).where(self.model.id == id))
        return result.rowcount > 0
