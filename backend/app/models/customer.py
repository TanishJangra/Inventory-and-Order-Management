from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..database import Base

class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(128), nullable=False)
    email = Column(String(128), nullable=False, unique=True, index=True)
    phone = Column(String(32), nullable=False)
    orders = relationship("Order", back_populates="customer")
