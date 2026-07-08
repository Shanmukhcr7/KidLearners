import { PageHeader } from "@/components/layout/PageHeader"
import { LearningPaths } from "@/components/home/LearningPaths"
import { FeaturedProjects } from "@/components/home/FeaturedProjects"

export default function ProgramsPage() {
  return (
    <>
      <PageHeader 
        title="Our Programs" 
        description="Discover age-appropriate learning paths designed to take your child from beginner to AI creator."
      />
      <div className="py-12">
        <LearningPaths />
      </div>
      <FeaturedProjects />
    </>
  )
}
