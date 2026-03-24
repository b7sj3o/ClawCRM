"""

Revision ID: ab5cd89af683
Revises: 
Create Date: 2026-03-23 11:25:57.147379

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'ab5cd89af683'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute('ALTER TABLE users DROP COLUMN IF EXISTS password')

def downgrade() -> None:
    """Downgrade schema."""
    op.add_column('users', sa.Column('password', sa.String(255), nullable=True))