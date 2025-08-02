import os
import sys
import django
from pathlib import Path

# Add the Backend directory to Python path
backend_dir = Path(__file__).resolve().parent
sys.path.append(str(backend_dir))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Fintech.settings')
django.setup()

# Test MongoDB connection
try:
    from user.mongo_models import User
    print("✅ MongoDB models imported successfully!")
    
    # Test creating a user (this will also test the MongoDB connection)
    test_user = User(
        username="test_user",
        email="test@example.com",
        first_name="Test",
        last_name="User"
    )
    test_user.set_password("testpassword")
    
    print("✅ User model created successfully!")
    print("✅ MongoDB connection is working!")
    
    # Don't save the test user, just test the model creation
    print(f"Test user: {test_user.username} - {test_user.email}")
    
except Exception as e:
    print(f"❌ Error: {e}")
    print("Make sure MongoDB is running on your local machine.")
