import SmoothScroll   from "@/components/SmoothScroll";
import ProgressBar    from "@/components/ProgressBar";
import Spotlight      from "@/components/Spotlight";
import NavbarSmart    from "@/components/NavbarSmart";
import Hero           from "@/components/Hero";
import Marquee        from "@/components/Marquee";
import About          from "@/components/About";
import Experience     from "@/components/Experience";
import WhyUs          from "@/components/WhyUs";
import Programs       from "@/components/Programs";
import Trainers       from "@/components/Trainers";
import Transformation from "@/components/Transformation";
import Stats          from "@/components/Stats";
import Membership     from "@/components/Membership";
import FAQ            from "@/components/FAQ";
import Contact        from "@/components/Contact";
import Footer         from "@/components/Footer";
import MobileCTA      from "@/components/MobileCTA";
import PageWrapper    from "@/components/PageWrapper";
import { auth }       from "@/auth";

export default async function Home() {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const role       = session?.user?.role;
  const dashboardHref = role === "member" ? "/dashboard" : "/admin/dashboard";

  return (
    <PageWrapper>
      <div className="relative bg-[#050505] text-white antialiased">
        <SmoothScroll />
        <ProgressBar />
        <Spotlight />
        <NavbarSmart isLoggedIn={isLoggedIn} dashboardHref={dashboardHref} />
        <main>
          <Hero />
          <Marquee />
          <About />
          <Experience />
          <WhyUs />
          <Programs />
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
    </PageWrapper>
  );
}
