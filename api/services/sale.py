from fastapi import Depends

from api.exceptions import NotFoundError, InsufficientStock
from api.repositories import ProductRepository
from api.repositories.sale import SaleRepository
from api.schemas.sale import SaleCreateDTO, SaleReadDTO
from api.core.auth import AuthUser

class SaleService:
    def __init__(self, repo: SaleRepository = Depends(), product_repo: ProductRepository = Depends()):
        self.repo = repo
        self.product_repo = product_repo

    async def list_sales(self, user: AuthUser) -> list[SaleReadDTO]:
        sales = await self.repo.list_sales_for_org(user.org_id)
        # res = []
        # for sale in sales:
        #     sale["product"] = {
        #         "id": sale.product.id,
        #         "name": sale.product.name
        #     }
        #     res.append(SaleReadDTO.model_validate(sale))
        
        # return res
        return [SaleReadDTO.model_validate(sale) for sale in sales]

    async def create_sale(self, payload: SaleCreateDTO, user: AuthUser) -> SaleReadDTO:
        product = await self.product_repo.get_product_by_id(payload.product_id)
            
        if not product:
            raise NotFoundError("Продукт", payload.product_id)

        if product.quantity < payload.quantity:
            raise InsufficientStock(product.quantity)

        data = payload.model_dump()
        data["org_id"] = user.org_id
        data["created_by"] = user.user_id

        sale = await self.repo.create_sale(data, product)

        return SaleReadDTO.model_validate(sale)
