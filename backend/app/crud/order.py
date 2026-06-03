from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from ..models import Order, OrderItem
from ..crud.customer import get_customer
from ..crud.product import get_product
from ..schemas import OrderCreate


def get_order(db: Session, order_id: int):
    return db.query(Order).filter(Order.id == order_id).first()


def get_orders(db: Session):
    return db.query(Order).order_by(Order.created_at.desc()).all()


def create_order(db: Session, order_data: OrderCreate):
    customer = get_customer(db, order_data.customer_id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    if not order_data.items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order must contain at least one item")

    total_amount = 0.0
    items = []
    for item in order_data.items:
        product = get_product(db, item.product_id)
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Product {item.product_id} not found")
        if product.quantity < item.quantity:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Insufficient inventory for product {product.sku}")
        product.quantity -= item.quantity
        line_total = product.price * item.quantity
        total_amount += line_total
        items.append((product, item.quantity, product.price))

    order = Order(customer_id=order_data.customer_id, total_amount=total_amount)
    db.add(order)
    db.flush()
    for product, qty, price in items:
        order_item = OrderItem(order_id=order.id, product_id=product.id, quantity=qty, unit_price=price)
        db.add(order_item)
    db.commit()
    db.refresh(order)
    return order


def delete_order(db: Session, order_id: int):
    order = get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    for item in order.items:
        product = get_product(db, item.product_id)
        if product:
            product.quantity += item.quantity
    db.delete(order)
    db.commit()
    return order
