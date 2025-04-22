"use server"

import { revalidatePath } from "next/cache"
import type { Answer, SurveyData } from "./types"

// サーバー側でデータを保持するための一時的なストレージ
// 実際のアプリケーションではデータベースを使用することをお勧めします
let surveyData: SurveyData = {
  title: "リアルタイムアンケート",
  description: "このアンケートはリアルタイムで結果が表示されます",
  questions: [
    {
      id: "q1",
      text: "このプレゼンテーションの内容は理解しやすかったですか？",
      type: "rating",
    },
    {
      id: "q2",
      text: "最も興味深かったトピックは？",
      type: "multiple-choice",
      options: ["製品の特徴", "技術的な詳細", "価格設定", "ユースケース"],
    },
    {
      id: "q3",
      text: "ご質問やコメントがあればお書きください",
      type: "text",
    },
  ],
  answers: [],
}

export async function getSurveyData(): Promise<SurveyData> {
  try {
    // データのディープコピーを返す
    return JSON.parse(JSON.stringify(surveyData))
  } catch (error) {
    console.error("Error fetching survey data:", error)
    throw new Error("アンケートデータの取得に失敗しました")
  }
}

export async function submitAnswer(answer: Omit<Answer, "timestamp">): Promise<void> {
  try {
    const newAnswer: Answer = {
      ...answer,
      timestamp: Date.now(),
    }

    // 既存の回答を更新または新しい回答を追加
    const existingAnswerIndex = surveyData.answers.findIndex((a) => a.questionId === answer.questionId)

    if (existingAnswerIndex >= 0) {
      surveyData.answers[existingAnswerIndex] = newAnswer
    } else {
      surveyData.answers.push(newAnswer)
    }

    // すべてのパスを再検証
    revalidatePath("/")
    revalidatePath("/answer")
    revalidatePath("/admin")
  } catch (error) {
    console.error("Error submitting answer:", error)
    throw new Error("回答の送信に失敗しました")
  }
}

export async function resetSurvey(): Promise<void> {
  try {
    surveyData.answers = []

    // すべてのパスを再検証
    revalidatePath("/")
    revalidatePath("/answer")
    revalidatePath("/admin")
  } catch (error) {
    console.error("Error resetting survey:", error)
    throw new Error("アンケートのリセットに失敗しました")
  }
}

// updateSurveyConfig関数を更新して質問の更新をサポート
export async function updateSurveyConfig(newConfig: Partial<SurveyData>): Promise<void> {
  try {
    // 質問が提供された場合、IDを確認して既存のIDを保持
    if (newConfig.questions) {
      newConfig.questions = newConfig.questions.map((question) => {
        // 既存の質問のIDを保持
        const existingQuestion = surveyData.questions.find((q) => q.id === question.id)
        if (existingQuestion) {
          return {
            ...question,
            id: existingQuestion.id,
          }
        }
        return question
      })
    }

    surveyData = {
      ...surveyData,
      ...newConfig,
    }

    // すべてのパスを再検証
    revalidatePath("/")
    revalidatePath("/answer")
    revalidatePath("/admin")
  } catch (error) {
    console.error("Error updating survey config:", error)
    throw new Error("アンケート設定の更新に失敗しました")
  }
}
