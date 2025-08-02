from mongoengine import Document, StringField, EmailField, DateTimeField, DecimalField, BooleanField, DateField
from datetime import datetime
import hashlib

# MongoDB User Model using MongoEngine
class User(Document):
    username = StringField(required=True, unique=True, max_length=150)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)  # Will store hashed password
    first_name = StringField(max_length=30)
    last_name = StringField(max_length=30)
    phone_number = StringField(max_length=15)
    date_of_birth = DateField()
    profile_picture = StringField()  # URL to profile picture
    
    # Fintech-specific fields
    account_balance = DecimalField(default=0.00, min_value=0)
    is_verified = BooleanField(default=False)
    is_active = BooleanField(default=True)
    
    # Timestamps
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    last_login = DateTimeField()
    
    meta = {
        'collection': 'users',
        'indexes': ['username', 'email']
    }
    
    def set_password(self, password):
       
        self.password = hashlib.sha256(password.encode()).hexdigest()
    
    def check_password(self, password):
        return self.password == hashlib.sha256(password.encode()).hexdigest()
    
    def save(self, *args, **kwargs):
        
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)
    
    def __str__(self):
        return self.username

# User Profile for additional information
class UserProfile(Document):
    username = StringField(required=True, unique=True) 
    bio = StringField()
    address = StringField()
    city = StringField(max_length=100)
    country = StringField(max_length=100)
    postal_code = StringField(max_length=20)
    
    # Financial preferences
    investment_risk_level = StringField(choices=['low', 'medium', 'high'], default='medium')
    
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'user_profiles',
        'indexes': ['username']
    }
    
    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.username}'s Profile"
