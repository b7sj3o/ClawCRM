import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path

from api.core.config import Settings

# Logging path
LOG_DIR = Path.cwd() / "logs"
LOG_DIR.mkdir(parents=True, exist_ok=True)

settings = Settings()


def build_logger(
    name: str,
    level: int = logging.DEBUG,
    log_file: str | None = None,
    log_format: str | None = None,
):
    """
    Повертає налаштований логер для модуля
    :param name: ім'я логера (__name__ модуля)
    :param level: рівень логування
    :param log_file: шлях до файлу (якщо None, лог лише в консоль)
    :param log_format: формат лог-повідомлень
    """
    log_format = log_format or settings.log_format

    logger = logging.getLogger(name)
    logger.setLevel(level)
    logger.propagate = False

    # Clear existing handlers to avoid duplicates on repeated calls
    logger.handlers.clear()

    formatter = logging.Formatter(log_format)

    if log_file:
        file_path = LOG_DIR / log_file
        if not file_path.parent.exists():
            file_path.parent.mkdir(parents=True, exist_ok=True)

        file_handler = RotatingFileHandler(
            filename=file_path,
            maxBytes=10 * 1024 * 1024,
            backupCount=5,
            encoding="utf-8",
        )
        file_handler.setFormatter(formatter)
        file_handler.setLevel(level)
        logger.addHandler(file_handler)

    # console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.DEBUG)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    return logger


logger = build_logger(
    name="api",
    log_format=settings.log_format,
    log_file="api/api.log",
)

db_logger = build_logger(
    name="api.db",
    log_format=settings.log_format,
    log_file="api/api.log",
)
