# Investment Assessment API Documentation

## Overview
This API handles the investment assessment questionnaire system with three levels of questions. Users can retrieve questions by level, submit answers, and track their progress.

## Database Collections

### 1. `investment_questions`
Stores all questions organized by levels:
- **Fields**: question_id, level, category, question_text, manual_input, input_key, options, is_active
- **Indexes**: question_id, level, category

### 2. `user_answers`
Stores user responses to questions:
- **Fields**: username, question_id, level, selected_option_id, manual_input_value, option_score
- **Indexes**: username, question_id, level

### 3. `investment_assessments`
Stores user assessment summary and scores:
- **Fields**: username, level_1_score, level_2_score, risk_profile, completion status, financial data
- **Indexes**: username

## API Endpoints

### 1. Get Questions by Level
**GET** `/user/questions/<level>/`

Retrieves all questions for a specific level (1, 2, or 3).

**Parameters:**
- `level` (URL parameter): Integer (1, 2, or 3)

**Response:**
```json
{
    "success": true,
    "level": 1,
    "questions": [
        {
            "id": 1,
            "category": "Age",
            "question": "What is your age?",
            "manualInput": false,
            "key": null,
            "options": [
                {"id": 101, "label": "Under 30", "score": 5},
                {"id": 102, "label": "30–50", "score": 3},
                {"id": 103, "label": "Over 50", "score": 1}
            ]
        }
    ]
}
```

### 2. Submit Answer
**POST** `/user/submit-answer/`

Submits an answer for a specific question.

**Request Body:**
```json
{
    "username": "john_doe",
    "question_id": 1,
    "level": 1,
    "selected_option_id": 101  // For multiple choice
}
```

**For Manual Input:**
```json
{
    "username": "john_doe",
    "question_id": 2,
    "level": 1,
    "manual_input_value": "500000"  // For manual input
}
```

**Response:**
```json
{
    "success": true,
    "message": "Answer submitted successfully",
    "answer_id": "507f1f77bcf86cd799439011"
}
```

### 3. Complete Level
**POST** `/user/complete-level/`

Marks a level as completed and calculates scores.

**Request Body:**
```json
{
    "username": "john_doe",
    "level": 1
}
```

**Response:**
```json
{
    "success": true,
    "message": "Level 1 completed successfully",
    "assessment": {
        "level_1_score": 25,
        "level_2_score": 0,
        "risk_profile": null,
        "level_1_completed": true,
        "level_2_completed": false,
        "level_3_completed": false
    }
}
```

### 4. Get User Assessment
**GET** `/user/assessment/?username=john_doe`

Retrieves user's current assessment status and results.

**Parameters:**
- `username` (query parameter): String

**Response:**
```json
{
    "success": true,
    "assessment": {
        "username": "john_doe",
        "level_1_score": 25,
        "level_2_score": 18,
        "risk_profile": "Moderate",
        "level_1_completed": true,
        "level_2_completed": true,
        "level_3_completed": false,
        "annual_income": 500000.0,
        "monthly_savings": 25000.0,
        "current_age": null,
        "target_goal_age": null,
        "goal_cost_today": null,
        "started_at": "2025-08-06T10:30:00.000Z",
        "completed_at": null,
        "answers": {
            "1": [/* Level 1 answers */],
            "2": [/* Level 2 answers */],
            "3": [/* Level 3 answers */]
        }
    }
}
```

## Risk Profile Calculation

Based on combined Level 1 and Level 2 scores:
- **Risk Averser**: Total Score ≤ 12
- **Conservative**: Total Score 13-20
- **Moderate**: Total Score 21-28
- **Growth-Oriented**: Total Score 29-36
- **Risk Taker**: Total Score > 36

## Question Types

### Level 1: Basic Risk Assessment (7 questions)
- Age, Income, Investment Horizon, Financial Goals, Risk Preference, Experience, Savings

### Level 2: Financial Health Assessment (7 questions)
- Current Assets, Insurance Coverage, Emergency Fund, Debt Status, Dependents, Tax Optimization, Profile Summary

### Level 3: Goal Planning (8 questions)
- Current Age, Target Age, Goal Type, Goal Cost, Annual Investment, Expected Returns, Inflation, Goal Protection

## Usage Flow

1. **Get Level 1 Questions**: `GET /user/questions/1/`
2. **Submit Each Answer**: `POST /user/submit-answer/`
3. **Complete Level 1**: `POST /user/complete-level/`
4. **Repeat for Levels 2 and 3**
5. **Get Final Assessment**: `GET /user/assessment/?username=john_doe`

## Error Handling

All endpoints return appropriate HTTP status codes:
- **200**: Success
- **400**: Bad Request (missing parameters, invalid data)
- **404**: Not Found (user/question not found)
- **500**: Internal Server Error

Error response format:
```json
{
    "success": false,
    "message": "Error description"
}
```

## Testing the APIs

### Example cURL Commands:

**Get Level 1 Questions:**
```bash
curl http://localhost:8000/user/questions/1/
```

**Submit Multiple Choice Answer:**
```bash
curl -X POST http://localhost:8000/user/submit-answer/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "question_id": 1,
    "level": 1,
    "selected_option_id": 101
  }'
```

**Submit Manual Input Answer:**
```bash
curl -X POST http://localhost:8000/user/submit-answer/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "question_id": 2,
    "level": 1,
    "manual_input_value": "500000"
  }'
```

**Complete Level:**
```bash
curl -X POST http://localhost:8000/user/complete-level/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "level": 1
  }'
```

**Get Assessment:**
```bash
curl "http://localhost:8000/user/assessment/?username=john_doe"
```
