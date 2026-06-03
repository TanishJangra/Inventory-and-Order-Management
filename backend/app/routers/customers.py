from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..schemas import CustomerCreate, CustomerResponse
from ..crud import create_customer, get_customers, get_customer, delete_customer
from ..database import get_db

router = APIRouter(prefix="/customers", tags=["customers"])

@router.post("", response_model=CustomerResponse, status_code=201)
def create_customer_endpoint(customer: CustomerCreate, db: Session = Depends(get_db)):
    return create_customer(db, customer)

@router.get("", response_model=list[CustomerResponse])
def list_customers(db: Session = Depends(get_db)):
    return get_customers(db)

@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer_endpoint(customer_id: int, db: Session = Depends(get_db)):
    db_customer = get_customer(db, customer_id)
    if not db_customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return db_customer

@router.delete("/{customer_id}", response_model=CustomerResponse)
def delete_customer_endpoint(customer_id: int, db: Session = Depends(get_db)):
    return delete_customer(db, customer_id)
