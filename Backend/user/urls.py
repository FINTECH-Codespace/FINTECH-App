from django.urls import path,include
from . import views
from . import investment_views

urlpatterns = [
    path('login/',views.login,name='login'),
    path('signup/',views.signup,name='signup'),
    
    # Investment Assessment APIs
    path('questions/<int:level>/', investment_views.get_questions_by_level, name='get_questions_by_level'),
    path('submit-answer/', investment_views.submit_answer, name='submit_answer'),
    path('complete-level/', investment_views.complete_level, name='complete_level'),
    path('assessment/', investment_views.get_user_assessment, name='get_user_assessment'),
]