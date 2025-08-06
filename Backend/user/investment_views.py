from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .mongo_models import InvestmentQuestion, UserAnswer, InvestmentAssessment, QuestionOption, User
from datetime import datetime
import json

@csrf_exempt
@require_http_methods(["GET"])
def get_questions_by_level(request, level):
    """
    Get all questions for a specific level (1, 2, or 3)
    """
    try:
        level = int(level)
        if level not in [1, 2, 3]:
            return JsonResponse({
                'success': False,
                'message': 'Level must be 1, 2, or 3'
            }, status=400)
        
        questions = InvestmentQuestion.objects(level=level, is_active=True).order_by('question_id')
        
        questions_data = []
        for question in questions:
            options_data = []
            for option in question.options:
                options_data.append({
                    'id': option.option_id,
                    'label': option.label,
                    'score': option.score
                })
            
            question_data = {
                'id': question.question_id,
                'category': question.category,
                'question': question.question_text,
                'manualInput': question.manual_input,
                'key': question.input_key,
                'options': options_data
            }
            questions_data.append(question_data)
        
        return JsonResponse({
            'success': True,
            'level': level,
            'questions': questions_data
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'An error occurred: {str(e)}'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def submit_answer(request):
    """
    Submit answer for a specific question
    """
    try:
        body = request.body
        data = json.loads(body)
        
        username = data.get('username')
        question_id = data.get('question_id')
        level = data.get('level')
        
        if not username or not question_id or not level:
            return JsonResponse({
                'success': False,
                'message': 'Username, question_id, and level are required'
            }, status=400)
        
        # Check if user exists
        if not User.objects(username=username).first():
            return JsonResponse({
                'success': False,
                'message': 'User not found'
            }, status=404)
        
        # Check if question exists
        question = InvestmentQuestion.objects(question_id=question_id, level=level).first()
        if not question:
            return JsonResponse({
                'success': False,
                'message': 'Question not found'
            }, status=404)
        
        # Check if answer already exists and update or create
        existing_answer = UserAnswer.objects(username=username, question_id=question_id).first()
        
        if existing_answer:
            user_answer = existing_answer
        else:
            user_answer = UserAnswer(username=username, question_id=question_id, level=level)
        
        # Handle different types of answers
        if question.manual_input:
            # Manual input answer
            manual_value = data.get('manual_input_value')
            if not manual_value:
                return JsonResponse({
                    'success': False,
                    'message': 'Manual input value is required'
                }, status=400)
            
            user_answer.manual_input_value = str(manual_value)
            user_answer.input_key = question.input_key
        else:
            # Multiple choice answer
            selected_option_id = data.get('selected_option_id')
            if not selected_option_id:
                return JsonResponse({
                    'success': False,
                    'message': 'Selected option ID is required'
                }, status=400)
            
            # Find the selected option
            selected_option = None
            for option in question.options:
                if option.option_id == selected_option_id:
                    selected_option = option
                    break
            
            if not selected_option:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid option selected'
                }, status=400)
            
            user_answer.selected_option_id = selected_option_id
            user_answer.selected_option_label = selected_option.label
            user_answer.option_score = selected_option.score
        
        user_answer.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Answer submitted successfully',
            'answer_id': str(user_answer.id)
        })
        
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
def complete_level(request):
    """
    Mark a level as completed and calculate scores
    """
    try:
        body = request.body
        data = json.loads(body)
        
        username = data.get('username')
        level = data.get('level')
        
        if not username or not level:
            return JsonResponse({
                'success': False,
                'message': 'Username and level are required'
            }, status=400)
        
        # Get or create assessment record
        assessment = InvestmentAssessment.objects(username=username).first()
        if not assessment:
            assessment = InvestmentAssessment(username=username)
        
        # Calculate score for the level
        user_answers = UserAnswer.objects(username=username, level=level)
        total_score = sum([answer.option_score for answer in user_answers if answer.option_score])
        
        # Update assessment based on level
        if level == 1:
            assessment.level_1_score = total_score
            assessment.level_1_completed = True
            
            # Extract financial data from manual inputs
            for answer in user_answers:
                if answer.input_key == 'income':
                    assessment.annual_income = float(answer.manual_input_value) if answer.manual_input_value else 0
                elif answer.input_key == 'saving':
                    assessment.monthly_savings = float(answer.manual_input_value) if answer.manual_input_value else 0
                    
        elif level == 2:
            assessment.level_2_score = total_score
            assessment.level_2_completed = True
            
            # Calculate risk profile after level 2
            assessment.calculate_risk_profile()
            
        elif level == 3:
            assessment.level_3_completed = True
            
            # Extract goal-related data
            for answer in user_answers:
                if answer.input_key == 'currentAge':
                    assessment.current_age = int(answer.manual_input_value) if answer.manual_input_value else 0
                elif answer.input_key == 'targetGoalAge':
                    assessment.target_goal_age = int(answer.manual_input_value) if answer.manual_input_value else 0
                elif answer.input_key == 'goalCostToday':
                    assessment.goal_cost_today = float(answer.manual_input_value) if answer.manual_input_value else 0
        
        # Check if all levels are completed
        if assessment.level_1_completed and assessment.level_2_completed and assessment.level_3_completed:
            assessment.completed_at = datetime.utcnow()
        
        assessment.save()
        
        return JsonResponse({
            'success': True,
            'message': f'Level {level} completed successfully',
            'assessment': {
                'level_1_score': assessment.level_1_score,
                'level_2_score': assessment.level_2_score,
                'risk_profile': assessment.risk_profile,
                'level_1_completed': assessment.level_1_completed,
                'level_2_completed': assessment.level_2_completed,
                'level_3_completed': assessment.level_3_completed
            }
        })
        
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
@require_http_methods(["GET"])
def get_user_assessment(request):
    """
    Get user's current assessment status and results
    """
    try:
        username = request.GET.get('username')
        
        if not username:
            return JsonResponse({
                'success': False,
                'message': 'Username is required'
            }, status=400)
        
        assessment = InvestmentAssessment.objects(username=username).first()
        
        if not assessment:
            return JsonResponse({
                'success': True,
                'message': 'No assessment found for user',
                'assessment': None
            })
        
        # Get user's answers for additional context
        all_answers = UserAnswer.objects(username=username)
        answers_by_level = {1: [], 2: [], 3: []}
        
        for answer in all_answers:
            answer_data = {
                'question_id': answer.question_id,
                'selected_option_id': answer.selected_option_id,
                'selected_option_label': answer.selected_option_label,
                'option_score': answer.option_score,
                'manual_input_value': answer.manual_input_value,
                'input_key': answer.input_key
            }
            answers_by_level[answer.level].append(answer_data)
        
        assessment_data = {
            'username': assessment.username,
            'level_1_score': assessment.level_1_score,
            'level_2_score': assessment.level_2_score,
            'risk_profile': assessment.risk_profile,
            'level_1_completed': assessment.level_1_completed,
            'level_2_completed': assessment.level_2_completed,
            'level_3_completed': assessment.level_3_completed,
            'annual_income': float(assessment.annual_income) if assessment.annual_income else None,
            'monthly_savings': float(assessment.monthly_savings) if assessment.monthly_savings else None,
            'current_age': assessment.current_age,
            'target_goal_age': assessment.target_goal_age,
            'goal_cost_today': float(assessment.goal_cost_today) if assessment.goal_cost_today else None,
            'started_at': assessment.started_at.isoformat() if assessment.started_at else None,
            'completed_at': assessment.completed_at.isoformat() if assessment.completed_at else None,
            'answers': answers_by_level
        }
        
        return JsonResponse({
            'success': True,
            'assessment': assessment_data
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'An error occurred: {str(e)}'
        }, status=500)
