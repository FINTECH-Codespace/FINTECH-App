
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .mongo_models import User
from datetime import datetime
import json
import jwt
from django.conf import settings

@csrf_exempt
@require_http_methods(["POST"])
def login(request):
    try:
        # Parse JSON data from request body
        body = request.body
        data = json.loads(body)
        
        # Extract username and password
        username = data.get('username')
        password = data.get('password')
        
        # Validate input
        if not username or not password:
            return JsonResponse({
                'success': False,
                'message': 'Username and password are required'
            }, status=400)
        
        # Find user in MongoDB
        try:
            user = User.objects.get(username=username)
            # Check password
            if user.check_password(password):
                # Update last login
                user.last_login = datetime.utcnow()
                user.save()

                # JWT payload
                payload = {
                    'username': user.username,
                    'id': str(user.id),
                    'email': user.email,
                    'exp': datetime.utcnow().timestamp() + 60*60*24*7  # 7 days expiry
                }
                token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

                return JsonResponse({
                    'success': True,
                    'message': 'Login successful',
                    'token': token,
                    'user_id': str(user.id),
                    'username': user.username,
                    'email': user.email
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid username or password'
                }, status=401)
        except User.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Invalid username or password'
            }, status=401)
            
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'An error occurred: {str(e)}'
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def signup(request):
    try:
        # Parse JSON data from request body
        body = request.body
        data = json.loads(body)
        
        # Extract required fields
        username = data.get('username')
        password = data.get('password')
        email = data.get('email', '')
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')
        phone_number = data.get('phone_number', '')
        
        # Validate input
        if not username or not password:
            return JsonResponse({
                'success': False,
                'message': 'Username and password are required'
            }, status=400)
        
        if not email:
            return JsonResponse({
                'success': False,
                'message': 'Email is required'
            }, status=400)
        
        # Check if username already exists
        if User.objects(username=username).first():
            return JsonResponse({
                'success': False,
                'message': 'Username already exists'
            }, status=400)
        
        # Check if email already exists
        if User.objects(email=email).first():
            return JsonResponse({
                'success': False,
                'message': 'Email already exists'
            }, status=400)
        
        # Password validation (basic)
        if len(password) < 6:
            return JsonResponse({
                'success': False,
                'message': 'Password must be at least 6 characters long'
            }, status=400)
        
        # Create new user
        user = User(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number
        )
        
        # Set password (this will hash it)
        user.set_password(password)
        
        # Save user to MongoDB
        user.save()
        
        return JsonResponse({
            'success': True,
            'message': 'User created successfully',
            'user_id': str(user.id),
            'username': user.username,
            'email': user.email
        }, status=201)
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'An error occurred: {str(e)}'
        }, status=500)

