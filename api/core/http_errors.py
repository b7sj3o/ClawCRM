from fastapi import FastAPI
from fastapi.responses import JSONResponse
from httpx import Request

from api.exceptions.domain import ClerkVerificationError, DomainError, InsufficientStock
from api.exceptions.repository import NotFoundError, RepositoryError


def register_exception_handler(app: FastAPI):

    @app.exception_handler(DomainError)
    def handle_domain_errors(request: Request, exc: DomainError):

        if isinstance(exc, InsufficientStock):
            status_code = 422
            msg = exc.msg
        else:
            status_code = 500
            msg = "Трапилась помилка"
        
        return JSONResponse(
            status_code=status_code,
            content={
                "detail": msg
            }
        )

    @app.exception_handler(RepositoryError)
    def handle_repository_errors(request: Request, exc: RepositoryError):
        if isinstance(exc, NotFoundError):
            status_code = 404
            msg = exc.msg
        elif isinstance(exc, ClerkVerificationError):
            status_code = 498
            msg = exc.msg
        else:
            status_code = 500
            msg = "Трапилась помилка"

        return JSONResponse(
            status_code=status_code,
            content={
                "detail": msg
            }
        )