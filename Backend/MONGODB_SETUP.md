# MongoDB Setup Guide for FINTECH App

## Overview
Your Django FINTECH app is now configured to use MongoDB for user authentication and data storage using MongoEngine.

## Setup Requirements

### 1. Install MongoDB
- **Local Installation**: Download and install MongoDB Community Server from https://www.mongodb.com/try/download/community
- **Cloud Option**: Use MongoDB Atlas (cloud database) at https://www.mongodb.com/atlas

### 2. Python Dependencies
The following packages are installed:
- `mongoengine`: MongoDB ORM for Python
- `pymongo`: MongoDB driver
- `dnspython`: Required for MongoDB Atlas connections

### 3. Configuration

#### Local MongoDB (Default)
```python
# In settings.py
mongoengine.connect(
    db='fintech_db',
    host='mongodb://localhost:27017'
)
```

#### MongoDB Atlas (Cloud)
```python
# In settings.py
mongoengine.connect(
    db='fintech_db',
    host='mongodb+srv://username:password@cluster.mongodb.net/fintech_db?retryWrites=true&w=majority'
)
```

## API Endpoints

### 1. User Registration
**Endpoint**: `POST /user/signup/`

**Request Body**:
```json
{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+1234567890"
}
```

**Success Response**:
```json
{
    "success": true,
    "message": "User created successfully",
    "user_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
}
```

### 2. User Login
**Endpoint**: `POST /user/login/`

**Request Body**:
```json
{
    "username": "john_doe",
    "password": "securepassword123"
}
```

**Success Response**:
```json
{
    "success": true,
    "message": "Login successful",
    "user_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
}
```

## MongoDB User Model Features

### User Fields
- `username`: Unique username
- `email`: Unique email address
- `password`: Hashed password (SHA-256)
- `first_name`, `last_name`: User's name
- `phone_number`: Contact number
- `date_of_birth`: Birth date
- `profile_picture`: URL to profile image
- `account_balance`: Financial balance (Decimal)
- `is_verified`: Account verification status
- `is_active`: Account active status
- `created_at`, `updated_at`: Timestamps
- `last_login`: Last login timestamp

### Security Features
- Passwords are automatically hashed using SHA-256
- Unique constraints on username and email
- Input validation for all fields

## Database Collections
- `users`: Main user collection
- `user_profiles`: Extended user profile information

## Testing the Setup

1. **Start MongoDB** (if using local installation)
2. **Run the Django server**:
   ```bash
   cd Backend
   python manage.py runserver
   ```
3. **Test the API endpoints** using tools like Postman or curl

## Environment Variables (Recommended)
Create a `.env` file for sensitive information:
```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=fintech_db
# For Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fintech_db
```

## Troubleshooting

### Common Issues
1. **MongoDB not running**: Start MongoDB service
2. **Connection refused**: Check MongoDB port (default: 27017)
3. **Import errors**: Ensure all packages are installed: `pip install -r requirements.txt`

### Checking MongoDB Connection
Run the test script:
```bash
python test_mongo.py
```

## Next Steps
1. Implement JWT authentication for API sessions
2. Add more user profile fields as needed
3. Create additional models for financial data
4. Set up proper logging and monitoring
5. Implement data validation and sanitization
