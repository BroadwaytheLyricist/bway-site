export type PostSection = {
  heading?: string;
  paragraphs: string[];
};

export type Post = {
  slug: string;
  title: string;
  seoTitle?: string;
  dek: string;
  description: string;
  publishedAt: string;
  readTime: string;
  category: string;
  youtubeId?: string;
  thumbnail?: string;
  opening: string[];
  sections: PostSection[];
  closing: string;
};

export const posts: Post[] = [
  {
    slug: "where-is-canibus-now",
    title: "Canibus: The Complicated Legacy of a Lyricist's Lyricist",
    seoTitle: "Canibus vs LL Cool J: Where Is He Now?",
    dek: "He out-rapped legends on their own records, won the pen battle with LL Cool J, and still lost the war. Here's what really happened to Canibus.",
    description:
      "Canibus out-rapped legends, battled LL Cool J, then walked away to join the military. Where is Canibus now, and why is his legacy so complicated?",
    publishedAt: "2026-10-01",
    readTime: "5 min read",
    category: "Where Are They Now?",
    youtubeId: "jjXnjnQ_NH0",
    thumbnail: "/images/canibus-lyricists-lyricist.jpg",
    opening: [
      "Y'all remember Canibus?",
      "At one point, he was out-rapping legends on their own records. He was on one side of one of the most famous beefs in Hip-Hop history. And for a minute, the whole culture had him penciled in as the future of lyricism.",
      "So how does a story like that end with controversy, a disappearing act, and one of Hip-Hop's biggest \"what ifs\"?",
      "This isn't just a Canibus story. It's a lesson about the industry... and about who really gets to write the narrative.",
    ],
    sections: [
      {
        heading: "The Entrance Nobody Could Ignore",
        paragraphs: [
          "No underground buzz campaign. No slow build. Canibus showed up on elite features and forced the culture to pay attention.",
          "His verses were longer. More aggressive. More intellectual than almost anybody rapping at the time. On records like \"Desperados,\" \"Fantastic 4,\" and \"4, 3, 2, 1,\" he wasn't trying to blend in... he was trying to separate himself.",
          "In the late '90s, that mattered. Lyrical credibility still carried real weight. But when you make an entrance like that, the expectations come with it.",
        ],
      },
      {
        heading: "The Line That Started a War",
        paragraphs: [
          "\"4, 3, 2, 1\" should have been a career-defining moment for all the right reasons. Instead, it became a turning point for all the wrong ones.",
          "Canibus's line about borrowing LL Cool J's mic tattoo was meant as homage. LL took it as disrespect. Years later, on *The Joe Budden Podcast*, LL admitted his ego got in the way of how he received that line. And in Hip-Hop, intention doesn't matter nearly as much as perception.",
          "What followed wasn't a fair fight. It was a power imbalance. LL wasn't just another rapper. He was an institution.",
          "Canibus fired back with \"Second Round K.O.\" Technically sharp. Lyrically fearless. Unapologetic.",
          "But here's where the lesson starts: Canibus won the pen battle. LL won the narrative war. And in Hip-Hop, narratives outlast bars.",
        ],
      },
      {
        heading: "The Album That Couldn't Win",
        paragraphs: [
          "By the time his debut album *Can-I-Bus* dropped in 1998, the expectations were damn near impossible. Instead of cashing in on the moment, the album exposed cracks: production that didn't fully fit his style, hooks that struggled to land, and songs that felt more instructional than emotional.",
          "Canibus later claimed industry politics, including alleged sabotage, played a big role in how the album was handled. Whether you believe that or not, one thing is clear. Once the industry moves its energy away from you, the climb back is steep.",
        ],
      },
      {
        heading: "We've Been Asking the Wrong Question",
        paragraphs: [
          "Everybody asks whether Canibus could really rap. Wrong question. Nobody serious ever doubted the talent.",
          "The real question is whether Hip-Hop rewards skill without feeling.",
          "His verses were hyper-technical, concept-heavy, and packed with references. For lyric purists, that was heaven. For casual listeners, it was homework.",
          "Hip-Hop has always been about balancing skill and emotion. Canibus leaned so hard into the skill that the feeling sometimes got left behind. It didn't make the music bad. It made it niche. And in the mainstream business of that era, niche didn't sell.",
        ],
      },
      {
        heading: "Battle Rap, the Notepad, and the Optics",
        paragraphs: [
          "As mainstream support faded, Canibus moved into the spaces that still valued pure lyricism: battle rap and the underground. Sometimes it worked. Sometimes it backfired.",
          "The moment he pulled out a notepad mid-battle against Dizaster in 2012 became symbolic. Not of his skill, but of how unforgiving the culture gets once it decides you've fallen out of favor.",
          "At that point, the conversation stopped being about music. It became about optics. And the optics were brutal.",
        ],
      },
      {
        heading: "The Move That Shocked Everybody",
        paragraphs: [
          "Back up to around 2001 and 2002. Canibus stepped away from music entirely and enlisted in the U.S. military.",
          "Not for headlines. Not for a rollout. He wanted structure, identity, and distance from an industry he no longer trusted.",
          "That decision alone tells you how heavy the pressure had become. This wasn't someone chasing fame. This was someone trying to reset his life. Even *Rip the Jacker*, the 2003 album many fans call his strongest, with production from Stoupe of Jedi Mind Tricks, arrived while he was serving.",
        ],
      },
      {
        heading: "So Where Is Canibus Now?",
        paragraphs: [
          "The music didn't stop. One of my Instagram followers put me on to his 2021 album *Kaiju*, a technical marvel that honestly sounds like a screenplay for a sci-fi thriller.",
          "But his real footprint is the one people overlook. Canibus helped shape how rappers write. Battle rap. Underground lyricism. Complex rhyme structures. Even artists who sound nothing like him walked through doors he opened.",
          "Success isn't always measured in sales. Sometimes it's measured in impact without credit. And Canibus has plenty of that.",
          "His story forces three questions on the whole culture. Does Hip-Hop reward innovation or familiarity? Is being ahead of your time a blessing or a curse? And how many careers get rewritten by narrative instead of talent? That's not just a Canibus question. That's a Hip-Hop question.",
          "So I want to hear from you. Are you a Canibus fan? And what's the last Canibus album you actually sat with?",
        ],
      },
    ],
    closing: "These Are the Hip-Hop Conversations We Should Be Having.",
  },
  {
    slug: "tom-hardy-frankie-pulitzer-czarface",
    title: "Tom Hardy Was Rapping Before He Was Tom Hardy",
    seoTitle: "Tom Hardy, Frankie Pulitzer & Czarface",
    dek: "The worst-kept secret in Hip-Hop, the Tommy No. 1 tapes, and how Bane ended up on a Czarface album.",
    description:
      "Tom Hardy's teenage rap tapes, the Frankie Pulitzer mystery, and Czarface's collaboration bring a surprising Hip-Hop story into focus.",
    publishedAt: "2026-09-24",
    readTime: "6 min read",
    category: "Hip-Hop Story",
    youtubeId: "ewvHgIO3RGQ",
    thumbnail: "/images/tom-hardy-frankie-pulitzer-czarface.png",
    opening: [
      "Bane got bars.",
      "I know how that sounds. But stay with me, because Tom Hardy (Venom, Mad Max, the guy who broke Batman's back) didn't just wake up one day and decide he could rap. That's the story everybody's telling. It's the wrong one.",
      "The real story is that Tom Hardy was rapping before he was Tom Hardy. Before Bane. Before Venom. Before the Oscar nomination. This wasn't a celebrity side quest he picked up once he got famous. It's something he was chasing as a teenager, when nobody knew his name.",
    ],
    sections: [
      {
        heading: "Meet Tommy No. 1",
        paragraphs: [
          "Hardy has said he started rapping around 14 or 15. Back then he wasn't Frankie Pulitzer. He was Tommy No. 1. (I'll let you decide which name is better.)",
          "And Tommy No. 1 wasn't just freestyling in the schoolyard. In 1999 he recorded a whole project with his friend and producer Ed Tracy (who went by Eddie Too Tall) in Tracy's bedroom. Hardy wrote and performed the rhymes; Tracy made the beats. They called it *Falling on Your Arse in 1999*, and by Tracy's account, a record deal was actually on the table.",
          "Hardy went the acting route instead. Worked out okay for him.",
          "Then the tapes just… sat there. For almost two decades. Until 2018, when Eddie Too Tall finally put the recordings online. Eighteen tracks. And people started realizing the dude playing Bane and Venom had a whole rap history they knew nothing about.",
        ],
      },
      {
        heading: "And Here's the Thing: He's Not Bad",
        paragraphs: [
          "Like… at all.",
          "And I'm not grading him on the celebrity curve. You know the one. Where somebody famous steps outside their lane and everybody claps and goes \"wow, that's actually good!\" What they really mean is: \"that's good… for an actor.\"",
          "Nah. Listen back to that early stuff and you hear cadence. Flow. Timing. Most importantly, you hear somebody who actually listened to Hip-Hop. This wasn't a bored-celebrity hobby. Which makes everything that came next make a lot more sense.",
        ],
      },
      {
        heading: "Enter Frankie Pulitzer",
        paragraphs: [
          "At some point, Tommy No. 1 disappears… and Frankie Pulitzer shows up.",
          "Now, officially? Nobody has ever confirmed Frankie Pulitzer is Tom Hardy. It's never been stamped, verified, put on the record. But it's the worst-kept secret in Hip-Hop. The voice, the timing, the mask, the receipts all point one direction, and everybody in the culture already knows.",
          "And honestly, the anonymity is the most Hip-Hop part of the whole thing. Different name. Mask on, on some Ghostface type stuff. No \"look at me, I'm the actor who raps.\" He linked with Czarface (the supergroup of Inspectah Deck, Esoteric, and producer 7L) and quietly built an underground résumé while the rest of us just watched him make movies.",
        ],
      },
      {
        heading: "Czarface Meets Frankie Pulitzer",
        paragraphs: [
          "That brings us to 2026, and they went all the way with it.",
          "*Czarface Meets Frankie Pulitzer.* Fifteen tracks. A full collaborative album. And this isn't a novelty cameo buried at the end of one song. Frankie's rapping throughout. Look at the company he's keeping: Inspectah Deck, Method Man, Busta Rhymes, El-P.",
          "The record that sent me down this whole rabbit hole is \"Mad Technology.\" That's Method Man on the track. And Tom Hardy. On the same song. Say that sentence out loud and tell me it doesn't sound ridiculous.",
          "And because of course he did: on a track called \"Grim-Visaged War,\" Hardy brings the Bane voice back… to recite Shakespeare. Bane got bars. He took it literally.",
        ],
      },
      {
        heading: "So Here's What's Actually Crazy",
        paragraphs: [
          "I went in thinking the story was \"did y'all know Tom Hardy can rap?\"",
          "But the real story is that Tom Hardy was rapping before he was Tom Hardy. Hip-Hop wasn't the side quest. The acting almost was. Tommy No. 1 became Frankie Pulitzer, and Frankie Pulitzer ended up trading bars with Wu-Tang.",
          "So now that you know, I want to hear from you. Are you checking for the album? If you've already heard it, is Frankie Pulitzer legitimately nice, or are we grading Tom Hardy on the celebrity curve? And, completely unrelated… what's your favorite Tom Hardy movie?",
        ],
      },
    ],
    closing: "These Are the Hip-Hop Conversations We Should Be Having.",
  },
];

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function getLatestPost() {
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0];
}

export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
