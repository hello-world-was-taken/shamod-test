import jwt
from fastapi import HTTPException
from jwt import PyJWTError
from typing import Optional
from datetime import datetime, timedelta

SECRET_KEY = "4dbf99f898226a356318de7ce770fe89e394d3ebdebab9a7625c65c6625fbff2"
ALGORITHM = "HS256"

def verify_token(token: str) -> Optional[int]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except PyJWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
