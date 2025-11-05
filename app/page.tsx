import Hero from "./components/Hero";
import DailyHoroscope from "./components/DailyHoroscope";
import OurJourney from "./components/OurJourney";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent font-sans">
      <main className="flex min-h-screen w-full flex-col items-stretch justify-start">
        <Hero />
        <DailyHoroscope />
        <OurJourney />
      </main>
    </div>
  );
}
