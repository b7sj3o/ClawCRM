from api.exceptions.base import AppError


class DomainError(AppError):
    pass


class InsufficientStock(DomainError):
    def __init__(self, existing_amount: int):
        self.msg = f"Недостатня к-сть товару, залишилось: {existing_amount} од."

    
class ClerkVerificationError(DomainError):
    def __init__(self):
        self.msg = "Не вдалось верифікувати ключ Clerk"


class InvalidEmailError(DomainError):
    def __init__(self, email: str):
        self.msg = f"{email} не є валідним email"