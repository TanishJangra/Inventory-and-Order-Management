import os
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError
from .database import engine, Base
from .routers.products import router as products_router
from .routers.customers import router as customers_router
from .routers.orders import router as orders_router


def wait_for_database(retries: int = 15, delay_seconds: float = 2.0):
    last_exception = None
    for attempt in range(1, retries + 1):
        try:
            Base.metadata.create_all(bind=engine)
            return
        except OperationalError as exc:
            last_exception = exc
            if attempt == retries:
                break
            time.sleep(delay_seconds)
    raise last_exception


wait_for_database()

app = FastAPI(title="Inventory and Order Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://inventoryandordermanagement.netlify.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products_router)
app.include_router(customers_router)
app.include_router(orders_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=int(os.getenv("PORT", 8000)), reload=False)
