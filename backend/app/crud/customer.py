from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from ..models import Customer
from ..schemas import CustomerCreate


def create_customer(db: Session, customer: CustomerCreate):
    existing = db.query(Customer).filter(Customer.email == customer.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")
    db_customer = Customer(**customer.dict())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer


def get_customers(db: Session):
    return db.query(Customer).all()


def get_customer(db: Session, customer_id: int):
    return db.query(Customer).filter(Customer.id == customer_id).first()


def delete_customer(db: Session, customer_id: int):
    db_customer = get_customer(db, customer_id)
    if not db_customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    if db_customer.orders:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete a customer with existing orders",
        )
    db.delete(db_customer)
    db.commit()
    return db_customer
