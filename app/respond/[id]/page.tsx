import { getSurvey } from "@/app/actions"
import { notFound } from "next/navigation"
import ResponseForm from "@/components/response-form"

export default async function RespondPage({ params }: { params: { id: string } }) {
  const survey = await getSurvey(params.id)

  if (!survey) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">{survey.title}</h1>
      {survey.description && <p className="mb-6 text-gray-600">{survey.description}</p>}

      <ResponseForm survey={survey} />
    </div>
  )
}
