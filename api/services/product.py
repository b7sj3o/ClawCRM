from sqlalchemy.ext.asyncio import AsyncSession

from api.db.models import Product
from api.repositories.product import ProductRepository
from api.schemas.product import ProductCreate, ProductList, ProductUpdate

product_repository = ProductRepository()


class ProductService:
    @staticmethod
    async def get_by_id(db: AsyncSession, product_id: int) -> Product | None:
        return await product_repository.get_by_id(db, product_id)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        *,
        skip: int = 0,
        limit: int = 100,
        node_id: int | None = None,
    ) -> ProductList:
        if node_id is not None:
            items = await product_repository.get_by_node_id(db, node_id)
            total = len(items)
        else:
            items = await product_repository.get_all(db, skip=skip, limit=limit)
            total = await product_repository.count(db)
        return ProductList(
            items=items,
            total=total,
        )

    @staticmethod
    async def create(db: AsyncSession, data: ProductCreate) -> Product:
        return await product_repository.create(
            db,
            name=data.name,
            description=data.description,
            buy_price=data.buy_price,
            sell_price=data.sell_price,
            quantity=data.quantity,
            node_id=data.node_id,
        )

    @staticmethod
    async def update(
        db: AsyncSession, product: Product, data: ProductUpdate
    ) -> Product:
        update_data = data.model_dump(exclude_unset=True)
        return await product_repository.update(db, product, **update_data)

    @staticmethod
    async def delete(db: AsyncSession, product_id: int) -> bool:
        return await product_repository.delete_by_id(db, product_id)
