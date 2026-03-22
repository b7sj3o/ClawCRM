from api.core.config import Settings

from clerk_backend_api import Clerk
from svix.webhooks import Webhook


clerk = Clerk(bearer_auth=Settings().clerk_secret_key)
clerk_webhook = Webhook(whsecret=Settings().clerk_webhook_secret)