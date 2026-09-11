import { usePageTitle } from "../lib/usePageTitle";
import ProjectGallery from "../components/ProjectGallery";
import VideoShowcase from "../components/VideoShowcase";
import Transformations from "../components/Transformations";

export default function ProjectsPage() {
  usePageTitle(
    "Projects",
    "Real GSN Construction projects across Seattle — roofing, bathrooms, flooring and exteriors, with photos and job-site video from our crew."
  );
  return (
    <>
      <ProjectGallery />
      <VideoShowcase />
      <Transformations />
    </>
  );
}
