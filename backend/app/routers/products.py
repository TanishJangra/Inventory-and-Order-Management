from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..schemas import ProductCreate, ProductResponse, ProductUpdate
from ..crud import create_product, get_products, get_product, update_product, delete_product
from ..database import get_db

router = APIRouter(prefix="/products", tags=["products"])

@router.post("", response_model=ProductResponse, status_code=201)
def create_product_endpoint(product: ProductCreate, db: Session = Depends(get_db)):
    return create_product(db, product)

@router.get("", response_model=list[ProductResponse])
def list_products(db: Session = Depends(get_db)):
    return get_products(db)

@router.get("/{product_id}", response_model=ProductResponse)
def get_product_endpoint(product_id: int, db: Session = Depends(get_db)):
    db_product = get_product(db, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.put("/{product_id}", response_model=ProductResponse)
def update_product_endpoint(product_id: int, product: ProductUpdate, db: Session = Depends(get_db)):
    return update_product(db, product_id, product)

@router.delete("/{product_id}", response_model=ProductResponse)
def delete_product_endpoint(product_id: int, db: Session = Depends(get_db)):
    return delete_product(db, product_id)
