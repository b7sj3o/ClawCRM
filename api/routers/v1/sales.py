from fastapi import APIRouter, Depends

from api.core.auth import AuthUser, get_current_user, require_create
from api.schemas.sale import SaleCreateDTO, SaleReadDTO
from api.services.sale import SaleService

router = APIRouter()


@router.get("/", response_model=list[SaleReadDTO])
async def list_sales(
    user: AuthUser = Depends(get_current_user),
    sale_service: SaleService = Depends(),
):
    return await sale_service.list_sales(user)


@router.post("/", response_model=SaleReadDTO)
async def create_sale(
    payload: SaleCreateDTO,
    user: AuthUser = Depends(get_current_user),
    sale_service: SaleService = Depends(),
):
    return await sale_service.create_sale(payload, user)
