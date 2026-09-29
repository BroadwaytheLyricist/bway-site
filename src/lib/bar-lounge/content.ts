import "server-only";
import type { Mystery, Question, Reveal } from "./types";

type Entry = Question & { answer: string; reveal: Reveal };
type MysteryEntry = Mystery & { answers: string[]; reveal: Reveal };
const sources = {
  albums: { sourceUrl: "https://shop.rockhall.com/products/ode-to-hip-hop-50-albums-that-define-50-years-of-trailblazing-music-hardcover-book", sourceLabel: "Rock Hall: Ode to Hip-Hop" },
  tribe: { sourceUrl: "https://rockhall.com/inductees/a-tribe-called-quest/", sourceLabel: "Rock & Roll Hall of Fame" },
  outkast: { sourceUrl: "https://rockhall.com/inductees/outkast/", sourceLabel: "Rock & Roll Hall of Fame" },
  enemy: { sourceUrl: "https://rockhall.com/inductees/public-enemy/", sourceLabel: "Rock & Roll Hall of Fame" },
  missy: { sourceUrl: "https://rockhall.com/inductees/missy-elliott/", sourceLabel: "Rock & Roll Hall of Fame" },
  doom: { sourceUrl: "https://www.stonesthrow.com/news/mf-doom/", sourceLabel: "Stones Throw Records" },
  rtj: { sourceUrl: "https://runthejewels.com/pages/about-us-long-form", sourceLabel: "Run the Jewels: official biography" },
  broadway: { sourceUrl: "https://broadwaythelyricist.bandcamp.com/album/superstar-status-mixtape", sourceLabel: "Broadway's Bandcamp" },
};

function knowledge(id: string, topic: string, prompt: string, answer: string, wrong: string[], difficulty: number, source: keyof typeof sources, context: string, image?: string): Entry {
  return { id, topic, kind: "knowledge", prompt, answer, options: [answer, ...wrong], difficulty, reveal: { title: answer, context, image, ...sources[source] } };
}

