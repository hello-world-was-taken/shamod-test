import os
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from model.user import User, RegisterRequest, SignInRequest, UserResponse
from repository.user_repository import UserRepository
from db_util import get_db
from jwt_util import verify_token
from typing import List


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

APP_HOST = os.environ.get("APP_HOST")
DATABASE_CONNECTION = get_db()
user_repository = UserRepository(DATABASE_CONNECTION)

SECRET_KEY = "4dbf99f898226a356318de7ce770fe89e394d3ebdebab9a7625c65c6625fbff2"

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/users", response_model=List[User])
async def get_all_users():
    """
    Retrieve all users from the database.
    """
    return user_repository.get_all_users()

@app.post("/register", response_model=User)
async def register_user(user: RegisterRequest):
    """
    Register a new user.
    """
    return user_repository.register_user(user.name, user.email, user.password)

@app.post("/signin", response_model=dict)
async def sign_in(user: SignInRequest):
    """
    Sign in a user and return an access token.
    """
    user, token = user_repository.sign_in(user.email, user.password)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": token, "name": user[1], "email": user[2], "id": user[0]}

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    """
    Retrieve a user by ID.
    """
    user =  user_repository.get_user_by_id(user_id)
    return {
        "id" : user.id,
        "name" : user.name,
        "email" : user.email,
    }
    
@app.get("/protected")
async def protected_route(authorization: str = Header(...)):
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")
        user_id = verify_token(token)
        return {"user_id": user_id, "message": "This route is protected"}
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header")

@app.post("/logout")
async def logout(authorization: str = Header(...)):
    """
    Logout a user by clearing their session.
    """
    user_id = protected_route(authorization)
    user_repository.logout(user_id)
    return {"message": "Logout successful"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=APP_HOST, port=8000)
