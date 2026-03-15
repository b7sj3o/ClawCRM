from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from api.deps import get_db
from api.schemas.product_node import (
    ProductNodeCreate,
    ProductNodeList,
    ProductNodeResponse,
    ProductNodeUpdate,
)
from api.services.product_node import ProductNodeService

router = APIRouter()


@router.get("", response_model=ProductNodeList)
async def list_product_nodes(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    parent_id: int | None = Query(None, description="Filter by parent_id"),
):
    return await ProductNodeService.get_list(
        db, skip=skip, limit=limit, parent_id=parent_id
    )


@router.get("/roots", response_model=list[ProductNodeResponse])
async def list_root_nodes(db: AsyncSession = Depends(get_db)):
    """Get all root nodes (nodes without parent)."""
    return await ProductNodeService.get_roots(db)


@router.get("/{node_id}", response_model=ProductNodeResponse)
async def get_product_node(
    node_id: int,
    db: AsyncSession = Depends(get_db),
):
    node = await ProductNodeService.get_by_id(db, node_id)
    if not node:
        raise HTTPException(status_code=404, detail="Product node not found")
    return node


@router.post("", response_model=ProductNodeResponse, status_code=201)
async def create_product_node(
    node_in: ProductNodeCreate,
    db: AsyncSession = Depends(get_db),
):
    return await ProductNodeService.create(db, node_in)


@router.patch("/{node_id}", response_model=ProductNodeResponse)
async def update_product_node(
    node_id: int,
    node_in: ProductNodeUpdate,
    db: AsyncSession = Depends(get_db),
):
    node = await ProductNodeService.get_by_id(db, node_id)
    if not node:
        raise HTTPException(status_code=404, detail="Product node not found")
    return await ProductNodeService.update(db, node, node_in)


@router.delete("/{node_id}", status_code=204)
async def delete_product_node(
    node_id: int,
    db: AsyncSession = Depends(get_db),
):
    deleted = await ProductNodeService.delete(db, node_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Product node not found")
