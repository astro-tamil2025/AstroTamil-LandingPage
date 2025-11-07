import { Suspense } from "react";
import Hero from "./components/Hero";
import DailyHoroscope from "./components/DailyHoroscope";
import OurJourney from "./components/OurJourney";
import ContactFooter from "./components/ContactFooter";

function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent font-sans">
      <main className="flex min-h-screen w-full flex-col items-stretch justify-start">
        <Suspense fallback={<div className="min-h-[600px]" />}>
          <Hero />
        </Suspense>
        <Suspense fallback={<div className="min-h-[600px]" />}>
          <DailyHoroscope />
        </Suspense>
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <OurJourney />
        </Suspense>
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <ContactFooter />
        </Suspense>
      </main>
    </div>
  );
}

export default Home;
