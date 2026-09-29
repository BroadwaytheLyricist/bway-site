import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import About from "@/components/sections/About";
import LatestVideos from "@/components/sections/LatestVideos";
import LatestBlog from "@/components/sections/LatestBlog";
import Music from "@/components/sections/Music";
import Contact from "@/components/sections/Contact";
import AnchorLanding from "@/components/AnchorLanding";

export default function Home() {
  return (
    <>
      <AnchorLanding />
      <Hero />
      <Marquee />
      <About />
      <LatestVideos />
      <LatestBlog />
      <Music />
      <Contact />
    </>
  );
}
