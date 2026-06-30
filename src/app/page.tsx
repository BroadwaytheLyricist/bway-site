import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import About from "@/components/sections/About";
import LatestVideos from "@/components/sections/LatestVideos";
import Featured from "@/components/sections/Featured";
import Playlists from "@/components/sections/Playlists";
import Press from "@/components/sections/Press";
import Follow from "@/components/sections/Follow";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <LatestVideos />
      <Featured />
      <Playlists />
      <Press />
      <Follow />
      <Contact />
    </>
  );
}
