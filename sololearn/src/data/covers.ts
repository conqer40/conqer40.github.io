// Story covers: one scene per story, drawn as an emoji on a soft colour.
export type Cover = { scene: string; bg: string };

export const storyCovers: Record<string, Cover> = {
  "story-the-lost-key": { scene: "🔑", bg: "#FDE68A" },
  "story-the-rainy-picnic": { scene: "🧺", bg: "#BFDBFE" },
  "story-the-new-bike": { scene: "🚲", bg: "#A7F3D0" },
  "story-the-surprise-letter": { scene: "✉️", bg: "#FBCFE8" },
  "story-the-broken-phone": { scene: "📱", bg: "#E5E7EB" },
  "story-the-night-train": { scene: "🚆", bg: "#C7D2FE" },
  "story-the-garden": { scene: "🌱", bg: "#BBF7D0" },
  "story-the-little-boat": { scene: "⛵", bg: "#BAE6FD" },
  "story-the-market-day": { scene: "🥖", bg: "#FED7AA" },
  "story-the-lighthouse": { scene: "🗼", bg: "#FEF3C7" },
  "story-the-debate": { scene: "🎤", bg: "#DDD6FE" },
  "story-the-old-photo": { scene: "📷", bg: "#FDE68A" },
  "story-the-messages": { scene: "💬", bg: "#BFDBFE" },
  "story-the-volunteer": { scene: "🤝", bg: "#FECACA" },
  "story-the-snowman": { scene: "⛄", bg: "#E0F2FE" },
  "story-the-new-student": { scene: "🎒", bg: "#FDE68A" },
  "story-the-broken-clock": { scene: "🕰️", bg: "#E7E5E4" },
  "story-the-camping-trip": { scene: "⛺", bg: "#D9F99D" },
  "story-the-stranger-at-the-cafe": { scene: "☕", bg: "#FED7AA" },
  "story-the-final-exam": { scene: "📝", bg: "#C7D2FE" },
};
