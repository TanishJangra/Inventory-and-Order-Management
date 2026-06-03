from typing import List
from pydantic import BaseModel, conint

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: conint(gt=0)

class OrderCreate(BaseModel):
    customer_id: int
    items: List[OrderItemCreate]

class OrderItemResponse(BaseModel):
    product_id: int
    quantity: int
    unit_price: float

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    customer_id: int
    total_amount: float
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True
