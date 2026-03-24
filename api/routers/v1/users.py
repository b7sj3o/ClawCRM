from fastapi import APIRouter, Depends

from api.schemas import UserReadDTO
from api.services import UserService


router = APIRouter()


@router.get("/", response_model=list[UserReadDTO])
async def list_users(
    service: UserService = Depends()
):
    return await service.list_users()
