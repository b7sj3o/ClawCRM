from api.schemas.base import BaseModel
from api.schemas.product import ProductReadTreeDTO



class ProductNodeReadDTO(BaseModel):
    id: int
    name: str
    parent_id: int | None = None
    children: list[int] = []
    products: list[int] = []



class ProductNodeCreateDTO(BaseModel):
    name: str
    parent_id: int | None = None


class ProductNodeTreeDTO(BaseModel):
    id: int
    name: str
    children: list["ProductNodeTreeDTO"] = []
    products: list[ProductReadTreeDTO] = []


# used to resolve forward references in recursive models
ProductNodeTreeDTO.model_rebuild() 