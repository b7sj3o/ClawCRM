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


def upgrade() -> None:
    op.drop_constraint('products_user_id_fkey', 'products', type_='foreignkey')
    op.drop_constraint('product_nodes_user_id_fkey', 'product_nodes', type_='foreignkey')

    op.alter_column(
        'users',
        'id',
        type_=sa.String(255),
        existing_type=sa.Integer,
        postgresql_using='id::varchar(255)',
    )
    op.alter_column(
        'products',
        'user_id',
        type_=sa.String(255),
        existing_type=sa.Integer,
        postgresql_using='user_id::varchar(255)',
    )
    op.alter_column(
        'product_nodes',
        'user_id',
        type_=sa.String(255),
        existing_type=sa.Integer,
        postgresql_using='user_id::varchar(255)',
    )

    op.create_foreign_key(
        'products_user_id_fkey',
        'products',
        'users',
        ['user_id'],
        ['id'],
    )
    op.create_foreign_key(
        'product_nodes_user_id_fkey',
        'product_nodes',
        'users',
        ['user_id'],
        ['id'],
        ondelete='CASCADE',
    )


def downgrade() -> None:
    op.drop_constraint('products_user_id_fkey', 'products', type_='foreignkey')
    op.drop_constraint('product_nodes_user_id_fkey', 'product_nodes', type_='foreignkey')

    op.alter_column(
        'products',
        'user_id',
        type_=sa.Integer,
        existing_type=sa.String(255),
        postgresql_using='user_id::integer',
    )
    op.alter_column(
        'product_nodes',
        'user_id',
        type_=sa.Integer,
        existing_type=sa.String(255),
        postgresql_using='user_id::integer',
    )
    op.alter_column(
        'users',
        'id',
        type_=sa.Integer,
        existing_type=sa.String(255),
        postgresql_using='id::integer',
    )

    op.create_foreign_key(
        'products_user_id_fkey',
        'products',
        'users',
        ['user_id'],
        ['id'],
    )
    op.create_foreign_key(
        'product_nodes_user_id_fkey',
        'product_nodes',
        'users',
        ['user_id'],
        ['id'],
        ondelete='CASCADE',
    )