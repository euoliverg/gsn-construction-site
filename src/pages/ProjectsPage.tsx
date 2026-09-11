import { usePageTitle } from "../lib/usePageTitle";
import ProjectGallery from "../components/ProjectGallery";
import VideoShowcase from "../components/VideoShowcase";
import Transformations from "../components/Transformations";

export default function ProjectsPage() {
  usePageTitle("Projects");
  return (
    <>
      <ProjectGallery />
      <VideoShowcase />
      <Transformations />
    </>
  );
}
