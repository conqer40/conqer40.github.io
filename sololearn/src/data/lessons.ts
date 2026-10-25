import { a1Lessons } from "@/data/content/a1";
import { a1MoreLessons } from "@/data/content/a1-more";
import { a2Lessons } from "@/data/content/a2";
import { a2MoreLessons } from "@/data/content/a2-more";
import { b1Lessons } from "@/data/content/b1";
import { b1MoreLessons } from "@/data/content/b1-more";
import { storyLessons } from "@/data/content/stories";
import { storiesMore } from "@/data/content/stories-more";
import { a1Batch2 } from "@/data/content/a1-batch2";
import { a2Batch2 } from "@/data/content/a2-batch2";
import { b1Batch2 } from "@/data/content/b1-batch2";
import { storiesBatch2 } from "@/data/content/stories-batch2";
import { a1Batch3 } from "@/data/content/a1-batch3";
import { a2Batch3 } from "@/data/content/a2-batch3";
import { b1Batch3 } from "@/data/content/b1-batch3";
import type { Lesson } from "@/data/types";

export type { Lesson, Sentence, Level } from "@/data/types";

// Original sample content. Every lesson should be reviewed by a person before it goes live.
export const lessons: Lesson[] = [
  ...a1Lessons,
  ...a1MoreLessons,
  ...a2Lessons,
  ...a2MoreLessons,
  ...b1Lessons,
  ...b1MoreLessons,
  ...storyLessons,
  ...storiesMore,
  ...a1Batch2,
  ...a2Batch2,
  ...b1Batch2,
  ...storiesBatch2,
  ...a1Batch3,
  ...a2Batch3,
  ...b1Batch3,
];

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}
