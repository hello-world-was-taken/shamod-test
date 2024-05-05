from model.user import User # pylint: disable=import-error
import jwt
from datetime import datetime, timedelta, timezone

# Secret key for JWT encoding and decoding
SECRET_KEY = "4dbf99f898226a356318de7ce770fe89e394d3ebdebab9a7625c65c6625fbff2"


class UserRepository:
    """
    Repository for managing CRUD operations on User records in the database.
    """
    def __init__(self, db_connection):
        """
        Initialize the repository with a database connection.
        """
        self.db_connection = db_connection
        self.cursor = self.db_connection.cursor()
        self.cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255) UNIQUE,
                password VARCHAR(255),
                session_token VARCHAR(255)
            );
        """
        )
        self.db_connection.commit()

    def register_user(self, name, email, password):
        """
        Register a new user in the database.
        """
        self.cursor.execute(
            "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",
            (name, email, password)
        )
        self.db_connection.commit()
        user_id = self.cursor.lastrowid
        return User(id=user_id, name=name, email=email, password=password)

    def sign_in(self, email, password):
        """
        Authenticate a user based on email and password.
        """
        self.cursor.execute(
            "SELECT id, name, email, password FROM users WHERE email=%s AND password=%s",
            (email, password)
        )
        user = self.cursor.fetchone()
        if not user:
            return None

        # Generate a JWT token
        jwt_payload = {
            'user_id': user[0],
            'exp': datetime.now(timezone.utc) + timedelta(hours=1)  # Token expiry time
        }

        token = jwt.encode(jwt_payload, SECRET_KEY, algorithm='HS256')

        return user, token

    def logout(self, user_id):
        """
        Logout a user by clearing their session token.
        """
        # Clear the user's session token in the database
        self.cursor.execute(
            "UPDATE users SET session_token=NULL WHERE id=%s",
            (user_id,)
        )
        self.db_connection.commit()
        return True

    def get_all_users(self):
        """
        Retrieve all users from the database.
        """
        self.cursor.execute("SELECT id, name, email, password FROM users")
        users = [
            User(id=row[0], name=row[1], email=row[2], password=row[3])
            for row in self.cursor.fetchall()
        ]
        return users

    def get_user_by_id(self, user_id):
        """
        Retrieve a user by their ID.
        """
        self.cursor.execute(
            "SELECT id, name, email, password FROM users WHERE id=%s",
            (user_id,)
        )
        user = self.cursor.fetchone()
        if not user:
            return None
        return User(id=user[0], name=user[1], email=user[2])
