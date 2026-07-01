import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import About from "@/components/sections/About";
import LatestVideos from "@/components/sections/LatestVideos";
import Playlists from "@/components/sections/Playlists";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <LatestVideos />
      <Playlists />
      <Contact />
    </>
  );
}
