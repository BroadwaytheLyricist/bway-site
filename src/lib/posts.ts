export type PostSection = {
  heading?: string;
  paragraphs: string[];
};

export type Post = {
  slug: string;
  title: string;
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
    slug: "tom-hardy-frankie-pulitzer-czarface",
    title: "Tom Hardy Was Rapping Before He Was Tom Hardy",
    dek: "The worst-kept secret in Hip-Hop, the Tommy No. 1 tapes, and how Bane ended up on a Czarface album.",
    description:
      "Long before Bane, Tom Hardy was a teenage rapper named Tommy No. 1. Now, as Frankie Pulitzer, he's dropped a full album with Czarface, and here's the whole story.",
    publishedAt: "2026-09-24",
    readTime: "6 min read",
    category: "Deep Dive",
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

export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
