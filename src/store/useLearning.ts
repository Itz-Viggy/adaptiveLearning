import { create } from "zustand";
import { persist } from "zustand/middleware";
import { topics, initialHistory } from "../services/mockData";
import type { Topic } from "../services/mockData";
import { scoreAssessment } from "../services/learning";
export const useStorageStatus = create<{ error: boolean }>(() => ({
  error: false,
}));
export type Result = ReturnType<typeof scoreAssessment> & {
  topicId: string;
  date: string;
  seconds: number;
  answers: Record<number, number>;
};
export type Preferences = {
  theme: "light" | "dark" | "system";
  speed: number;
  transcript: boolean;
  reducedMotion: boolean;
  contrast: boolean;
  largeText: boolean;
  distraction: boolean;
};
type State = {
  name: string;
  email: string;
  preferences: Preferences;
  positions: Record<string, number>;
  completed: string[];
  read: string[];
  markRead: (id: string) => void;
  answers: Record<string, Record<number, number>>;
  results: Record<string, Result>;
  history: typeof initialHistory;
  setIdentity: (name: string, email: string) => void;
  preference: <K extends keyof Preferences>(
    key: K,
    value: Preferences[K],
  ) => void;
  position: (id: string, time: number) => void;
  complete: (id: string) => void;
  answer: (id: string, index: number, value: number) => void;
  submit: (topic: Topic, seconds: number) => void;
  resetAnswers: (id: string) => void;
};
export const useLearning = create<State>()(
  persist(
    (set, get) => ({
      name: "Alex Morgan",
      email: "alex.morgan@university.edu",
      preferences: {
        theme: "light",
        speed: 1,
        transcript: false,
        reducedMotion: false,
        contrast: false,
        largeText: false,
        distraction: false,
      },
      positions: {},
      completed: ["foundations", "force-moment", "tooth-movement"],
      read: ["foundations", "force-moment", "tooth-movement"],
      markRead: (id) => set((s) => ({ read: [...new Set([...s.read, id])] })),
      answers: {},
      results: {},
      history: initialHistory,
      setIdentity: (name, email) => set({ name, email }),
      preference: (key, value) =>
        set((s) => ({ preferences: { ...s.preferences, [key]: value } })),
      position: (id, time) =>
        set((s) => ({ positions: { ...s.positions, [id]: time } })),
      complete: (id) =>
        set((s) => ({ completed: [...new Set([...s.completed, id])] })),
      answer: (id, index, value) =>
        set((s) => ({
          answers: { ...s.answers, [id]: { ...s.answers[id], [index]: value } },
        })),
      submit: (topic, seconds) => {
        const s = get();
        const result = {
          ...scoreAssessment(
            topic.questions,
            s.answers[topic.id] || {},
            s.results[topic.id]?.after ?? topic.mastery,
          ),
          topicId: topic.id,
          date: new Date().toISOString(),
          seconds,
          answers: { ...s.answers[topic.id] },
        };
        set({
          results: { ...s.results, [topic.id]: result },
          history: [...s.history, result],
        });
      },
      resetAnswers: (id) =>
        set((s) => ({ answers: { ...s.answers, [id]: {} } })),
    }),
    {
      name: "vector-learning-v1",
      storage: {
        getItem: (name) => {
          try {
            const data = localStorage.getItem(name);
            return data ? JSON.parse(data) : null;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
            if (useStorageStatus.getState().error)
              useStorageStatus.setState({ error: false });
          } catch {
            useStorageStatus.setState({ error: true });
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
);
export function useTopics() {
  const results = useLearning((s) => s.results);
  return topics.map(
    (t) =>
      ({
        ...t,
        mastery: results[t.id]?.after ?? t.mastery,
        state: results[t.id]
          ? results[t.id].ready
            ? "completed"
            : "review"
          : t.id === "clinical-integration" &&
              results["controlled-movement"]?.ready
            ? "available"
            : t.state,
      }) as Topic,
  );
}
