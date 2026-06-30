import SiteHeader from "./components/SiteHeader";
import Home from "./components/Home";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#06081a]">
      <SiteHeader />
      <Home />
    </div>
  );
}
