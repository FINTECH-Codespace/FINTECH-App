#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Fintech.settings')
django.setup()

from user.mongo_models import InvestmentQuestion, QuestionOption

def populate_questions():
    """
    Populate the database with questions from the frontend data.ts file
    """
    
    # Level 1 Questions
    level1_questions = [
        {
            "question_id": 1,
            "level": 1,
            "category": "Age",
            "question_text": "What is your age?",
            "manual_input": False,
            "options": [
                {"option_id": 101, "label": "Under 30", "score": 5},
                {"option_id": 102, "label": "30–50", "score": 3},
                {"option_id": 103, "label": "Over 50", "score": 1},
            ]
        },
        {
            "question_id": 2,
            "level": 1,
            "category": "Income",
            "question_text": "What is your annual income?",
            "manual_input": True,
            "input_key": "income",
            "options": []
        },
        {
            "question_id": 3,
            "level": 1,
            "category": "Investment Horizon",
            "question_text": "How many years do you plan to invest?",
            "manual_input": False,
            "options": [
                {"option_id": 301, "label": "10+ years", "score": 5},
                {"option_id": 302, "label": "5–10 years", "score": 3},
                {"option_id": 303, "label": "≤ 5 years", "score": 1},
            ]
        },
        {
            "question_id": 4,
            "level": 1,
            "category": "Financial Goals",
            "question_text": "What is the main goal of this investment?",
            "manual_input": False,
            "options": [
                {"option_id": 401, "label": "Long-term growth", "score": 5},
                {"option_id": 402, "label": "Balanced growth + safety", "score": 3},
                {"option_id": 403, "label": "Capital preservation", "score": 1},
            ]
        },
        {
            "question_id": 5,
            "level": 1,
            "category": "Risk Preference",
            "question_text": "How would you feel if your investment dropped 20% in a year?",
            "manual_input": False,
            "options": [
                {"option_id": 501, "label": "No worries", "score": 5},
                {"option_id": 502, "label": "Concerned, but I'll wait", "score": 3},
                {"option_id": 503, "label": "I'll sell", "score": 1},
            ]
        },
        {
            "question_id": 6,
            "level": 1,
            "category": "Experience",
            "question_text": "How familiar are you with investments?",
            "manual_input": False,
            "options": [
                {"option_id": 601, "label": "Very experienced", "score": 5},
                {"option_id": 602, "label": "Some experience", "score": 3},
                {"option_id": 603, "label": "No experience", "score": 1},
            ]
        },
        {
            "question_id": 7,
            "level": 1,
            "category": "Savings",
            "question_text": "What's your average monthly savings after expenses?",
            "manual_input": True,
            "input_key": "saving",
            "options": []
        }
    ]
    
    # Level 2 Questions
    level2_questions = [
        {
            "question_id": 8,
            "level": 2,
            "category": "Current Assets",
            "question_text": "What percentage of your income is held as current assets?",
            "manual_input": False,
            "options": [
                {"option_id": 801, "label": "≥ 30% (Strong liquidity position)", "score": 5},
                {"option_id": 802, "label": "15–29% (Moderate liquidity)", "score": 3},
                {"option_id": 803, "label": "< 15% (Poor liquidity)", "score": 1},
            ]
        },
        {
            "question_id": 9,
            "level": 2,
            "category": "Insurance Coverage",
            "question_text": "How well are you covered with insurance?",
            "manual_input": False,
            "options": [
                {"option_id": 901, "label": "Fully protected (life, health, disability)", "score": 5},
                {"option_id": 902, "label": "Partially covered (some gaps in coverage)", "score": 3},
                {"option_id": 903, "label": "No or minimal insurance", "score": 1},
            ]
        },
        {
            "question_id": 10,
            "level": 2,
            "category": "Emergency Fund",
            "question_text": "How many months of expenses can your emergency fund cover?",
            "manual_input": False,
            "options": [
                {"option_id": 1001, "label": "≥ 6 months (Excellent safety)", "score": 5},
                {"option_id": 1002, "label": "3–5 months (Decent, needs topping up)", "score": 3},
                {"option_id": 1003, "label": "< 3 months (Inadequate buffer)", "score": 1},
            ]
        },
        {
            "question_id": 11,
            "level": 2,
            "category": "Debt Status",
            "question_text": "What is your debt status as a percentage of income?",
            "manual_input": False,
            "options": [
                {"option_id": 1101, "label": "< 20% (Excellent debt control)", "score": 5},
                {"option_id": 1102, "label": "20–40% (Manageable, needs planning)", "score": 3},
                {"option_id": 1103, "label": "> 40% (High debt burden)", "score": 1},
            ]
        },
        {
            "question_id": 12,
            "level": 2,
            "category": "Non-Earning Dependents",
            "question_text": "How many non-earning dependents do you have?",
            "manual_input": False,
            "options": [
                {"option_id": 1201, "label": "No dependents (Freedom from liabilities)", "score": 5},
                {"option_id": 1202, "label": "1–2 dependents (Moderate responsibility)", "score": 3},
                {"option_id": 1203, "label": "3 or more dependents (Heavy responsibility)", "score": 1},
            ]
        },
        {
            "question_id": 13,
            "level": 2,
            "category": "Tax Optimization",
            "question_text": "How well do you utilize tax-saving opportunities?",
            "manual_input": False,
            "options": [
                {"option_id": 1301, "label": "Fully utilizing tax options (Section 80C, 80D, etc.)", "score": 5},
                {"option_id": 1302, "label": "Partially optimized", "score": 3},
                {"option_id": 1303, "label": "No optimization", "score": 1},
            ]
        },
        {
            "question_id": 14,
            "level": 2,
            "category": "Profile Health Summary",
            "question_text": "Write a short summary of your financial health profile.",
            "manual_input": True,
            "input_key": "profileHealthSummary",
            "options": []
        }
    ]
    
    # Level 3 Questions
    level3_questions = [
        {
            "question_id": 15,
            "level": 3,
            "category": "Current Age",
            "question_text": "What is your current age?",
            "manual_input": True,
            "input_key": "currentAge",
            "options": []
        },
        {
            "question_id": 16,
            "level": 3,
            "category": "Target Goal Age",
            "question_text": "At what age do you want to achieve this goal?",
            "manual_input": True,
            "input_key": "targetGoalAge",
            "options": []
        },
        {
            "question_id": 17,
            "level": 3,
            "category": "Goal Type",
            "question_text": "What is the financial goal you're planning for?",
            "manual_input": False,
            "options": [
                {"option_id": 1701, "label": "Retirement", "score": 0},
                {"option_id": 1702, "label": "Home", "score": 0},
                {"option_id": 1703, "label": "Car", "score": 0},
                {"option_id": 1704, "label": "Education", "score": 0},
                {"option_id": 1705, "label": "Business", "score": 0},
                {"option_id": 1706, "label": "Travel", "score": 0},
                {"option_id": 1707, "label": "Other", "score": 0},
            ]
        },
        {
            "question_id": 18,
            "level": 3,
            "category": "Goal Cost (Today)",
            "question_text": "What will this goal cost in today's value (₹)?",
            "manual_input": True,
            "input_key": "goalCostToday",
            "options": []
        },
        {
            "question_id": 19,
            "level": 3,
            "category": "Annual Investment",
            "question_text": "How much are you investing per year for this goal?",
            "manual_input": False,
            "options": [
                {"option_id": 1901, "label": "Not investing", "score": 0},
                {"option_id": 1902, "label": "< ₹50,000", "score": 0},
                {"option_id": 1903, "label": "₹50K – ₹1L", "score": 0},
                {"option_id": 1904, "label": "₹1L – ₹2L", "score": 0},
                {"option_id": 1905, "label": "₹2L+", "score": 0},
            ]
        },
        {
            "question_id": 20,
            "level": 3,
            "category": "Expected Return Rate",
            "question_text": "What annual return do you expect on this investment?",
            "manual_input": False,
            "options": [
                {"option_id": 2001, "label": "Not sure", "score": 0},
                {"option_id": 2002, "label": "< 6%", "score": 0},
                {"option_id": 2003, "label": "6 – 8%", "score": 0},
                {"option_id": 2004, "label": "8 – 10%", "score": 0},
                {"option_id": 2005, "label": "> 10%", "score": 0},
            ]
        },
        {
            "question_id": 21,
            "level": 3,
            "category": "Expected Inflation",
            "question_text": "Expected inflation rate for this goal (cost increase per year)?",
            "manual_input": False,
            "options": [
                {"option_id": 2101, "label": "Not sure", "score": 0},
                {"option_id": 2102, "label": "4 – 5%", "score": 0},
                {"option_id": 2103, "label": "6 – 7%", "score": 0},
                {"option_id": 2104, "label": "8 – 10%", "score": 0},
            ]
        },
        {
            "question_id": 22,
            "level": 3,
            "category": "Goal Protection",
            "question_text": "If you're unable to earn, is this goal financially protected (via insurance/savings)?",
            "manual_input": False,
            "options": [
                {"option_id": 2201, "label": "Fully protected", "score": 0},
                {"option_id": 2202, "label": "Partially protected", "score": 0},
                {"option_id": 2203, "label": "Not protected", "score": 0},
                {"option_id": 2204, "label": "Not sure", "score": 0},
            ]
        }
    ]
    
    # Combine all questions
    all_questions = level1_questions + level2_questions + level3_questions
    
    # Clear existing questions
    InvestmentQuestion.objects.delete()
    print("Cleared existing questions...")
    
    # Insert new questions
    for q_data in all_questions:
        question = InvestmentQuestion()
        question.question_id = q_data["question_id"]
        question.level = q_data["level"]
        question.category = q_data["category"]
        question.question_text = q_data["question_text"]
        question.manual_input = q_data["manual_input"]
        question.input_key = q_data.get("input_key")
        
        # Create option objects
        options = []
        for option_data in q_data["options"]:
            option = QuestionOption()
            option.option_id = option_data["option_id"]
            option.label = option_data["label"]
            option.score = option_data["score"]
            options.append(option)
        
        question.options = options
        question.save()
        
        print(f"Created question {question.question_id}: {question.question_text[:50]}...")
    
    print(f"\n✅ Successfully populated {len(all_questions)} questions!")
    print("Questions breakdown:")
    print(f"- Level 1: {len(level1_questions)} questions")
    print(f"- Level 2: {len(level2_questions)} questions")
    print(f"- Level 3: {len(level3_questions)} questions")

if __name__ == "__main__":
    try:
        populate_questions()
    except Exception as e:
        print(f"❌ Error populating questions: {str(e)}")
