from fastapi import APIRouter, Depends

from api.core.auth import require_create, require_delete, require_view, AuthUser
from api.services import ProductNodeService
from api.schemas import ProductNodeTreeDTO, ProductNodeReadDTO, ProductNodeCreateDTO


router = APIRouter()


@router.get("/", response_model=list[ProductNodeReadDTO])
async def list_nodes(
    user: AuthUser = Depends(require_view),
    service: ProductNodeService = Depends(),
):
    return await service.get_products_list(user)


@router.get("/tree", response_model=list[ProductNodeTreeDTO])
async def list_nodes_tree(
    user: AuthUser = Depends(require_view),
    service: ProductNodeService = Depends(),
):
    return await service.get_products_tree(user)


@router.post("/", response_model=ProductNodeReadDTO)
async def create_product_node(
    payload: ProductNodeCreateDTO,
    user: AuthUser = Depends(require_create),
    service: ProductNodeService = Depends()
):
    return await service.create_product_node(payload, user)


@router.delete("/{obj_id}")
async def delete_product_node(
    obj_id: int,
    user: AuthUser = Depends(require_delete),
    service: ProductNodeService = Depends()
):
    return await service.delete_product_node(obj_id, user)
