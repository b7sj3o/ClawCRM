from contextlib import asynccontextmanager

from fastapi import FastAPI

from api.db.session import create_db
from api.routes import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db()
    yield


app = FastAPI(title="CRM API", lifespan=lifespan)
app.include_router(api_router, prefix="/api/v1")
