import json
from datetime import datetime
from decimal import Decimal
from enum import Enum

from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import DeclarativeBase


class Base(AsyncAttrs, DeclarativeBase):
    def __repr__(self) -> str:
        try:
            fields = list(self.__table__.columns())[1:]
            return (
                f"{self.__class__.__name__}("
                f"{', '.join(f'{k}={v}' for k, v in fields)})"
            )
        except Exception as e:
            return f"Error in __repr__: {e}"

    def as_dict(self) -> dict:
        result = {}
        for column in self.__table__.columns:
            value = getattr(self, column.name)
            if isinstance(value, datetime):
                value = value.isoformat()
            elif isinstance(value, Enum):
                value = value.value
            elif isinstance(value, Decimal):
                value = str(value)
            result[column.name] = value
        return result

    def as_json(self) -> str:
        return json.dumps(self.as_dict())
