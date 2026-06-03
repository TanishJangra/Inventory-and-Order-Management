from pydantic import BaseModel, confloat, conint

class ProductBase(BaseModel):
    name: str
    sku: str
    price: confloat(ge=0)
    quantity: conint(ge=0)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: str | None = None
    sku: str | None = None
    price: confloat(ge=0) | None = None
    quantity: conint(ge=0) | None = None

class ProductResponse(ProductBase):
    id: int

    class Config:
        from_attributes = True
