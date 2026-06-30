import SiteHeader from "../components/SiteHeader";
import SketchColorAnimator from "../components/SketchColorAnimator";

export const metadata = {
  title: "Studio — Magic Sketch Studio",
  description:
    "Upload or capture a sketch, choose a style and palette, and colorize it with AI.",
};

export default function StudioPage() {
  return (
    <div className="min-h-screen bg-[#06081a]">
      <SiteHeader />
      <SketchColorAnimator />
    </div>
  );
}
