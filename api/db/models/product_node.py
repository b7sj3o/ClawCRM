import __future__

from datetime import datetime, timezone
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, String, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column

from api.db.base import Base


if TYPE_CHECKING:
    from api.db.models.product import Product
    from api.db.models.user import User



class ProductNode(Base):
    __tablename__ = "product_nodes"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)

    parent_id: Mapped[int | None] = mapped_column(
        ForeignKey("product_nodes.id"),
        nullable=True,
        index=True
    )

    user_id: Mapped[str] = mapped_column(String(255), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    user: Mapped["User"] = relationship(
        "User",
        back_populates="product_nodes",
        cascade="all, delete"
    )

    parent: Mapped["ProductNode"] = relationship(
        "ProductNode",
        remote_side=[id],
        back_populates="children"
    )

    children: Mapped[list["ProductNode"]] = relationship(
        "ProductNode",
        back_populates="parent",
        cascade="all, delete"
    )

    products: Mapped[list["Product"]] = relationship(
        "Product",
        back_populates="node",
        cascade="all, delete-orphan"
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )