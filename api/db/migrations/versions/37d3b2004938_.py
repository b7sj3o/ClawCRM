"""

Revision ID: 37d3b2004938
Revises: ab5cd89af683
Create Date: 2026-03-23 11:49:08.776766

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '37d3b2004938'
down_revision: Union[str, Sequence[str], None] = 'ab5cd89af683'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _get_column_type(inspector: sa.Inspector, table_name: str, column_name: str) -> str | None:
    for column in inspector.get_columns(table_name):
        if column["name"] == column_name:
            return str(column["type"]).lower()
    return None


def _has_column(inspector: sa.Inspector, table_name: str, column_name: str) -> bool:
    return any(column["name"] == column_name for column in inspector.get_columns(table_name))


def _has_fk(inspector: sa.Inspector, table_name: str, constraint_name: str) -> bool:
    return any(
        foreign_key["name"] == constraint_name
        for foreign_key in inspector.get_foreign_keys(table_name)
    )


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not _has_column(inspector, "products", "user_id"):
        op.add_column("products", sa.Column("user_id", sa.String(length=255), nullable=True))

    if not _has_column(inspector, "product_nodes", "user_id"):
        op.add_column("product_nodes", sa.Column("user_id", sa.String(length=255), nullable=True))

    inspector = sa.inspect(bind)

    if _has_fk(inspector, "products", "products_user_id_fkey"):
        op.drop_constraint("products_user_id_fkey", "products", type_="foreignkey")

    if _has_fk(inspector, "product_nodes", "product_nodes_user_id_fkey"):
        op.drop_constraint("product_nodes_user_id_fkey", "product_nodes", type_="foreignkey")

    users_id_type = _get_column_type(inspector, "users", "id")
    if users_id_type and "integer" in users_id_type:
        op.alter_column(
            "users",
            "id",
            type_=sa.String(255),
            existing_type=sa.Integer(),
            postgresql_using="id::varchar(255)",
        )

    products_user_id_type = _get_column_type(inspector, "products", "user_id")
    if products_user_id_type and "integer" in products_user_id_type:
        op.alter_column(
            "products",
            "user_id",
            type_=sa.String(255),
            existing_type=sa.Integer(),
            postgresql_using="user_id::varchar(255)",
        )

    product_nodes_user_id_type = _get_column_type(inspector, "product_nodes", "user_id")
    if product_nodes_user_id_type and "integer" in product_nodes_user_id_type:
        op.alter_column(
            "product_nodes",
            "user_id",
            type_=sa.String(255),
            existing_type=sa.Integer(),
            postgresql_using="user_id::varchar(255)",
        )

    inspector = sa.inspect(bind)

    if not _has_fk(inspector, "products", "products_user_id_fkey"):
        op.create_foreign_key(
            "products_user_id_fkey",
            "products",
            "users",
            ["user_id"],
            ["id"],
        )

    if not _has_fk(inspector, "product_nodes", "product_nodes_user_id_fkey"):
        op.create_foreign_key(
            "product_nodes_user_id_fkey",
            "product_nodes",
            "users",
            ["user_id"],
            ["id"],
            ondelete="CASCADE",
        )


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if _has_fk(inspector, "products", "products_user_id_fkey"):
        op.drop_constraint("products_user_id_fkey", "products", type_="foreignkey")

    if _has_fk(inspector, "product_nodes", "product_nodes_user_id_fkey"):
        op.drop_constraint("product_nodes_user_id_fkey", "product_nodes", type_="foreignkey")

    products_user_id_type = _get_column_type(inspector, "products", "user_id")
    if products_user_id_type and "char" in products_user_id_type:
        op.alter_column(
            "products",
            "user_id",
            type_=sa.Integer(),
            existing_type=sa.String(255),
            postgresql_using="user_id::integer",
        )

    product_nodes_user_id_type = _get_column_type(inspector, "product_nodes", "user_id")
    if product_nodes_user_id_type and "char" in product_nodes_user_id_type:
        op.alter_column(
            "product_nodes",
            "user_id",
            type_=sa.Integer(),
            existing_type=sa.String(255),
            postgresql_using="user_id::integer",
        )

    users_id_type = _get_column_type(inspector, "users", "id")
    if users_id_type and "char" in users_id_type:
        op.alter_column(
            "users",
            "id",
            type_=sa.Integer(),
            existing_type=sa.String(255),
            postgresql_using="id::integer",
        )

    inspector = sa.inspect(bind)

    if not _has_fk(inspector, "products", "products_user_id_fkey"):
        op.create_foreign_key(
            "products_user_id_fkey",
            "products",
            "users",
            ["user_id"],
            ["id"],
        )

    if not _has_fk(inspector, "product_nodes", "product_nodes_user_id_fkey"):
        op.create_foreign_key(
            "product_nodes_user_id_fkey",
            "product_nodes",
            "users",
            ["user_id"],
            ["id"],
            ondelete="CASCADE",
        )