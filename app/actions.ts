"use server"

import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

// 本番環境ではデータベースを使用するべきですが、
// デモのために一時的にメモリ内ストレージを使用します
const surveys: Record<string, any> = {}
const responses: Record<string, any[]> = {}

export async function createSurvey(data: {
  title: string
  description: string
  questions: { text: string; options: string[] }[]
}) {
  const surveyId = uuidv4()

  surveys[surveyId] = {
    id: surveyId,
    title: data.title,
    description: data.description,
    questions: data.questions,
    createdAt: new Date().toISOString(),
  }

  // 回答用の空の配列を初期化
  responses[surveyId] = []

  return surveyId
}

export async function getSurvey(id: string) {
  return surveys[id] || null
}

export async function getAllSurveys() {
  return Object.values(surveys)
}

export async function submitResponse(surveyId: string, answers: Record<number, number>) {
  const responseId = uuidv4()
  const response = {
    id: responseId,
    surveyId,
    answers,
    submittedAt: new Date().toISOString(),
  }

  if (!responses[surveyId]) {
    responses[surveyId] = []
  }

  responses[surveyId].push(response)
  revalidatePath(`/present/${surveyId}`)

  return responseId
}

export async function getSurveyResponses(surveyId: string) {
  return responses[surveyId] || []
}
