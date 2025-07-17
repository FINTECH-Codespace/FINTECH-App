import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";

type Option = { label: string; score: number };

type QuestionWithOptions = {
  category: string;
  question: string;
  options: Option[];
  manualInput?: false;
  key?: undefined;
};

type QuestionWithManualInput = {
  category: string;
  question: string;
  manualInput: true;
  key: "income" | "saving";
  options?: undefined;
};

type Question = QuestionWithOptions | QuestionWithManualInput;

const questions: Question[] = [
  {
    category: "Age",
    question: "What is your age?",
    options: [
      { label: "Under 30", score: 5 },
      { label: "30–50", score: 3 },
      { label: "Over 50", score: 1 },
    ],
  },
  {
    category: "Income",
    question: "What is your annual income?",
    manualInput: true,
    key: "income",
  },
  {
    category: "Investment Horizon",
    question: "How many years do you plan to invest?",
    options: [
      { label: "10+ years", score: 5 },
      { label: "5–10 years", score: 3 },
      { label: "≤ 5 years", score: 1 },
    ],
  },
  {
    category: "Financial Goals",
    question: "What is the main goal of this investment?",
    options: [
      { label: "Long-term growth", score: 5 },
      { label: "Balanced growth + safety", score: 3 },
      { label: "Capital preservation", score: 1 },
    ],
  },
  {
    category: "Risk Preference",
    question: "How would you feel if your investment dropped 20% in a year?",
    options: [
      { label: "No worries", score: 5 },
      { label: "Concerned, but I’ll wait", score: 3 },
      { label: "I'll sell", score: 1 },
    ],
  },
  {
    category: "Experience",
    question: "How familiar are you with investments?",
    options: [
      { label: "Very experienced", score: 5 },
      { label: "Some experience", score: 3 },
      { label: "No experience", score: 1 },
    ],
  },
  {
    category: "Savings",
    question: "What’s your average monthly savings after expenses?",
    manualInput: true,
    key: "saving",
  },
];

export default function QuizScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [inputData, setInputData] = useState<{
    income: string;
    saving: string;
  }>({
    income: "",
    saving: "",
  });
  const [computedOptions, setComputedOptions] = useState<Option[]>([]);

  const currentQuestion = questions[currentIndex];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Investment Quiz",
      headerBackTitleVisible: false,
      headerStyle: { backgroundColor: "#001D39" },
      headerTintColor: "#EDF4FB",
    });
  }, []);

  useEffect(() => {
    if ("key" in currentQuestion && currentQuestion.key === "saving") {
      const income = parseInt(inputData.income);
      if (!isNaN(income)) {
        const high = Math.round(income * 0.3);
        const mid = Math.round(income * 0.2);
        const low = Math.round(income * 0.1);
        setComputedOptions([
          { label: `≥ ₹${high}`, score: 3 },
          { label: `₹${mid}–${high}`, score: 2 },
          { label: `< ₹${mid}`, score: 1 },
        ]);
      }
    }
  }, [currentIndex, inputData.income]);

  const handleOptionSelect = (score: number) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = score;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSubmit = () => {
    const totalScore = answers.reduce((sum, score) => sum + score, 0);
    router.push({
      pathname: "/Investment/result",
      params: {
        score: totalScore.toString(),
        income: inputData.income || "0",
        saving: inputData.saving || "0",
      },
    });
  };

  const getScoreFromManualInput = (value: string, key: "income" | "saving") => {
    const v = parseInt(value);
    if (isNaN(v)) return 0;

    const min = key === "income" ? 200000 : 20000;
    const max = key === "income" ? 2000000 : 50000;

    if (v <= min) return 1;
    if (v >= max) return 5;

    return Math.round(((v - min) / (max - min)) * 4 + 1);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.category}>{currentQuestion.category}</Text>
      <Text style={styles.question}>{currentQuestion.question}</Text>

      <View style={styles.options}>
        {currentQuestion.manualInput ? (
          <>
            <TextInput
              keyboardType="numeric"
              placeholder={`Enter your ${currentQuestion.category.toLowerCase()} in ₹`}
              value={inputData[currentQuestion.key]}
              onChangeText={(text) => {
                setInputData({ ...inputData, [currentQuestion.key]: text });
                const score = getScoreFromManualInput(
                  text,
                  currentQuestion.key
                );
                const updatedAnswers = [...answers];
                updatedAnswers[currentIndex] = score;
                setAnswers(updatedAnswers);
              }}
              style={styles.inputBox}
              placeholderTextColor="#999"
            />

            {/* If question is saving and computedOptions available */}
            {currentQuestion.key === "saving" &&
              computedOptions.map((opt, i) => {
                const selected = answers[currentIndex] === opt.score;
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      // Determine value to autofill from label range
                      let selectedValue = "0";
                      const digits = opt.label.match(/\d+/g);
                      if (digits) {
                        selectedValue = digits[0]; // use first number found
                      }

                      const updatedAnswers = [...answers];
                      updatedAnswers[currentIndex] = opt.score;
                      setAnswers(updatedAnswers);

                      setInputData({ ...inputData, saving: selectedValue });
                    }}
                    style={[
                      styles.optionButton,
                      selected && styles.selectedOption,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.selectedText,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </>
        ) : (
          currentQuestion.options?.map((option, i) => {
            const selected = answers[currentIndex] === option.score;
            return (
              <TouchableOpacity
                key={i}
                onPress={() => handleOptionSelect(option.score)}
                style={[styles.optionButton, selected && styles.selectedOption]}
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
        style={styles.nextButton}
        onPress={
          currentIndex < questions.length - 1 ? handleNext : handleSubmit
        }
        disabled={answers[currentIndex] == null}
      >
        <Text style={styles.nextText}>
          {currentIndex < questions.length - 1 ? "Next" : "Submit"}
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
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: COLORS.background,
    flexGrow: 1,
    justifyContent: "center",
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
  hintBox: {
    backgroundColor: "#E6EDF7",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  hintText: {
    fontSize: 16,
    color: COLORS.gray,
  },
});
