export const BLOG_POSTS = [
  {
    id: 1,
    slug: "finding-magic-in-the-ordinary",
    title: "Finding Magic in the Ordinary",
    excerpt: "A short reflection on the everyday moments that spark wonder.",
    author: "Natalie Segal",
    date: "Oct 2, 2025",
    readTime: "4 min read",
    views: 1240,
    comments: 12,
    cover: "/imgs/stories.avif",
    category: "Reflections",
    content: [
      "Some days, the world announces itself in fireworks. Most days, it does not. Yet even on the quiet mornings, wonder is there if we choose to look—folded into the steam lifting from a cup of tea, hiding in the rhythm of footsteps on a familiar path.",
      "What we call ordinary is just the part of life we’ve stopped naming. A leaf is a small universe. A glance can be a chapter. The ritual of turning a doorknob is the door to a thousand possible rooms.",
      "Pay attention long enough and the mundane becomes mythic: keys become talismans, the kitchen is a theater, and your desk drawer—a reliquary of past selves. This is the practice: to see not what’s new, but what’s true.",
    ],
  },
  {
    id: 2,
    slug: "why-we-keep-reading-fantasy",
    title: "Why We Keep Reading Fantasy",
    excerpt: "Escapism, empathy, and the art of immersive worlds.",
    author: "Natalie Segal",
    date: "Sep 18, 2025",
    readTime: "6 min read",
    views: 2210,
    comments: 23,
    cover: "/imgs/more-stories.avif",
    category: "Essays",
    content: [
      "Fantasy doesn’t remove us from reality—it refracts it. Dragons and dark lords are masks for the questions we’re still brave enough to ask: What is courage? What is belonging? What do we owe each other when the road gets steep?",
      "We read to escape, yes, but also to return with something we didn’t have before: a new metaphor, a softened judgment, a story that says ‘keep going.’",
      "The best fantasy widens our empathy. It teaches that every tavern has its own map, that every quest is a way of seeing.",
    ],
  },
  {
    id: 3,
    slug: "haiku-as-a-daily-practice",
    title: "Haiku as a Daily Practice",
    excerpt: "Small poems, big attention. Notes from a week of writing haiku.",
    author: "Natalie Segal",
    date: "Sep 3, 2025",
    readTime: "3 min read",
    views: 980,
    comments: 7,
    cover: "/imgs/about.avif",
    category: "Practice",
    content: [
      "Haiku is a microscope for the present moment. It demands that you stand still long enough for the world to arrive.",
      "Seventeen syllables is a doorway, not a rule. Step through and you’ll find that the smallest poems make the loudest echoes.",
      "Try just one a day: a breath, a line, a noticing. It might just rewire how you see.",
    ],
  },
];

export function getPostBySlug(slug) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllPostSlugs() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}
