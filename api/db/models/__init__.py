from datetime import datetime, timezone
from decimal import Decimal
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, Text, JSON, ForeignKey, DECIMAL
from sqlalchemy.orm import relationship, Mapped, mapped_column

from api.db.base import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)

    buy_price: Mapped[Decimal] = mapped_column(DECIMAL, nullable=False)
    sell_price: Mapped[Decimal] = mapped_column(DECIMAL, nullable=False)

    quantity: Mapped[int] = mapped_column(Integer, nullable=False)

    node_id: Mapped[int] = mapped_column(
        ForeignKey("product_nodes.id"),
        nullable=False
    )

    node: Mapped["ProductNode"] = relationship("ProductNode")


    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class ProductNode(Base):
    __tablename__ = "product_nodes"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)

    parent_id: Mapped[int | None] = mapped_column(
        ForeignKey("product_nodes.id"),
        nullable=True
    )

    parent: Mapped["ProductNode"] = relationship(
        "ProductNode",
        remote_side=[id],
        backref="children"
    )
