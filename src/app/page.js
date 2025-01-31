import { fetchProfileAction } from "@/actions";
import AboutSection from "@/components/about-page";
import Contact from "@/components/contact-page";
import FeaturesSection from "@/components/features";
import FeedBacks from "@/components/FeedBacks";
import Hero from "@/components/hero";
import HowToUse from "@/components/howtouse";
import Pricing from "@/components/pricing";
import Testimonials from "@/components/Testimonials";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Home() {
  const user = await currentUser();
  const profileInfo = await fetchProfileAction(user?.id);

  if (user && !profileInfo?._id) redirect("/onboard");

  return (
    <div className="w-full h-full min-h-screen">
      <div className="m-0 p-0 overflow-x-hidden">
        <Hero />
      </div>
      <div className="mt-10">
        <AboutSection />
      </div>
      <div className="mt-10">
        <FeaturesSection />
      </div>
      <div className="mt-10">
        <FeedBacks />
      </div>
      <div className="mt-12">
        <HowToUse />
      </div>
      <div className="mt-12">
        <Pricing />
      </div>
      <div className="mt-12">
        <Contact />
      </div>
    </div>
  );
}

export default Home;
