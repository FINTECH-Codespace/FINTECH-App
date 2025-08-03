import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";
import {
  level1Questions,
  secondaryLevelQuestions,
  level3Questions,
  Question,
  Option,
} from "./data";

export default function QuizScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { level = "1", previousAnswers = "[]" } = useLocalSearchParams();

  const currentLevel = parseInt(level as string);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [allPreviousAnswers, setAllPreviousAnswers] = useState<any[]>([]);
  const [inputData, setInputData] = useState<{
    income: string;
    saving: string;
    currentAge: string;
    targetGoalAge: string;
    goalCostToday: string;
    profileHealthSummary: string;
  }>({
    income: "",
    saving: "",
    currentAge: "",
    targetGoalAge: "",
    goalCostToday: "",
    profileHealthSummary: "",
  });

  // Get questions based on current level
  const getQuestionsForLevel = (level: number): Question[] => {
    switch (level) {
      case 1:
        return level1Questions;
      case 2:
        return secondaryLevelQuestions;
      case 3:
        return level3Questions;
      default:
        return level1Questions;
    }
  };

  const currentQuestions = getQuestionsForLevel(currentLevel);
  const currentQuestion = currentQuestions[currentIndex];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `Investment Quiz - Level ${currentLevel}`,
      headerBackTitleVisible: false,
      headerStyle: { backgroundColor: "#001D39" },
      headerTintColor: "#EDF4FB",
    });
  }, [currentLevel]);

  useEffect(() => {
    // Parse previous answers if coming from a previous level
    try {
      const parsed = JSON.parse(previousAnswers as string);
      setAllPreviousAnswers(parsed);
    } catch (error) {
      setAllPreviousAnswers([]);
    }
  }, [previousAnswers]);

  useEffect(() => {
    if ("key" in currentQuestion && currentQuestion.key === "saving") {
      const income = parseInt(inputData.income);
      const saving = parseInt(inputData.saving);
  
      if (!isNaN(income) && !isNaN(saving) && income > 0) {
        const savingRatio = saving / income;
  
        let score = 1;
        if (savingRatio >= 0.3) score = 3;
        else if (savingRatio >= 0.2) score = 2;
  
        const updatedAnswers = [...answers];
        updatedAnswers[currentIndex] = score;
        setAnswers(updatedAnswers);

        const updatedSelectedAnswers = [...selectedAnswers];
        updatedSelectedAnswers[currentIndex] = `₹${saving}`;
        setSelectedAnswers(updatedSelectedAnswers);
      }
    }
  }, [currentIndex, inputData.income, inputData.saving]);

  const handleOptionSelect = (score: number, optionLabel: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = score;
    setAnswers(updatedAnswers);

    const updatedSelectedAnswers = [...selectedAnswers];
    updatedSelectedAnswers[currentIndex] = optionLabel;
    setSelectedAnswers(updatedSelectedAnswers);
  };

  const handleNext = () => {
    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSubmit = () => {
    const totalScore = answers.reduce((sum, score) => sum + score, 0);
    
    // Prepare current level answers
    const currentLevelAnswers = currentQuestions.map((question, index) => ({
      level: currentLevel,
      questionId: question.id,
      category: question.category,
      question: question.question,
      selectedAnswer: selectedAnswers[index] || "",
      score: answers[index] || 0,
    }));

    // Combine with all previous answers
    const allAnswers = [...allPreviousAnswers, ...currentLevelAnswers];

    router.push({
      pathname: "/Investment/result",
      params: {
        score: totalScore.toString(),
        income: inputData.income || "0",
        saving: inputData.saving || "0",
        currentAge: inputData.currentAge || "0",
        targetGoalAge: inputData.targetGoalAge || "0",
        goalCostToday: inputData.goalCostToday || "0",
        profileHealthSummary: inputData.profileHealthSummary || "",
        level: currentLevel.toString(),
        allAnswers: JSON.stringify(allAnswers),
      },
    });
  };

  function isManualInputQuestion(
    question: Question
  ): question is Question & { key: string } {
    return question.manualInput === true && typeof question.key === "string";
  }

  const getScoreFromManualInput = (value: string, key: string) => {
    const v = parseInt(value);
    if (isNaN(v)) return 0;

    if (key === "income") {
      const min = 200000;
      const max = 2000000;
      if (v <= min) return 1;
      if (v >= max) return 5;
      return Math.round(((v - min) / (max - min)) * 4 + 1);
    }
    
    if (key === "saving") {
      const min = 20000;
      const max = 50000;
      if (v <= min) return 1;
      if (v >= max) return 5;
      return Math.round(((v - min) / (max - min)) * 4 + 1);
    }

    // For other manual inputs, return a default score
    return 3;
  };

  const handleManualInputChange = (text: string, key: string) => {
    setInputData({ ...inputData, [key]: text });
    
    const updatedSelectedAnswers = [...selectedAnswers];
    updatedSelectedAnswers[currentIndex] = text;
    setSelectedAnswers(updatedSelectedAnswers);

    if (key === "income" || key === "saving") {
      const score = getScoreFromManualInput(text, key);
      const updatedAnswers = [...answers];
      updatedAnswers[currentIndex] = score;
      setAnswers(updatedAnswers);
    } else {
      // For non-scoring manual inputs, set a default score
      const updatedAnswers = [...answers];
      updatedAnswers[currentIndex] = text.trim() ? 1 : 0;
      setAnswers(updatedAnswers);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Level {currentLevel} - Question {currentIndex + 1} of {currentQuestions.length}
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentIndex + 1) / currentQuestions.length) * 100}%` }
            ]} 
          />
        </View>
      </View>

      <Text style={styles.category}>{currentQuestion.category}</Text>
      <Text style={styles.question}>{currentQuestion.question}</Text>

      <View style={styles.options}>
        {isManualInputQuestion(currentQuestion) ? (
          <>
            <TextInput
              keyboardType={currentQuestion.key === "profileHealthSummary" ? "default" : "numeric"}
              placeholder={
                currentQuestion.key === "profileHealthSummary" 
                  ? "Enter your financial health summary"
                  : `Enter your ${currentQuestion.category.toLowerCase()}${
                      currentQuestion.key === "income" || currentQuestion.key === "saving" || 
                      currentQuestion.key === "goalCostToday" ? " in ₹" : ""
                    }`
              }
              value={inputData[currentQuestion.key as keyof typeof inputData]}
              onChangeText={(text) => handleManualInputChange(text, currentQuestion.key!)}
              style={[
                styles.inputBox,
                currentQuestion.key === "profileHealthSummary" && styles.textAreaInput
              ]}
              placeholderTextColor="#999"
              multiline={currentQuestion.key === "profileHealthSummary"}
              numberOfLines={currentQuestion.key === "profileHealthSummary" ? 4 : 1}
            />
          </>
        ) : (
          currentQuestion.options?.map((option) => {
            const selected = selectedAnswers[currentIndex] === option.label;
            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleOptionSelect(option.score || 0, option.label)}
                style={[
                  styles.optionButton,
                  selected && styles.selectedOption,
                ]}
              >
                <Text
                  style={[styles.optionText, selected && styles.selectedText]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.nextButton,
          !selectedAnswers[currentIndex] && styles.disabledButton
        ]}
        onPress={
          currentIndex < currentQuestions.length - 1
            ? handleNext
            : handleSubmit
        }
        disabled={!selectedAnswers[currentIndex]}
      >
        <Text style={styles.nextText}>
          {currentIndex < currentQuestions.length - 1 ? "Next" : "Submit"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const COLORS = {
  primary: "#001D39",
  muted: "#D6E3F0",
  selected: "#6EA2B3",
  white: "#fff",
  gray: "#0A4174",
  background: "#F2F6FB",
  disabled: "#ccc",
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: COLORS.background,
    flexGrow: 1,
    justifyContent: "center",
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.gray,
    marginBottom: 8,
    textAlign: "center",
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.muted,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.selected,
    borderRadius: 2,
  },
  category: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.gray,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  question: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 28,
  },
  options: {
    marginBottom: 40,
  },
  optionButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.muted,
    borderRadius: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  selectedOption: {
    backgroundColor: COLORS.selected,
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.primary,
  },
  selectedText: {
    fontWeight: "700",
    color: COLORS.white,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: COLORS.disabled,
  },
  nextText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  inputBox: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    borderColor: COLORS.muted,
    borderWidth: 1,
    color: COLORS.primary,
  },
  textAreaInput: {
    height: 100,
    textAlignVertical: "top",
  },
});