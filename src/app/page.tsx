import { Hero } from "@/components/home/Hero"
import { TrustedBy } from "@/components/home/TrustedBy"
import { WhyKidLearners } from "@/components/home/WhyKidLearners"
import { LearningPaths } from "@/components/home/LearningPaths"
import { FeaturedProjects } from "@/components/home/FeaturedProjects"
import { Stats } from "@/components/home/Stats"
import { ParentSection } from "@/components/home/ParentSection"
import { Testimonials } from "@/components/home/Testimonials"

export default function Home() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <WhyKidLearners />
      <LearningPaths />
      <FeaturedProjects />
      <Stats />
      <ParentSection />
      <Testimonials />
    </>
  );
}
