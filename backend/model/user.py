from dataclasses import dataclass, field

@dataclass
class User:
    id: int 
    name: str
    email: str
    password: str = None

@dataclass
class RegisterRequest:
    name: str
    email: str
    password: str

@dataclass
class SignInRequest:
    email: str
    password: str
    
@dataclass
class UserResponse:
    id: int
    name: str
    email: str