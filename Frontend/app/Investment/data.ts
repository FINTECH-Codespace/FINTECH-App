export interface Option {
  id: number;
  label: string;
  score?: number;
}

export interface Question {
  id: number;
  category: string;
  question: string;
  options: Option[];
  manualInput: boolean;
  key?: string;
}

// =================== Level-1 Questions ===================

export const level1Questions: Question[] = [
  {
    id: 1,
    category: "Age",
    question: "What is your age?",
    manualInput: false,
    options: [
      { id: 101, label: "Under 30", score: 5 },
      { id: 102, label: "30–50", score: 3 },
      { id: 103, label: "Over 50", score: 1 },
    ],
  },
  {
    id: 2,
    category: "Income",
    question: "What is your annual income?",
    manualInput: true,
    options: [],
    key: "income",
  },
  {
    id: 3,
    category: "Investment Horizon",
    question: "How many years do you plan to invest?",
    manualInput: false,
    options: [
      { id: 301, label: "10+ years", score: 5 },
      { id: 302, label: "5–10 years", score: 3 },
      { id: 303, label: "≤ 5 years", score: 1 },
    ],
  },
  {
    id: 4,
    category: "Financial Goals",
    question: "What is the main goal of this investment?",
    manualInput: false,
    options: [
      { id: 401, label: "Long-term growth", score: 5 },
      { id: 402, label: "Balanced growth + safety", score: 3 },
      { id: 403, label: "Capital preservation", score: 1 },
    ],
  },
  {
    id: 5,
    category: "Risk Preference",
    question: "How would you feel if your investment dropped 20% in a year?",
    manualInput: false,
    options: [
      { id: 501, label: "No worries", score: 5 },
      { id: 502, label: "Concerned, but I'll wait", score: 3 },
      { id: 503, label: "I'll sell", score: 1 },
    ],
  },
  {
    id: 6,
    category: "Experience",
    question: "How familiar are you with investments?",
    manualInput: false,
    options: [
      { id: 601, label: "Very experienced", score: 5 },
      { id: 602, label: "Some experience", score: 3 },
      { id: 603, label: "No experience", score: 1 },
    ],
  },
  {
    id: 7,
    category: "Savings",
    question: "What's your average monthly savings after expenses?",
    manualInput: true,
    options: [],
    key: "saving",
  },
];

// =================== Level-2 Questions ===================

export const secondaryLevelQuestions: Question[] = [
  {
    id: 8,
    category: "Current Assets",
    question: "What percentage of your income is held as current assets?",
    options: [
      { id: 801, label: "≥ 30% (Strong liquidity position)", score: 5 },
      { id: 802, label: "15–29% (Moderate liquidity)", score: 3 },
      { id: 803, label: "< 15% (Poor liquidity)", score: 1 },
    ],
    manualInput: false,
  },
  {
    id: 9,
    category: "Insurance Coverage",
    question: "How well are you covered with insurance?",
    options: [
      { id: 901, label: "Fully protected (life, health, disability)", score: 5 },
      { id: 902, label: "Partially covered (some gaps in coverage)", score: 3 },
      { id: 903, label: "No or minimal insurance", score: 1 },
    ],
    manualInput: false,
  },
  {
    id: 10,
    category: "Emergency Fund",
    question: "How many months of expenses can your emergency fund cover?",
    options: [
      { id: 1001, label: "≥ 6 months (Excellent safety)", score: 5 },
      { id: 1002, label: "3–5 months (Decent, needs topping up)", score: 3 },
      { id: 1003, label: "< 3 months (Inadequate buffer)", score: 1 },
    ],
    manualInput: false,
  },
  {
    id: 11,
    category: "Debt Status",
    question: "What is your debt status as a percentage of income?",
    options: [
      { id: 1101, label: "< 20% (Excellent debt control)", score: 5 },
      { id: 1102, label: "20–40% (Manageable, needs planning)", score: 3 },
      { id: 1103, label: "> 40% (High debt burden)", score: 1 },
    ],
    manualInput: false,
  },
  {
    id: 12,
    category: "Non-Earning Dependents",
    question: "How many non-earning dependents do you have?",
    options: [
      { id: 1201, label: "No dependents (Freedom from liabilities)", score: 5 },
      { id: 1202, label: "1–2 dependents (Moderate responsibility)", score: 3 },
      { id: 1203, label: "3 or more dependents (Heavy responsibility)", score: 1 },
    ],
    manualInput: false,
  },
  {
    id: 13,
    category: "Tax Optimization",
    question: "How well do you utilize tax-saving opportunities?",
    options: [
      { id: 1301, label: "Fully utilizing tax options (Section 80C, 80D, etc.)", score: 5 },
      { id: 1302, label: "Partially optimized", score: 3 },
      { id: 1303, label: "No optimization", score: 1 },
    ],
    manualInput: false,
  },
  {
    id: 14,
    category: "Profile Health Summary",
    question: "Write a short summary of your financial health profile.",
    options: [],
    manualInput: true,
    key: "profileHealthSummary",
  },
];

