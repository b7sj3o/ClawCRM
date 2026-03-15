from fastapi import APIRouter

from api.routes import products, product_nodes

api_router = APIRouter()

api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(
    product_nodes.router, prefix="/product-nodes", tags=["product-nodes"]
)
