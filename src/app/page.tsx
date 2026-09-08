import SmoothScroll   from "@/components/SmoothScroll";
import ProgressBar    from "@/components/ProgressBar";
import Spotlight      from "@/components/Spotlight";
import OfferBar       from "@/components/OfferBar";
import NavbarSmart    from "@/components/NavbarSmart";
import Hero           from "@/components/Hero";
import Marquee        from "@/components/Marquee";
import About          from "@/components/About";
import Experience     from "@/components/Experience";
import WhyUs          from "@/components/WhyUs";
import Trainers       from "@/components/Trainers";
import Transformation from "@/components/Transformation";
import Stats          from "@/components/Stats";
import Membership     from "@/components/Membership";
import Offers         from "@/components/Offers";
import FAQ            from "@/components/FAQ";
import Contact        from "@/components/Contact";
import Footer         from "@/components/Footer";
import MobileCTA      from "@/components/MobileCTA";
import { auth }       from "@/auth";
import { OFFERS }     from "@/content/offers";

export default async function Home() {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const role       = session?.user?.role;
  const dashboardHref = role === "member" ? "/dashboard" : "/admin/dashboard";

  return (
    <div className="relative bg-[#050505] text-white antialiased">
      <SmoothScroll />
      <ProgressBar />
      <Spotlight />
      {/* Above the navbar: the one offer someone sees without scrolling. */}
      <OfferBar offers={OFFERS} />
      <NavbarSmart isLoggedIn={isLoggedIn} dashboardHref={dashboardHref} />
      <main>
        <Hero />
        <Marquee />
        {/* Third block on the page. Swap OFFERS for a `prisma.offer.findMany()`
            result when the admin side lands — the component only needs a
            serialisable Offer[]. */}
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
      <div className="h-16 md:h-0" />
    </div>
  );
}
