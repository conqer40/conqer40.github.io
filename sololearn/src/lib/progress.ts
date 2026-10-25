// Progress is always saved in this browser. When signed in, it is also saved to Supabase.
import { supabase } from "@/lib/supabase";

export type Progress = {
  name: string;
  // Lesson id -> best accuracy (0-100) on that lesson.
  completed: Record<string, number>;
};

const STORAGE_KEY = "sololearn:progress";
const EMPTY: Progress = { name: "", completed: {} };

export function loadProgress(): Progress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function saveProgress(progress: Progress) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage can be blocked (private mode). The lesson still works without saving.
  }
}

export function markComplete(lessonId: string, accuracy: number) {
  const current = loadProgress();
  const best = Math.max(accuracy, current.completed[lessonId] ?? 0);
  saveProgress({ ...current, completed: { ...current.completed, [lessonId]: best } });
  void syncLesson(lessonId, best);
}

// Saves one lesson to Supabase if someone is signed in. Local progress is always saved first.
async function syncLesson(lessonId: string, best: number) {
  if (!supabase) return;
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;
  await supabase.from("lesson_progress").upsert(
    {
      user_id: data.user.id,
      lesson_id: lessonId,
      best_accuracy: best,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" },
  );
}
