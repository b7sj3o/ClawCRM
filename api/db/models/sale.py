import __future__

from typing import TYPE_CHECKING
from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import Integer, String, DateTime, Text, ForeignKey, DECIMAL
from sqlalchemy.orm import relationship, Mapped, mapped_column

from api.db.base import Base

if TYPE_CHECKING:
    from api.db.models.product import Product



class Sale(Base):
    __tablename__ = "sales"

    id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True)

    product_id: Mapped[int] = mapped_column(ForeignKey("products.id", ondelete="SET NULL"), nullable=False)
    product: Mapped["Product"] = relationship("Product", back_populates="sales")

    buy_price: Mapped[Decimal] = mapped_column(DECIMAL, nullable=False)
    sell_price: Mapped[Decimal] = mapped_column(DECIMAL, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)

    created_by: Mapped[str] = mapped_column(nullable=False) 
    org_id: Mapped[str] = mapped_column(nullable=False, index=True) 

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )