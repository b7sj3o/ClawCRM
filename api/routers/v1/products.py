from fastapi import APIRouter, Depends

from api.core.auth import require_create, require_delete, require_view, AuthUser
from api.schemas import ProductReadDTO
from api.schemas.product import ProductCreateDTO
from api.services import ProductService


router = APIRouter()


@router.get("/", response_model=list[ProductReadDTO])
async def list_products(
    user: AuthUser = Depends(require_view),
    service: ProductService = Depends()
):
    return await service.list_products(user)


@router.post("/", response_model=ProductReadDTO)
async def create_product(
    payload: ProductCreateDTO,
    user: AuthUser = Depends(require_create),
    service: ProductService = Depends()
):
    return await service.create_product(payload, user)


@router.delete("/{obj_id}")
async def delete_products(
    obj_id: int,
    user: AuthUser = Depends(require_delete),
    service: ProductService = Depends()
):
    return await service.delete_product(obj_id, user)