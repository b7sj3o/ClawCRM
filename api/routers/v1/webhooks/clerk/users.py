import json

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.requests import Request

from api.exceptions.domain import ClerkVerificationError
from api.services.user import UserService
from api.core.clerk import clerk_webhook
from api.schemas.user import UserCreateDTO

router = APIRouter()


@router.post("/")
async def create_user(
    request: Request,
    user_service: UserService = Depends()
):
    body = await request.body()

    data = json.loads(body)

    try:
        clerk_webhook.verify(body, request.headers)
    except Exception:
        raise ClerkVerificationError()

    if data.get("type") == "user.created":
        user = data.get("data") or {}
        email_addresses = user.get("email_addresses") or []

        if not email_addresses:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No emails in Clerk payload")

        email = email_addresses[0].get("email_address")
        if not email:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No email_address in Clerk payload")

        username = user.get("username")
        if username is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No username in Clerk payload")

        payload = UserCreateDTO(
            id=user.get("id"),
            first_name=user.get("first_name"),
            last_name=user.get("last_name"),
            email=email,
            username=username,
        )

        return await user_service.create_user(payload)

    return {"detail": "Ignored event"}
