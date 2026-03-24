from datetime import datetime

from api.schemas.base import BaseModel


class UserReadDTO(BaseModel):
    id: str
    first_name: str | None
    last_name: str | None
    username: str
    email: str
    last_seen_at: datetime
    created_at: datetime
    updated_at: datetime


class UserCreateDTO(BaseModel):
    id: str
    first_name: str | None = None
    last_name: str | None = None
    username: str
    email: str