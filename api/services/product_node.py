from fastapi import Depends

from api.db.models import ProductNode
from api.core.auth import AuthUser
from api.exceptions import NotFoundError
from api.repositories import ProductNodeRepository, UserRepository
from api.schemas import ProductNodeTreeDTO, ProductNodeCreateDTO, ProductNodeReadDTO


class ProductNodeService:

    def __init__(
        self,
        repo: ProductNodeRepository = Depends(),
        user_repo: UserRepository = Depends()
    ):
        self.repo = repo
        self.user_repo = user_repo

    
    def _get_node_dto(self, node: ProductNode) -> ProductNodeTreeDTO:
        return ProductNodeTreeDTO(
            id=node.id,
            name=node.name,
            children=node.children,
            products=node.products
        )


    async def get_products_list(self, user: AuthUser) -> list[ProductNodeReadDTO]:
        nodes = await self.repo.list_nodes(user.user_id)
        return [
            ProductNodeReadDTO(
                id=n.id,
                name=n.name,
                parent_id=n.parent_id,
                user_id=n.user_id,
                children=[c.id for c in n.children],
                products=[p.id for p in n.products],
            )
            for n in nodes
        ]


    async def get_products_tree(self, user: AuthUser) -> list[ProductNodeTreeDTO]:
        nodes = await self.repo.list_nodes(user.user_id)

        return [ProductNodeTreeDTO(
            id=node.id,
            name=node.name,
            children=node.children,
            products=node.products
        ) for node in nodes if node.parent_id is None]
    

    async def create_product_node(self, payload: ProductNodeCreateDTO, user: AuthUser) -> ProductNodeReadDTO:
        if not await self.user_repo.get_user_by_id(user.user_id):
            raise NotFoundError("Користувач", user.user_id)

        if payload.parent_id is not None:
            if not await self.repo.get_node_by_id(payload.parent_id, user.user_id):
                raise NotFoundError("Тип продукту", payload.parent_id)


        data = payload.model_dump(exclude_unset=True)
        data["user_id"] = user.user_id
        node = await self.repo.create_product_node(data)
        
        return ProductNodeReadDTO(
            id=node.id,
            name=node.name,
            parent_id=node.parent_id,
            user_id=node.user_id,
            children=[],
            products=[],
        )

    async def delete_product_node(self, obj_id: int, user: AuthUser):
        product_node = await self.repo.get_node_by_id(obj_id, user.user_id)
        if not product_node:
            raise NotFoundError("Тип продукту", obj_id)

        
        await self.repo.delete_product_node(product_node)