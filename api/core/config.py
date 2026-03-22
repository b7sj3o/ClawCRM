from enum import Enum

from pydantic import Field
from pydantic_settings import BaseSettings


class Environment(str, Enum):
    LOCAL = "local"
    DOCKER = "docker"
    PRODUCTION = "production"


class Settings(BaseSettings):
    debug: bool
    is_docker: bool
    environment: Environment
    log_format: str = Field(
        default="%(levelname)s - %(asctime)s - %(name)s - %(message)s | %(filename)s:%(lineno)d"
    )
    debug: bool = False
    log_format: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

    clerk_publishable_key: str
    clerk_secret_key: str
    jwks_url: str
    clerk_webhook_url: str
    clerk_webhook_secret: str

    frontend_url: str

    postgres_user: str
    postgres_password: str
    postgres_db: str
    postgres_host: str

    @property
    def database_url(self) -> str:
        return f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}@{self.postgres_host}/{self.postgres_db}"


    class Config:
        env_file = ".env"
        extra = "allow"