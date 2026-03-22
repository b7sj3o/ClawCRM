from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from api.core.loggers import logger
from api.db.base import Base
from api.core.config import Settings
from api.core.config import Environment

settings = Settings()

engine = create_async_engine(
    url=settings.database_url,
    echo=settings.environment == Environment.LOCAL,
    pool_pre_ping=True,
    pool_recycle=1800,  # 30 хв
    connect_args={
        "prepared_statement_cache_size": 0
    }
)
async_session = async_sessionmaker(
    bind=engine, expire_on_commit=False, class_=AsyncSession
)


async def create_db():
    async with engine.begin() as conn:
        logger.info("Creating database tables")
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables created")