// =================== Level-3 Questions ===================

export const level3Questions: Question[] = [
  {
    id: 15,
    category: "Current Age",
    question: "What is your current age?",
    options: [],
    manualInput: true,
    key: "currentAge",
  },
  {
    id: 16,
    category: "Target Goal Age",
    question: "At what age do you want to achieve this goal?",
    options: [],
    manualInput: true,
    key: "targetGoalAge",
  },
  {
    id: 17,
    category: "Goal Type",
    question: "What is the financial goal you're planning for?",
    options: [
      { id: 1701, label: "Retirement", score: 0 },
      { id: 1702, label: "Home", score: 0 },
      { id: 1703, label: "Car", score: 0 },
      { id: 1704, label: "Education", score: 0 },
      { id: 1705, label: "Business", score: 0 },
      { id: 1706, label: "Travel", score: 0 },
      { id: 1707, label: "Other", score: 0 },
    ],
    manualInput: false,
  },
  {
    id: 18,
    category: "Goal Cost (Today)",
    question: "What will this goal cost in today's value (₹)?",
    options: [],
    manualInput: true,
    key: "goalCostToday",
  },
  {
    id: 19,
    category: "Annual Investment",
    question: "How much are you investing per year for this goal?",
    options: [
      { id: 1901, label: "Not investing", score: 0 },
      { id: 1902, label: "< ₹50,000", score: 0 },
      { id: 1903, label: "₹50K – ₹1L", score: 0 },
      { id: 1904, label: "₹1L – ₹2L", score: 0 },
      { id: 1905, label: "₹2L+", score: 0 },
    ],
    manualInput: false,
  },
  {
    id: 20,
    category: "Expected Return Rate",
    question: "What annual return do you expect on this investment?",
    options: [
      { id: 2001, label: "Not sure", score: 0 },
      { id: 2002, label: "< 6%", score: 0 },
      { id: 2003, label: "6 – 8%", score: 0 },
      { id: 2004, label: "8 – 10%", score: 0 },
      { id: 2005, label: "> 10%", score: 0 },
    ],
    manualInput: false,
  },
  {
    id: 21,
    category: "Expected Inflation",
    question: "Expected inflation rate for this goal (cost increase per year)?",
    options: [
      { id: 2101, label: "Not sure", score: 0 },
      { id: 2102, label: "4 – 5%", score: 0 },
      { id: 2103, label: "6 – 7%", score: 0 },
      { id: 2104, label: "8 – 10%", score: 0 },
    ],
    manualInput: false,
  },
  {
    id: 22,
    category: "Goal Protection",
    question:
      "If you're unable to earn, is this goal financially protected (via insurance/savings)?",
    options: [
      { id: 2201, label: "Fully protected", score: 0 },
      { id: 2202, label: "Partially protected", score: 0 },
      { id: 2203, label: "Not protected", score: 0 },
      { id: 2204, label: "Not sure", score: 0 },
    ],
    manualInput: false,
  },
];

export type Allocation = {
  id: number;
  asset: string;
  percent: number;
};

export const allocations: Record<"Risk Averser" | "Conservative" | "Moderate" | "Growth-Oriented" | "Risk Taker", Allocation[]> = {
  "Risk Averser": [
    { id: 1, asset: "Fixed Income", percent: 88 },
    { id: 2, asset: "Equities", percent: 0 },
    { id: 3, asset: "Real Estate", percent: 5 },
    { id: 4, asset: "Precious Metals", percent: 7 },
  ],
  "Conservative": [
    { id: 5, asset: "Fixed Income", percent: 71 },
    { id: 6, asset: "Equities", percent: 21 },
    { id: 7, asset: "Real Estate", percent: 4 },
    { id: 8, asset: "Precious Metals ", percent: 4 },
  ],
  "Moderate": [
    { id: 9, asset: "Fixed Income", percent: 39 },
    { id: 10, asset: "Equities", percent: 50 },
    { id: 11, asset: "Real Estate", percent: 6 },
    { id: 12, asset: "Precious Metals ", percent: 6 },
  ],
  "Growth-Oriented": [
    { id: 13, asset: "Fixed Income", percent: 16 },
    { id: 14, asset: "Equities", percent: 69 },
    { id: 15, asset: "Real Estate", percent: 11 },
    { id: 16, asset: "Precious Metals ", percent: 5 },
  ],
  "Risk Taker": [
    { id: 17, asset: "Fixed Income", percent: 5 },
    { id: 18, asset: "Equities", percent: 83 },
    { id: 19, asset: "Real Estate", percent: 12 },
    { id: 20, asset: "Precious Metals ", percent: 5 },
  ],
};