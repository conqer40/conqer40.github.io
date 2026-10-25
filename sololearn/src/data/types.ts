export type Sentence = {
  en: string;
  ar: string;
  // Path to a pre-generated TTS file. Falls back to browser speech when missing.
  audio?: string;
};

export type Level = "A1" | "A2" | "B1";

export type Lesson = {
  id: string;
  title: string;
  titleAr: string;
  level: Level;
  // Stories open in dictation mode by default.
  kind?: "lesson" | "story";
  sentences: Sentence[];
};
