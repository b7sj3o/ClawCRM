from fastapi import Depends

from api.db.models import ProductNode
from api.exceptions import NotFoundError
from api.repositories import ProductNodeRepository
from api.schemas import ProductNodeTreeDTO, ProductNodeCreateDTO, ProductNodeReadDTO


class ProductNodeService:

    def __init__(self, repo: ProductNodeRepository = Depends()):
        self.repo = repo

    
    def _get_node_dto(self, node: ProductNode) -> ProductNodeTreeDTO:
        return ProductNodeTreeDTO(
            id=node.id,
            name=node.name,
            children=node.children,
            products=node.products
        )


    async def get_products_list(self) -> list[ProductNodeReadDTO]:
        nodes = await self.repo.list_nodes()
        return [
            ProductNodeReadDTO(
                id=n.id,
                name=n.name,
                parent_id=n.parent_id,
                children=[c.id for c in n.children],
                products=[p.id for p in n.products],
            )
            for n in nodes
        ]


    async def get_products_tree(self) -> list[ProductNodeTreeDTO]:
        nodes = await self.repo.list_nodes()

        return [ProductNodeTreeDTO(
            id=node.id,
            name=node.name,
            children=node.children,
            products=node.products
        ) for node in nodes if node.parent_id is None]
    
    async def create_product_node(self, payload: ProductNodeCreateDTO) -> ProductNodeReadDTO:
        if payload.parent_id is not None:
            if not await self.repo.get_node_by_id(payload.parent_id):
                raise NotFoundError("Тип продукту", payload.parent_id)


        node = await self.repo.create_product_node(payload.model_dump(exclude_unset=True))
        return ProductNodeReadDTO(
            id=node.id,
            name=node.name,
            parent_id=node.parent_id,
        )

    async def delete_product_node(self, obj_id: int):
        product_node = await self.repo.get_node_by_id(obj_id)
        if not product_node:
            raise NotFoundError("Тип продукту", obj_id)

        
        await self.repo.delete_product_node(product_node)