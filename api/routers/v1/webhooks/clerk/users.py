import json

from fastapi import APIRouter, Depends
from fastapi.requests import Request

from api.exceptions.clerk import ClerkVerificationError
from api.services.user import UserService
from api.core.clerk import clerk_webhook

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

    if data["type"] == "user.created":
        user = data["data"]

        email = user["email_addresses"][0]["email_address"]

        user = await user_service.create_user(email)

        return user
        
    
