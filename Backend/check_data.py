#!/usr/bin/env python
"""
Script to check if user data is being saved in MongoDB
"""
import os
import django
import sys

# Add the project directory to the Python path
sys.path.append('.')

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Fintech.settings')

# Setup Django
django.setup()

# Now import your models
try:
    from user.mongo_models import User, UserAnswer, InvestmentAssessment, InvestmentQuestion
    
    print("🔍 Checking MongoDB Data...")
    print("=" * 50)
    
    # Check questions
    question_count = InvestmentQuestion.objects.count()
    print(f"📝 Total Questions: {question_count}")
    
    # Check user answers
    answer_count = UserAnswer.objects.count()
    print(f"💬 Total User Answers: {answer_count}")
    
    if answer_count > 0:
        print("\n📋 Recent User Answers:")
        for answer in UserAnswer.objects.order_by('-answered_at')[:5]:
            print(f"  - {answer.username}: Q{answer.question_id} (Level {answer.level})")
            if answer.selected_option_label:
                print(f"    Answer: {answer.selected_option_label} (Score: {answer.option_score})")
            if answer.manual_input_value:
                print(f"    Input: {answer.manual_input_value}")
    
    # Check assessments
    assessment_count = InvestmentAssessment.objects.count()
    print(f"\n📊 Total User Assessments: {assessment_count}")
    
    if assessment_count > 0:
        print("\n🎯 Assessment Summaries:")
        for assessment in InvestmentAssessment.objects.order_by('-updated_at')[:3]:
            print(f"  - {assessment.username}:")
            print(f"    Level 1: {'✅' if assessment.level_1_completed else '❌'} (Score: {assessment.level_1_score})")
            print(f"    Level 2: {'✅' if assessment.level_2_completed else '❌'} (Score: {assessment.level_2_score})")
            print(f"    Level 3: {'✅' if assessment.level_3_completed else '❌'}")
            print(f"    Risk Profile: {assessment.risk_profile}")
    
    print("\n" + "=" * 50)
    print("✅ Data check completed!")
    
except Exception as e:
    print(f"❌ Error checking data: {e}")
    print("This might be because:")
    print("1. MongoDB is not running")
    print("2. No data has been saved yet")
    print("3. Django settings issue")
