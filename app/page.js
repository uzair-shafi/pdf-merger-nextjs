import Hero from "./components/Hero";
import Curved from "./components/Curved";
import HowWorks from "./components/HowWorks";
import Intro from "./components/Intro";
import Footer from "./components/Footer";
export default function Home() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <Curved />

      <Intro />
      <Footer />
    </main>
  );
}
