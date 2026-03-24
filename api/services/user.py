from fastapi import Depends

from api.core.auth import AuthUser
from api.schemas.user import UserCreateDTO, UserReadDTO
from api.utils.validators import is_email_valid
from api.repositories.user import UserRepository
from api.exceptions.domain import InvalidEmailError
from api.exceptions.repository import NotFoundError


class UserService:
    def __init__(self, repo: UserRepository = Depends()):
        self.repo = repo

    async def list_users(self) -> list[UserReadDTO]:
        users = await self.repo.list_users()
        return [UserReadDTO.model_validate(user) for user in users]

    async def create_user(self, payload: UserCreateDTO) -> UserReadDTO:
        if not is_email_valid(payload.email):
            raise InvalidEmailError(payload.email)

        existing = await self.repo.get_user_by_id(payload.id)
        if existing:
            return UserReadDTO.model_validate(existing)

        user = await self.repo.create_user(payload.model_dump(exclude_unset=True))
        return UserReadDTO.model_validate(user)