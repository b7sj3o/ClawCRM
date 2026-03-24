
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import select

from api.db.models import User
from api.deps import get_db
from api.utils.db import save_create


class UserRepository:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.db = db


    async def list_users(self) -> list[User]:
        return await self.db.scalars(select(User).order_by(User.created_at.desc()))

    async def get_user_by_id(self, user_id: str) -> User | None:
        return await self.db.scalar(select(User).where(User.id == user_id))

    async def get_user_by_email(self, email: str) -> User | None:
        return await self.db.scalar(select(User).where(User.email == email))

    async def create_user(self, data) -> User:
        user = User(**data)
        await save_create(self.db, user)
        return user