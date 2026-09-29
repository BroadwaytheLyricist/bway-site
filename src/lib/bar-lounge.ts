/** Only add audioSrc for audio the site is permitted to host. */
export type BarLoungeRound = {
  id: string;
  title: string;
  intro: string;
  question: string;
  articleSlug: string;
  sourceLabel: string;
  status: "open" | "closed";
  audioSrc?: string;
};

/** The first Bar Lounge round is grounded in an existing, published article. */
export const barLoungeRounds: BarLoungeRound[] = [
  {
    id: "tom-hardy-tapes",
    title: "Who brought the tapes back?",
    intro: "Tom Hardy's teenage recordings resurfaced years before the Czarface collaboration. The name of the person who put them back into the conversation is in Broadway's story.",
    question: "Who released the Tommy No. 1 recordings online in 2018?",
    articleSlug: "tom-hardy-frankie-pulitzer-czarface",
    sourceLabel: "Read the story",
    status: "open",
  },
];

export function getBarLoungeRound(id: string) {
  return barLoungeRounds.find((round) => round.id === id);
}
