// src/data/journalData.js
import journal1 from "../assets/journal1.jpg";
import journal2 from "../assets/journal2.jpg";
import journal3 from "../assets/journal3.jpg";

export const ARTICLES = [
  {
    id: "discovery-set-experience",
    title: "The Discovery Set Experience",
    subtitle: "An Intimate Exploration Of Identity Through Olfactive Contrast",
    category: "Collections",
    date: "July 2026",
    readTime: "4 min read",
    excerpt:
      "An intimate introduction to fragrance. Explore multiple scents and find the one that becomes uniquely yours.",
    heroImage: journal1,
    secondaryImage: journal2,
    quote:
      "The perfect fragrance is not selected in a fleeting moment—it is discovered over time as it breathes on your skin.",
    quoteAuthor: "Julian Vance, Master Perfumer",
    contentBlocks: [
      {
        type: "paragraph",
        text: "A discovery set is more than a collection of samples—it is an invitation to explore identity through scent. Each vial reveals a different mood, a different story, and a different expression of self.",
      },
      {
        type: "heading",
        text: "Living With Scent",
      },
      {
        type: "paragraph",
        text: "At AVERNUS, we design discovery experiences to guide you through contrasts: fresh and deep, soft and intense, familiar and unexpected. Rather than choosing a fragrance instantly, you live with each scent, allowing it to evolve with your skin, your environment, and your emotions.",
      },
      {
        type: "paragraph",
        text: "Allow each composition space and time to unfold fully across top, heart, and base notes over the course of a day.",
      },
    ],
  },
  {
    id: "scent-on-skin",
    title: "Scent On Skin",
    subtitle: "The Intimate Chemistry Between Body & Botanical Alchemy",
    category: "Essentials",
    date: "June 2026",
    readTime: "5 min read",
    excerpt:
      "Fragrance is not worn—it becomes part of you. Discover how scent transforms when it meets the skin.",
    heroImage: journal2,
    secondaryImage: journal3,
    quote:
      "Fragrance is living art; skin chemistry is the canvas upon which it expresses its true character.",
    quoteAuthor: "Marcus Chen, In-House Nose",
    contentBlocks: [
      {
        type: "paragraph",
        text: "No fragrance smells the same on two individuals. Skin chemistry, temperature, and even lifestyle influence how a scent develops throughout the day.",
      },
      {
        type: "heading",
        text: "The Evolution Of Pulse Points",
      },
      {
        type: "paragraph",
        text: "What begins as a bright top note may soften into warmth, while deeper accords emerge gradually, creating a signature that is entirely personal. This transformation is what makes fragrance so intimate.",
      },
      {
        type: "paragraph",
        text: "To experience a scent fully, apply it to pulse points and allow it time. Do not rush the process—true fragrance reveals itself slowly.",
      },
    ],
  },
  {
    id: "art-of-sampling",
    title: "The Art Of Sampling",
    subtitle: "Preserving Olfactive Integrity In Miniature Form",
    category: "Craft",
    date: "May 2026",
    readTime: "3 min read",
    excerpt:
      "Every sample tells a story. A closer look at how fragrance houses present their creations in miniature form.",
    heroImage: journal3,
    secondaryImage: journal1,
    quote:
      "Sampling invites you to slow down, explore, and appreciate fragrance as an art form rather than a simple product.",
    quoteAuthor: "Elena Rostova, Design Director",
    contentBlocks: [
      {
        type: "paragraph",
        text: "Sampling is the first dialogue between a fragrance and its wearer. It is where curiosity begins and connection is formed.",
      },
      {
        type: "heading",
        text: "Intentional Design",
      },
      {
        type: "paragraph",
        text: "From carefully designed cards to miniature vials, each format is created to preserve the integrity of the scent while offering a moment of discovery. The presentation itself reflects the philosophy of the house—minimal, expressive, and intentional.",
      },
      {
        type: "paragraph",
        text: "In a world of endless choices, sampling allows you to slow down, explore, and appreciate fragrance as an art rather than a product.",
      },
    ],
  },
];