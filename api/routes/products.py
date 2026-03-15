from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from api.deps import get_db
from api.schemas.product import (
    ProductCreate,
    ProductList,
    ProductResponse,
    ProductUpdate,
)
from api.services.product import ProductService

router = APIRouter()


@router.get("", response_model=ProductList)
async def list_products(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    node_id: int | None = Query(None, description="Filter by node_id"),
):
    return await ProductService.get_list(
        db, skip=skip, limit=limit, node_id=node_id
    )


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
):
    product = await ProductService.get_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("", response_model=ProductResponse, status_code=201)
async def create_product(
    product_in: ProductCreate,
    db: AsyncSession = Depends(get_db),
):
    return await ProductService.create(db, product_in)


@router.patch("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    product_in: ProductUpdate,
    db: AsyncSession = Depends(get_db),
):
    product = await ProductService.get_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return await ProductService.update(db, product, product_in)


@router.delete("/{product_id}", status_code=204)
async def delete_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
):
    deleted = await ProductService.delete(db, product_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Product not found")
