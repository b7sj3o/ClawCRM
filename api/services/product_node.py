from sqlalchemy.ext.asyncio import AsyncSession

from api.db.models import ProductNode
from api.repositories.product_node import ProductNodeRepository
from api.schemas.product_node import (
    ProductNodeCreate,
    ProductNodeList,
    ProductNodeUpdate,
)

product_node_repository = ProductNodeRepository()


class ProductNodeService:
    @staticmethod
    async def get_by_id(db: AsyncSession, node_id: int) -> ProductNode | None:
        return await product_node_repository.get_by_id(db, node_id)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        *,
        skip: int = 0,
        limit: int = 100,
        parent_id: int | None = None,
    ) -> ProductNodeList:
        if parent_id is not None:
            items = await product_node_repository.get_by_parent_id(
                db, parent_id=parent_id
            )
            total = len(items)
        else:
            items = await product_node_repository.get_all(
                db, skip=skip, limit=limit
            )
            total = await product_node_repository.count(db)
        return ProductNodeList(
            items=list(items),
            total=total,
        )

    @staticmethod
    async def get_roots(db: AsyncSession) -> list[ProductNode]:
        return await product_node_repository.get_by_parent_id(
            db, parent_id=None
        )

    @staticmethod
    async def create(db: AsyncSession, data: ProductNodeCreate) -> ProductNode:
        return await product_node_repository.create(
            db,
            name=data.name,
            parent_id=data.parent_id,
        )

    @staticmethod
    async def update(
        db: AsyncSession, node: ProductNode, data: ProductNodeUpdate
    ) -> ProductNode:
        update_data = data.model_dump(exclude_unset=True)
        return await product_node_repository.update(db, node, **update_data)

    @staticmethod
    async def delete(db: AsyncSession, node_id: int) -> bool:
        return await product_node_repository.delete_by_id(db, node_id)
