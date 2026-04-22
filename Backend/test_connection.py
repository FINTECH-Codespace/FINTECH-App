#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Fintech.settings')
django.setup()

# Test MongoDB connection
try:
    from user.mongo_models import User
    import mongoengine
    
    print("✅ MongoDB models imported successfully!")
    
    # Test connection by attempting to connect
    print("✅ Connecting to MongoDB at mongodb://localhost:27017/")
    
    # Try to create a test user to verify connection
    test_user = User(
        username="test_connection_user",
        email="test@connection.com"
    )
    test_user.set_password("testpass123")
    
    # Check if user exists, if not create
    existing_user = User.objects(username="test_connection_user").first()
    if not existing_user:
        test_user.save()
        print("✅ Test user created successfully!")
    else:
        print("✅ Test user already exists!")
    
    print("✅ MongoDB connection is working!")
    print(f"Database: fintech_db")
    print(f"Connection: mongodb://localhost:27017/")
    
    # List all users
    all_users = User.objects()
    print(f"Total users in database: {len(all_users)}")
    
    for user in all_users:
        print(f"User: {user.username} - {user.email}")
    
except Exception as e:
    print(f"❌ MongoDB connection failed: {str(e)}")
    print("Make sure MongoDB is running on localhost:27017")
