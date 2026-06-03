from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..schemas import OrderCreate, OrderResponse
from ..crud import create_order, get_orders, get_order, delete_order
from ..database import get_db

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("", response_model=OrderResponse, status_code=201)
def create_order_endpoint(order: OrderCreate, db: Session = Depends(get_db)):
    return create_order(db, order)

@router.get("", response_model=list[OrderResponse])
def list_orders(db: Session = Depends(get_db)):
    return get_orders(db)

@router.get("/{order_id}", response_model=OrderResponse)
def get_order_endpoint(order_id: int, db: Session = Depends(get_db)):
    db_order = get_order(db, order_id)
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order

@router.delete("/{order_id}", response_model=OrderResponse)
def delete_order_endpoint(order_id: int, db: Session = Depends(get_db)):
    return delete_order(db, order_id)
