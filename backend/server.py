from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import firebase_admin
from firebase_admin import credentials, firestore, storage
import jwt
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

cred = credentials.Certificate(str(ROOT_DIR / 'firebase-admin.json'))
firebase_admin.initialize_app(cred, {
    'storageBucket': os.environ.get('FIREBASE_STORAGE_BUCKET')
})

db = firestore.client()
bucket = storage.bucket()

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

JWT_SECRET = os.environ.get('JWT_SECRET', 'secret-key')

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminCreate(BaseModel):
    username: str
    password: str

class Product(BaseModel):
    id: Optional[str] = None
    name: str
    description: str
    price: float
    category: str
    age_group: str
    image_url: Optional[str] = None
    created_at: Optional[str] = None

class Event(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    start_date: str
    end_date: str
    location: str
    age_group: str
    price: float
    image_url: Optional[str] = None
    created_at: Optional[str] = None

class Review(BaseModel):
    id: Optional[str] = None
    parent_name: str
    rating: int
    comment: str
    created_at: Optional[str] = None

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=['HS256'])
        return payload
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

@api_router.post("/admin/login")
async def admin_login(login: AdminLogin):
    try:
        admin_ref = db.collection('admins').where('username', '==', login.username).limit(1).get()
        
        if not admin_ref:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        admin = admin_ref[0].to_dict()
        
        if bcrypt.checkpw(login.password.encode('utf-8'), admin['password'].encode('utf-8')):
            token = jwt.encode(
                {'username': login.username, 'exp': datetime.now(timezone.utc) + timedelta(days=7)},
                JWT_SECRET,
                algorithm='HS256'
            )
            return {"token": token, "username": login.username}
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/admin/create")
async def create_admin(admin: AdminCreate):
    try:
        hashed = bcrypt.hashpw(admin.password.encode('utf-8'), bcrypt.gensalt())
        admin_data = {
            'username': admin.username,
            'password': hashed.decode('utf-8'),
            'created_at': datetime.now(timezone.utc).isoformat()
        }
        db.collection('admins').add(admin_data)
        return {"message": "Admin created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/upload")
async def upload_image(file: UploadFile = File(...), _: dict = Depends(verify_token)):
    try:
        file_extension = file.filename.split('.')[-1]
        file_name = f"{uuid.uuid4()}.{file_extension}"
        blob = bucket.blob(f"images/{file_name}")
        
        contents = await file.read()
        blob.upload_from_string(contents, content_type=file.content_type)
        blob.make_public()
        
        return {"url": blob.public_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/products")
async def get_products(category: Optional[str] = None, age_group: Optional[str] = None):
    try:
        query = db.collection('products')
        
        if category:
            query = query.where('category', '==', category)
        if age_group:
            query = query.where('age_group', '==', age_group)
        
        products = query.get()
        result = []
        for doc in products:
            product_data = doc.to_dict()
            product_data['id'] = doc.id
            result.append(product_data)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/products")
async def create_product(product: Product, _: dict = Depends(verify_token)):
    try:
        product_data = product.model_dump(exclude={'id'})
        product_data['created_at'] = datetime.now(timezone.utc).isoformat()
        doc_ref = db.collection('products').add(product_data)
        return {"id": doc_ref[1].id, "message": "Product created"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/products/{product_id}")
async def update_product(product_id: str, product: Product, _: dict = Depends(verify_token)):
    try:
        product_data = product.model_dump(exclude={'id', 'created_at'})
        db.collection('products').document(product_id).update(product_data)
        return {"message": "Product updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, _: dict = Depends(verify_token)):
    try:
        db.collection('products').document(product_id).delete()
        return {"message": "Product deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/events")
async def get_events(age_group: Optional[str] = None):
    try:
        query = db.collection('events')
        
        if age_group:
            query = query.where('age_group', '==', age_group)
        
        events = query.get()
        result = []
        for doc in events:
            event_data = doc.to_dict()
            event_data['id'] = doc.id
            result.append(event_data)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/events")
async def create_event(event: Event, _: dict = Depends(verify_token)):
    try:
        event_data = event.model_dump(exclude={'id'})
        event_data['created_at'] = datetime.now(timezone.utc).isoformat()
        doc_ref = db.collection('events').add(event_data)
        return {"id": doc_ref[1].id, "message": "Event created"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/events/{event_id}")
async def update_event(event_id: str, event: Event, _: dict = Depends(verify_token)):
    try:
        event_data = event.model_dump(exclude={'id', 'created_at'})
        db.collection('events').document(event_id).update(event_data)
        return {"message": "Event updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/events/{event_id}")
async def delete_event(event_id: str, _: dict = Depends(verify_token)):
    try:
        db.collection('events').document(event_id).delete()
        return {"message": "Event deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/reviews")
async def get_reviews():
    try:
        reviews = db.collection('reviews').order_by('created_at', direction=firestore.Query.DESCENDING).get()
        result = []
        for doc in reviews:
            review_data = doc.to_dict()
            review_data['id'] = doc.id
            result.append(review_data)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/reviews")
async def create_review(review: Review):
    try:
        review_data = review.model_dump(exclude={'id'})
        review_data['created_at'] = datetime.now(timezone.utc).isoformat()
        doc_ref = db.collection('reviews').add(review_data)
        return {"id": doc_ref[1].id, "message": "Review submitted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/reviews/{review_id}")
async def delete_review(review_id: str, _: dict = Depends(verify_token)):
    try:
        db.collection('reviews').document(review_id).delete()
        return {"message": "Review deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(','),
    allow_origin_regex=r"https://.*\.onrender\.app",
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
