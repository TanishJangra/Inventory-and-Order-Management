from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from ..models import Product
from ..schemas import ProductCreate, ProductUpdate


def create_product(db: Session, product: ProductCreate):
    existing = db.query(Product).filter(Product.sku == product.sku).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="SKU already exists")
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def get_products(db: Session):
    return db.query(Product).all()


def get_product(db: Session, product_id: int):
    return db.query(Product).filter(Product.id == product_id).first()


def update_product(db: Session, product_id: int, updates: ProductUpdate):
    db_product = get_product(db, product_id)
    if not db_product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    if updates.sku and updates.sku != db_product.sku:
        existing = db.query(Product).filter(Product.sku == updates.sku).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="SKU already exists")
    for key, value in updates.dict(exclude_unset=True).items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product


def delete_product(db: Session, product_id: int):
    db_product = get_product(db, product_id)
    if not db_product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    if db_product.order_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete a product that is used in existing orders",
        )
    db.delete(db_product)
    db.commit()
    return db_product
