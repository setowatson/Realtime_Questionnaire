export type QuestionType = "multiple-choice" | "text" | "rating"

export interface Question {
  id: string
  text: string
  type: QuestionType
  options?: string[]
}

export interface Answer {
  questionId: string
  value: string
  timestamp: number
}

export interface SurveyData {
  title: string
  description: string
  questions: Question[]
  answers: Answer[]
}
