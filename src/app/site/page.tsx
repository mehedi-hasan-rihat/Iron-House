import SmoothScroll    from "@/components/SmoothScroll";
import ProgressBar     from "@/components/ProgressBar";
import Spotlight       from "@/components/Spotlight";
import OfferBar        from "@/components/OfferBar";
import Navbar          from "@/components/Navbar";
import Hero            from "@/components/Hero";
import Marquee         from "@/components/Marquee";
import About           from "@/components/About";
import Experience      from "@/components/Experience";
import WhyUs           from "@/components/WhyUs";
import Trainers        from "@/components/Trainers";
import Transformation  from "@/components/Transformation";
import Stats           from "@/components/Stats";
import Membership      from "@/components/Membership";
import Offers          from "@/components/Offers";
import FAQ             from "@/components/FAQ";
import Contact         from "@/components/Contact";
import Footer          from "@/components/Footer";
import MobileCTA       from "@/components/MobileCTA";
import { OFFERS }      from "@/content/offers";

export default function Home() {
  return (
    <div className="relative bg-[#050505] text-white antialiased">
      <SmoothScroll />
      <ProgressBar />
      <Spotlight />
      <OfferBar offers={OFFERS} />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Offers offers={OFFERS} />
        <About />
        <Experience />
        <WhyUs />
        <Trainers />
        <Transformation />
        <Stats />
        <Membership />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <MobileCTA />
      {/* Mobile bottom bar spacer */}
      <div className="h-16 md:h-0" />
    </div>
  );
}
