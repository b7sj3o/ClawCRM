from fastapi import Depends

from api.exceptions import NotFoundError
from api.repositories import ProductNodeRepository, ProductRepository
from api.schemas import ProductCreateDTO, ProductReadDTO


class ProductService:

    def __init__(
        self, 
        repo: ProductRepository = Depends(),
        node_repo: ProductNodeRepository = Depends()
    ):
        self.repo = repo
        self.node_repo = node_repo


    async def list_products(self) -> list[ProductReadDTO]:
        return await self.repo.list_products()


    async def create_product(self, payload: ProductCreateDTO) -> ProductReadDTO:
        if not await self.node_repo.get_node_by_id(payload.node_id):
            raise NotFoundError("Тип продукту", payload.node_id)
            
        product = await self.repo.create_product(payload.model_dump(exclude_unset=True))

        return ProductReadDTO.model_validate(product)

    async def delete_product(self, obj_id: int):
        product = await self.repo.get_product_by_id(obj_id)

        if not product:
            raise NotFoundError("Продукт", obj_id)

        await self.repo.delete_product(product)