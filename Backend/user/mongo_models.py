from mongoengine import Document, StringField, EmailField, DateTimeField, DecimalField, BooleanField, DateField, IntField, ListField, DictField, EmbeddedDocument, EmbeddedDocumentField
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

# Embedded document for question options
class QuestionOption(EmbeddedDocument):
    option_id = IntField(required=True)
    label = StringField(required=True, max_length=200)
    score = IntField(default=0)

# Question Model for Investment Assessment
class InvestmentQuestion(Document):
    question_id = IntField(required=True, unique=True)
    level = IntField(required=True)  # 1, 2, or 3
    category = StringField(required=True, max_length=100)
    question_text = StringField(required=True, max_length=500)
    manual_input = BooleanField(default=False)
    input_key = StringField(max_length=50)  # For manual input questions
    options = ListField(EmbeddedDocumentField(QuestionOption))
    is_active = BooleanField(default=True)
    created_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'investment_questions',
        'indexes': ['question_id', 'level', 'category']
    }
    
    def __str__(self):
        return f"Q{self.question_id}: {self.question_text[:50]}..."

# User Answer Model
class UserAnswer(Document):
    username = StringField(required=True)  # Reference to user
    question_id = IntField(required=True)
    level = IntField(required=True)
    
    # For multiple choice questions
    selected_option_id = IntField()
    selected_option_label = StringField(max_length=200)
    option_score = IntField(default=0)
    
    # For manual input questions
    manual_input_value = StringField(max_length=1000)
    input_key = StringField(max_length=50)
    
    # Metadata
    answered_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'user_answers',
        'indexes': ['username', 'question_id', 'level']
    }
    
    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.username} - Q{self.question_id}"

# Investment Assessment Summary
class InvestmentAssessment(Document):
    username = StringField(required=True)
    level_1_score = IntField(default=0)
    level_2_score = IntField(default=0)
    level_3_completed = BooleanField(default=False)
    
    # Risk profile based on scores
    risk_profile = StringField(choices=['Risk Averser', 'Conservative', 'Moderate', 'Growth-Oriented', 'Risk Taker'])
    
    # Assessment status
    level_1_completed = BooleanField(default=False)
    level_2_completed = BooleanField(default=False)
    level_3_completed = BooleanField(default=False)
    
    # Financial data from manual inputs
    annual_income = DecimalField()
    monthly_savings = DecimalField()
    current_age = IntField()
    target_goal_age = IntField()
    goal_cost_today = DecimalField()
    
    # Timestamps
    started_at = DateTimeField(default=datetime.utcnow)
    completed_at = DateTimeField()
    updated_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'investment_assessments',
        'indexes': ['username']
    }
    
    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)
    
    def calculate_risk_profile(self):
        """Calculate risk profile based on level 1 and 2 scores"""
        total_score = self.level_1_score + self.level_2_score
        
        if total_score <= 12:
            self.risk_profile = 'Risk Averser'
        elif total_score <= 20:
            self.risk_profile = 'Conservative'
        elif total_score <= 28:
            self.risk_profile = 'Moderate'
        elif total_score <= 36:
            self.risk_profile = 'Growth-Oriented'
        else:
            self.risk_profile = 'Risk Taker'
    
    def __str__(self):
        return f"{self.username} - {self.risk_profile}"
