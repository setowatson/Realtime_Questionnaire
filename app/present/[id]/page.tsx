import { getSurvey } from "@/app/actions"
import { notFound } from "next/navigation"
import PresentationView from "@/components/presentation-view"

export default async function PresentPage({ params }: { params: { id: string } }) {
  const survey = await getSurvey(params.id)

  if (!survey) {
    notFound()
  }

  return <PresentationView survey={survey} />
}