// Editorial seed bank: source-backed facts and explicitly original demo bars.
// New entries require an exact answer, source, difficulty and approved artwork.
// Do not publish scraped or generated artist lyrics without editorial approval.
export const QUESTION_BANK: Entry[] = [
  knowledge("nas-illmatic", "nas", "In which year was Illmatic released?", "1994", ["1992", "1993", "1996"], 1, "albums", "Nas's debut album arrived in 1994."),
  knowledge("big-ready", "big", "Who released Ready to Die?", "The Notorious B.I.G.", ["Nas", "2Pac", "Scarface"], 1, "albums", "Ready to Die is The Notorious B.I.G.'s 1994 debut."),
  knowledge("scarface-diary", "scarface", "Which 1994 album belongs to Scarface?", "The Diary", ["The Chronic", "Hard Core", "Funkdafied"], 2, "albums", "The Diary was released by Scarface in 1994."),
  knowledge("clipse-lord", "clipse", "Which duo released Lord Willin'?", "Clipse", ["UGK", "Mobb Deep", "8Ball & MJG"], 2, "albums", "Clipse released Lord Willin' in 2002."),
  knowledge("roots-things", "roots", "Who released Things Fall Apart?", "The Roots", ["De La Soul", "The Pharcyde", "A Tribe Called Quest"], 2, "albums", "The Roots released Things Fall Apart in 1999."),
  knowledge("dmx-debut", "dmx", "Which album was released by DMX in 1998?", "It's Dark and Hell Is Hot", ["The Blueprint", "The Diary", "The College Dropout"], 1, "albums", "It's Dark and Hell Is Hot was released in 1998."),
  knowledge("tribe-scenario", "tribe", "Which Tribe album includes Scenario?", "The Low End Theory", ["Midnight Marauders", "Beats, Rhymes and Life", "The Love Movement"], 2, "tribe", "Scenario appears on The Low End Theory (1991)."),
  knowledge("tribe-bonita", "tribe", "Bonita Applebum appears on which album?", "People's Instinctive Travels and the Paths of Rhythm", ["Midnight Marauders", "The Low End Theory", "The Love Movement"], 3, "tribe", "Bonita Applebum appears on Tribe's 1990 debut."),
  knowledge("tribe-collective", "tribe", "Which collective is associated with A Tribe Called Quest?", "Native Tongues", ["Dungeon Family", "D.I.T.C.", "Juice Crew"], 2, "tribe", "Tribe was part of the Native Tongues collective."),
  knowledge("outkast-duo", "outkast", "André 3000 forms OutKast with whom?", "Big Boi", ["CeeLo Green", "Killer Mike", "Sleepy Brown"], 1, "outkast", "André 3000 and Big Boi are OutKast."),
  knowledge("outkast-city", "outkast", "Which city is central to OutKast's story?", "Atlanta", ["Houston", "Memphis", "Miami"], 1, "outkast", "OutKast emerged from Atlanta's Hip-Hop scene."),
  knowledge("outkast-elevators", "outkast", "Which OutKast album includes Elevators (Me & You)?", "ATLiens", ["Stankonia", "Aquemini", "Idlewild"], 2, "outkast", "Elevators (Me & You) appears on ATLiens."),
  knowledge("enemy-member", "enemy", "Which MC is a member of Public Enemy?", "Chuck D", ["KRS-One", "Rakim", "Kool G Rap"], 1, "enemy", "Chuck D is a founding voice of Public Enemy."),
  knowledge("enemy-dj", "enemy", "Which DJ is listed among Public Enemy's Rock Hall inductees?", "Terminator X", ["DJ Premier", "DJ Jazzy Jeff", "Jam Master Jay"], 3, "enemy", "Terminator X was inducted with Public Enemy."),
  knowledge("enemy-induction", "enemy", "Who helped induct Public Enemy into the Rock Hall?", "Spike Lee and Harry Belafonte", ["Nas and Jay-Z", "Ice Cube and Dr. Dre", "Eminem and Elton John"], 4, "enemy", "Spike Lee and Harry Belafonte inducted Public Enemy in 2013."),
  knowledge("missy-rain", "missy", "Who released The Rain (Supa Dupa Fly)?", "Missy Elliott", ["Da Brat", "MC Lyte", "Queen Latifah"], 1, "missy", "The Rain (Supa Dupa Fly) was Missy Elliott's debut solo single."),
  knowledge("missy-headgear", "missy", "Which artist wore an inflatable jumpsuit in The Rain video?", "Missy Elliott", ["Lil' Kim", "Eve", "Foxy Brown"], 2, "missy", "The inflatable look became one of Missy's signature video images."),
  knowledge("doom-partner", "madvillain", "Madvillain pairs MF DOOM with which producer?", "Madlib", ["J Dilla", "DJ Premier", "Pete Rock"], 2, "doom", "MF DOOM and Madlib collaborated as Madvillain."),
  knowledge("doom-release", "madvillain", "In which year did Madvillainy arrive?", "2004", ["2001", "2003", "2006"], 3, "doom", "Madvillainy was released on March 23, 2004."),
  knowledge("doom-label", "madvillain", "Which label released Madvillainy?", "Stones Throw", ["Definitive Jux", "Rawkus", "Rhymesayers"], 3, "doom", "Stones Throw released Madvillainy."),
  knowledge("rtj-partner", "rtj", "Run the Jewels pairs Killer Mike with whom?", "El-P", ["Big Boi", "Havoc", "Aesop Rock"], 1, "rtj", "Killer Mike and El-P formed Run the Jewels."),
  knowledge("rtj-company", "rtj", "Which group was El-P part of before Run the Jewels?", "Company Flow", ["Cannibal Ox", "Black Star", "Juggaknots"], 3, "rtj", "El-P made his mark with Company Flow before RTJ."),
  knowledge("rtj-jux", "rtj", "Which independent label did El-P establish?", "Definitive Jux", ["Stones Throw", "Duck Down", "Rhymesayers"], 3, "rtj", "El-P built an underground roster at Definitive Jux."),
  knowledge("btl-first", "btl", "Which project was Broadway's first recorded mixtape?", "Superstar Status", ["Off Broadway", "Superstar Status 2", "American Musical"], 2, "broadway", "Superstar Status was originally released in 2003.", "/images/music-covers/superstar-status.jpg"),
  knowledge("btl-host", "btl", "Who hosted Broadway's Superstar Status mixtape?", "DJ Spinatik", ["DJ Drama", "DJ Green Lantern", "DJ Whoo Kid"], 4, "broadway", "DJ Spinatik hosted the mixtape and recorded additional Tampa freestyles.", "/images/music-covers/superstar-status.jpg"),
  knowledge("btl-ep", "btl-ep", "Which EP is featured in Broadway's site player?", "Off Broadway", ["Superstar Status", "American Musical", "God Is the Only GOAT"], 1, "broadway", "The site features Off Broadway EP (Unmastered) Deluxe Edition.", "/images/music-covers/off-broadway.jpg"),
  knowledge("btl-freestyle", "btl", "Brody's Like is Broadway's freestyle over which track?", "Nas Is Like", ["Nas Is Coming", "Made You Look", "One Mic"], 3, "broadway", "The Superstar Status track list identifies Brody's Like as a Nas Is Like freestyle.", "/images/music-covers/superstar-status.jpg"),
  ...[
    ["block", "From the corner to the stage, I brought the whole ___", "block", "show", "crew", "beat"],
    ["pen", "Before I touched the mic, I sharpened up my ___", "pen", "chain", "crown", "lens"],
    ["page", "They tried to close the book; I turned another ___", "page", "door", "clock", "light"],
    ["roots", "The branches reach the sky, but I remember my ___", "roots", "boots", "crew", "name"],
    ["voice", "They gave me all the noise; I gave the room a ___", "voice", "price", "seat", "frame"],
    ["time", "I never chased the clock; I learned to own my ___", "time", "line", "sign", "rhyme"],
  ].map(([id, prompt, answer, ...wrong], i): Entry => ({ id: `original-${id}`, topic: "original-bars", kind: "finish_bar", prompt, options: [answer, ...wrong], answer, difficulty: 1 + i % 3, sample: true, reveal: { title: answer, context: "Original practice line written for this game. This is not a quote from a released song." } })),
];

