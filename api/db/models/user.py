import __future__

from typing import TYPE_CHECKING
from datetime import datetime, timezone

from sqlalchemy.types import String, DateTime
from sqlalchemy.orm import relationship, Mapped, mapped_column

from api.db.base import Base

if TYPE_CHECKING:
    from api.db.models.product import Product
    from api.db.models.product_node import ProductNode



class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(255),primary_key=True) # clerk id

    username: Mapped[str] = mapped_column(nullable=False, unique=True) 
    email: Mapped[str] = mapped_column(nullable=False, unique=True, index=True)

    first_name: Mapped[str] = mapped_column(nullable=True)
    last_name: Mapped[str] = mapped_column(nullable=True)
    
    last_seen_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    product_nodes: Mapped[list["ProductNode"]] = relationship(
        "ProductNode",
        back_populates="user"
    )

    products: Mapped[list["Product"]] = relationship(
        "Product",
        back_populates="user"
    )

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
