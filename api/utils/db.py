from sqlalchemy.ext.asyncio import AsyncSession

async def save_create(db: AsyncSession, instance: object):
    db.add(instance)
    await db.commit()
    await db.refresh(instance)


async def save_update(db: AsyncSession, instance: object):
    await db.commit()
    await db.refresh(instance)