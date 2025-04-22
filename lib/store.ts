"use client"

import { create } from "zustand"
import type { Answer, SurveyData } from "./types"

interface SurveyStore {
  surveyData: SurveyData | null
  setSurveyData: (data: SurveyData) => void
  addAnswer: (answer: Answer) => void
  getAnswersForQuestion: (questionId: string) => Answer[]
}

export const useSurveyStore = create<SurveyStore>((set, get) => ({
  surveyData: null,
  setSurveyData: (data) => set({ surveyData: data }),
  addAnswer: (answer) =>
    set((state) => {
      if (!state.surveyData) return state

      const existingAnswerIndex = state.surveyData.answers.findIndex((a) => a.questionId === answer.questionId)

      const updatedAnswers = [...state.surveyData.answers]

      if (existingAnswerIndex >= 0) {
        updatedAnswers[existingAnswerIndex] = answer
      } else {
        updatedAnswers.push(answer)
      }

      return {
        surveyData: {
          ...state.surveyData,
          answers: updatedAnswers,
        },
      }
    }),
  getAnswersForQuestion: (questionId) => {
    const state = get()
    if (!state.surveyData) return []
    return state.surveyData.answers.filter((a) => a.questionId === questionId)
  },
}))
