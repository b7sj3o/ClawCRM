from fastapi import APIRouter, Depends

from api.schemas import ProductReadDTO
from api.schemas.product import ProductCreateDTO
from api.services import ProductService


router = APIRouter()


@router.get("/", response_model=list[ProductReadDTO])
async def list_products(
    service: ProductService = Depends()
):
    return await service.list_products()


@router.post("/", response_model=ProductReadDTO)
async def create_product(
    payload: ProductCreateDTO,
    service: ProductService = Depends()
):
    return await service.create_product(payload)


@router.delete("/{obj_id}")
async def delete_products(
    obj_id: int,
    service: ProductService = Depends()
):
    return await service.delete_product(obj_id)