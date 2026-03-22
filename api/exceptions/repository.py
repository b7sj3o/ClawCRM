
from api.exceptions.base import AppError


class RepositoryError(AppError):
    pass


class NotFoundError(RepositoryError):
    def __init__(self, name: str, id: int):
        self.msg = f"{name} з ID={id} не знайдено"
