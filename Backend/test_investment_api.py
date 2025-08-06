#!/usr/bin/env python
import os
import sys
import django
import requests
import json

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Fintech.settings')
django.setup()

from user.mongo_models import InvestmentQuestion

def test_questions_in_db():
    """Test if questions are properly stored in database"""
    print("=== Testing Questions in Database ===")
    
    for level in [1, 2, 3]:
        questions = InvestmentQuestion.objects(level=level)
        print(f"Level {level}: {len(questions)} questions")
        
        for q in questions[:2]:  # Show first 2 questions per level
            print(f"  Q{q.question_id}: {q.question_text[:50]}...")
            print(f"    Manual Input: {q.manual_input}")
            print(f"    Options: {len(q.options)}")
    
    print(f"\nTotal questions in database: {InvestmentQuestion.objects.count()}")

def test_api_directly():
    """Test the API views directly without running server"""
    print("\n=== Testing API Views Directly ===")
    
    from user.investment_views import get_questions_by_level
    from django.test import RequestFactory
    
    factory = RequestFactory()
    
    # Test Level 1 questions
    request = factory.get('/user/questions/1/')
    response = get_questions_by_level(request, 1)
    
    print(f"API Response Status: {response.status_code}")
    
    if response.status_code == 200:
        response_data = json.loads(response.content.decode('utf-8'))
        print(f"Success: {response_data['success']}")
        print(f"Level: {response_data['level']}")
        print(f"Questions Count: {len(response_data['questions'])}")
        
        # Show first question
        if response_data['questions']:
            first_q = response_data['questions'][0]
            print(f"First Question: {first_q['question'][:50]}...")
            print(f"Manual Input: {first_q['manualInput']}")
            print(f"Options: {len(first_q['options'])}")

if __name__ == "__main__":
    try:
        test_questions_in_db()
        test_api_directly()
        print("\n✅ All tests passed!")
    except Exception as e:
        print(f"❌ Error during testing: {str(e)}")
        import traceback
        traceback.print_exc()
