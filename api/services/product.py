from fastapi import Depends

from api.core.auth import AuthUser
from api.exceptions import NotFoundError
from api.repositories import ProductNodeRepository, ProductRepository, UserRepository
from api.schemas import ProductCreateDTO, ProductReadDTO


class ProductService:

    def __init__(
        self, 
        repo: ProductRepository = Depends(),
        node_repo: ProductNodeRepository = Depends(),
        user_repo: UserRepository = Depends(),
    ):
        self.repo = repo
        self.node_repo = node_repo
        self.user_repo = user_repo


    async def list_products(self, user: AuthUser) -> list[ProductReadDTO]:
        return await self.repo.list_products(user.user_id)


    async def create_product(self, payload: ProductCreateDTO, user: AuthUser) -> ProductReadDTO:
        if not await self.user_repo.get_user_by_id(user.user_id):
            raise NotFoundError("Користувач", user.user_id)

        if not await self.node_repo.get_node_by_id(payload.node_id, user.user_id):
            raise NotFoundError("Тип продукту", payload.node_id)

        data = payload.model_dump(exclude_unset=True)
        data["user_id"] = user.user_id

        product = await self.repo.create_product(data)

        return ProductReadDTO.model_validate(product)

    async def delete_product(self, obj_id: int, user: AuthUser):
        product = await self.repo.get_product_by_id(obj_id, user.user_id)

        if not product:
            raise NotFoundError("Продукт", obj_id)

        await self.repo.delete_product(product)