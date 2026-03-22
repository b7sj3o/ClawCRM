from fastapi import APIRouter, Depends

from api.services import ProductNodeService
from api.schemas import ProductNodeTreeDTO, ProductNodeReadDTO, ProductNodeCreateDTO


router = APIRouter()


@router.get("/", response_model=list[ProductNodeReadDTO])
async def list_nodes(service: ProductNodeService = Depends()):
    return await service.get_products_list()


@router.get("/tree", response_model=list[ProductNodeTreeDTO])
async def list_nodes_tree(service: ProductNodeService = Depends()):
    return await service.get_products_tree()


@router.post("/", response_model=ProductNodeReadDTO)
async def create_product(
    payload: ProductNodeCreateDTO,
    service: ProductNodeService = Depends()
):
    return await service.create_product_node(payload)


@router.delete("/{obj_id}")
async def delete_product(
    obj_id: int,
    service: ProductNodeService = Depends()
):
    return await service.delete_product_node(obj_id)
