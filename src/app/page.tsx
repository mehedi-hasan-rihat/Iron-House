import Navbar        from "@/components/Navbar";
import Hero          from "@/components/Hero";
import Marquee       from "@/components/Marquee";
import About         from "@/components/About";
import Experience    from "@/components/Experience";
import WhyUs         from "@/components/WhyUs";
import Programs      from "@/components/Programs";
import Trainers      from "@/components/Trainers";
import Transformation from "@/components/Transformation";
import Membership    from "@/components/Membership";
import FAQ           from "@/components/FAQ";
import Contact       from "@/components/Contact";
import Footer        from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Experience />
        <WhyUs />
        <Programs />
        <Trainers />
        <Transformation />
        <Membership />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
