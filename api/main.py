from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.cors import CORSMiddleware

from api.core.http_errors import register_exception_handler
from api.db.session import create_db
from api.routers import (
    products_router,
    product_nodes_router,
    sales_router
)


def create_app() -> FastAPI:
    @asynccontextmanager
    async def lifespan(app: FastAPI):
        await create_db()
        yield


    app = FastAPI(
        title="CRM",
        lifespan=lifespan,
        root_path="/api",
        docs_url="/v1/docs",
        redoc_url="/v1/redoc",
        openapi_url="/v1/openapi.json",
    )

    app.add_middleware(GZipMiddleware, minimum_size=1000)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost",
            "http://localhost:5173",
            "http://127.0.0.1",
            "http://127.0.0.1:5173",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(products_router, prefix="/v1/products", tags=["products"])
    app.include_router(product_nodes_router, prefix="/v1/product_nodes", tags=["product_nodes"])
    app.include_router(sales_router, prefix="/v1/sales", tags=["sales"])

    register_exception_handler(app)

    return app

app = create_app()


@app.get("/health")
def health():
    return {"status": "healthy"}