export const MYSTERIES: MysteryEntry[] = [
  { id: "mystery-madvillain", category: "Name the Duo", answers: ["Madvillain"], clues: ["A collaboration with one acclaimed studio album at its center.", "One member is an MC; the other is a producer.", "The label is Stones Throw.", "Their album arrived in March 2004.", "MF DOOM and Madlib share this group name."], reveal: { title: "Madvillain", context: "The duo released Madvillainy in 2004.", ...sources.doom } },
  { id: "mystery-rtj", category: "Name the Duo", answers: ["Run the Jewels", "RTJ"], clues: ["Two established solo artists became a duo.", "One is from Brooklyn; the other from Atlanta.", "One member previously belonged to Company Flow.", "Their album covers feature a pistol-and-fist gesture.", "Killer Mike and El-P are the members."], reveal: { title: "Run the Jewels", context: "Killer Mike and El-P combined their solo histories into RTJ.", ...sources.rtj } },
  { id: "mystery-tribe", category: "Name the Group", answers: ["A Tribe Called Quest", "Tribe Called Quest", "ATCQ"], clues: ["This group helped widen the palette of New York rap.", "Jazz and soul samples are central to its sound.", "The group belongs to the Native Tongues story.", "Scenario appears on its second album.", "Q-Tip and Phife Dawg are two of its voices."], reveal: { title: "A Tribe Called Quest", context: "Tribe brought a distinctive jazz-and-soul approach to Hip-Hop.", ...sources.tribe } },
  { id: "mystery-outkast", category: "Name the Duo", answers: ["OutKast", "Outkast"], clues: ["A Southern duo with a constantly changing sound.", "Its hometown is Atlanta.", "Its catalog includes ATLiens.", "It released Speakerboxxx/The Love Below.", "The members are André 3000 and Big Boi."], reveal: { title: "OutKast", context: "André 3000 and Big Boi expanded Atlanta's musical vocabulary.", ...sources.outkast } },
  { id: "mystery-enemy", category: "Name the Group", answers: ["Public Enemy", "PE"], clues: ["Politics is central to this group's identity.", "Its members entered the Rock Hall in 2013.", "Spike Lee helped induct it.", "Its lineup includes Terminator X and Flavor Flav.", "Chuck D is its lead voice."], reveal: { title: "Public Enemy", context: "Public Enemy brought political urgency into its sound and image.", ...sources.enemy } },
  { id: "mystery-broadway", category: "Name the Mixtape", answers: ["Superstar Status"], clues: ["An early chapter in Broadway's music story.", "First recorded in a homemade Brooklyn studio.", "Additional freestyles were recorded in Tampa.", "It was originally released in 2003.", "DJ Spinatik hosted this mixtape; a second edition followed."], reveal: { title: "Superstar Status", context: "Broadway's first mixtape, hosted by DJ Spinatik.", image: "/images/music-covers/superstar-status.jpg", ...sources.broadway } },
];

export const DAILY_WORDS = [
  { answer: "VINYL", clue: "The format DJs still dig through crates for." },
  { answer: "BREAK", clue: "A drum passage that can become a B-boy's moment." },
  { answer: "RHYME", clue: "Matching sounds at the heart of a bar." },
  { answer: "VERSE", clue: "A section where an MC tells the story." },
  { answer: "CRATE", clue: "A record collector might dig through one." },
  { answer: "BEATS", clue: "The instrumentals underneath the rhymes." },
  { answer: "TRACK", clue: "One selection on an album." },
  { answer: "MIXER", clue: "The controls sitting between a DJ's decks." },
  { answer: "STAGE", clue: "Where the live performance meets the crowd." },
  { answer: "VOICE", clue: "The MC's first instrument." },
  { answer: "SNARE", clue: "A drum sound that often marks the backbeat." },
  { answer: "AUDIO", clue: "The sound side of a recording." },
];
