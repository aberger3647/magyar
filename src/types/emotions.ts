export type EmotionLeaf = {
  id: string;
  en: string;
  hu: string;
};

export type EmotionSecondary = EmotionLeaf & {
  tertiary: EmotionLeaf[];
};

export type EmotionCore = EmotionLeaf & {
  color: { base: string; light: string };
  secondary: EmotionSecondary[];
};

export type EmotionsData = {
  cores: EmotionCore[];
};

export function displayHungarian(hu: string, en: string): string {
  return hu.trim() || en;
}
