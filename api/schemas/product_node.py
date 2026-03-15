from pydantic import BaseModel, ConfigDict


class ProductNodeBase(BaseModel):
    name: str
    parent_id: int | None = None


class ProductNodeCreate(ProductNodeBase):
    pass


class ProductNodeUpdate(BaseModel):
    name: str | None = None
    parent_id: int | None = None


class ProductNodeResponse(ProductNodeBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class ProductNodeList(BaseModel):
    items: list[ProductNodeResponse]
    total: int
