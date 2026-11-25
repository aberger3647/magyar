import { useForm, useStore } from "@tanstack/react-form";
import { Checkbox } from "@/components/ui/checkbox";
import conjugations from "../assets/conjugations.json";
import { useLocalStorage } from "@/lib/useLocalStorage";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { PageTitle } from "./PageTitle";
import { setRandomWord } from "@/lib/setRandomWord";
import { hasConjugationForm } from "@/lib/conjugatorQuiz";
import type { TenseType, VoiceType } from "@/types/types";

type QuizPreferences = {
  tense: TenseType;
  voice: VoiceType;
};

const DEFAULT_QUIZ_PREFERENCES = {
  tense: "present",
  voice: "indefinite",
} satisfies QuizPreferences;

const isQuizPreferences = (value: unknown): value is QuizPreferences => {
  if (typeof value !== "object" || value === null) return false;
  if (!("tense" in value) || !("voice" in value)) return false;

  return (
    (value.tense === "present" || value.tense === "past") &&
    (value.voice === "indefinite" || value.voice === "definite")
  );
};

export const QuizPrefsForm = () => {
  const navigate = useNavigate();
  const allWords = conjugations.map((conjugation) => conjugation.lemma);
  const [selectedWords, setSelectedWords] = useLocalStorage<string[]>(
    "quizWords",
    allWords
  );
  const [storedQuizPreferences, setStoredQuizPreferences] =
    useLocalStorage<unknown>("quizPreferences", DEFAULT_QUIZ_PREFERENCES);
  const [, setStoredWord] = useLocalStorage<string | null>("randomWord", null);
  const quizPreferences = isQuizPreferences(storedQuizPreferences)
    ? storedQuizPreferences
    : DEFAULT_QUIZ_PREFERENCES;

  const toggleWord = (word: string, checked: boolean) => {
    if (checked) {
      if (selectedWords.includes(word)) return;
      setSelectedWords([...selectedWords, word]);
      return;
    }
    setSelectedWords(
      selectedWords.filter((existingWord) => existingWord !== word)
    );
  };

  const form = useForm({
    defaultValues: quizPreferences,
    onSubmit: async ({ value: quizPrefs }) => {
      setStoredQuizPreferences(quizPrefs);
      navigate(`/conjugator/${quizPrefs.tense}/${quizPrefs.voice}`);
    },
  });

  const FormField = form.Field;
  const { tense: currentTense, voice: currentVoice } = useStore(
    form.store,
    (state) => state.values
  );
  const unavailableWords = new Set(
    conjugations
      .filter(
        (conjugation) =>
          !hasConjugationForm(conjugation, currentTense, currentVoice)
      )
      .map((conjugation) => conjugation.lemma)
  );
  const availableSelectedCount = selectedWords.filter(
    (word) => !unavailableWords.has(word)
  ).length;
  const startRandomQuiz = () => {
    const tense = form.getFieldValue("tense");
    const voice = form.getFieldValue("voice");
    if (!tense || !voice) return;

    sessionStorage.removeItem("completedQuizWords");
    setRandomWord({
      words: conjugations.filter((conjugation) =>
        hasConjugationForm(conjugation, tense, voice)
      ),
      setStoredWord,
    });
    navigate(`/conjugator/${tense}/${voice}?mode=random`);
  };

  return (
    <>
      <PageTitle title="Conjugator Quiz" />
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Choose Quiz Preferences</CardTitle>
          <CardDescription>
            Choose a tense and voice, then use your word bank or get one random
            word.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col items-center justify-center w-full max-w-md gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              form.setErrorMap({
                onSubmit: {
                  fields: {},
                },
              });

              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <FieldSet>
                <FieldLegend variant="label">Tense</FieldLegend>
                <FieldGroup className="gap-2">
                  <FormField
                    name="tense"
                    children={(field) => (
                      <div className="flex flex-col gap-2">
                        {(["present", "past"] as const).map((option) => (
                          <Field key={option} orientation="horizontal" className="min-h-7">
                            <input
                              type="radio"
                              id={`tense-${option}`}
                              name="tense"
                              value={option}
                              checked={field.state.value === option}
                              onChange={() => {
                                field.handleChange(option);
                                setStoredQuizPreferences({
                                  ...quizPreferences,
                                  tense: option,
                                });
                              }}
                              onBlur={field.handleBlur}
                              className="size-4 shrink-0 cursor-pointer accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                            />
                            <FieldLabel
                              htmlFor={`tense-${option}`}
                              className="cursor-pointer py-1 font-normal capitalize"
                            >
                              {option}
                            </FieldLabel>
                          </Field>
                        ))}
                      </div>
                    )}
                  />
                </FieldGroup>
              </FieldSet>
              <FieldSeparator />
              <FieldGroup>
                <FieldSet>
                  <FieldLegend variant="label">Voice</FieldLegend>
                  <FieldGroup className="gap-2">
                    <FormField
                      name="voice"
                      children={(field) => (
                        <div className="flex flex-col gap-2">
                          {(["indefinite", "definite"] as const).map((option) => (
                            <Field key={option} orientation="horizontal" className="min-h-7">
                              <input
                                type="radio"
                                id={`voice-${option}`}
                                name="voice"
                                value={option}
                                checked={field.state.value === option}
                                onChange={() => {
                                  field.handleChange(option);
                                  setStoredQuizPreferences({
                                    ...quizPreferences,
                                    voice: option,
                                  });
                                }}
                                onBlur={field.handleBlur}
                                className="size-4 shrink-0 cursor-pointer accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                              />
                              <FieldLabel
                                htmlFor={`voice-${option}`}
                                className="cursor-pointer py-1 font-normal capitalize"
                              >
                                {option}
                              </FieldLabel>
                            </Field>
                          ))}
                        </div>
                      )}
                    />
                  </FieldGroup>
                </FieldSet>
              </FieldGroup>
              <FieldSeparator />
              <FieldSet className="w-full">
                <FieldLegend variant="label">Words</FieldLegend>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="tabular-nums">{availableSelectedCount} selected</span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedWords(allWords)}
                    >
                      Select all
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedWords([])}
                    >
                      Clear all
                    </Button>
                  </div>
                </div>
                <div className="max-h-48 space-y-1 overflow-y-auto overscroll-contain rounded-md border border-input p-3">
                  {allWords.map((word) => {
                    const unavailable = unavailableWords.has(word);
                    return (
                      <Field
                        key={word}
                        orientation="horizontal"
                        className={unavailable ? "min-h-7 opacity-50" : "min-h-7"}
                      >
                        <Checkbox
                          id={`word-${word}`}
                          checked={selectedWords.includes(word)}
                          disabled={unavailable}
                          onCheckedChange={(checked) =>
                            toggleWord(word, !!checked)
                          }
                        />
                        <FieldLabel
                          htmlFor={`word-${word}`}
                          className="cursor-pointer py-0.5 font-normal"
                        >
                          <span lang="hu">{word}</span>
                          {unavailable && " (no definite form)"}
                        </FieldLabel>
                      </Field>
                    );
                  })}
                </div>
                {availableSelectedCount === 0 && (
                  <p id="quiz-words-help" className="mt-2 text-sm text-muted-foreground">
                    Select at least one available word to start a quiz.
                  </p>
                )}
              </FieldSet>
            </FieldGroup>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Button
                disabled={availableSelectedCount === 0}
                aria-describedby={
                  availableSelectedCount === 0 ? "quiz-words-help" : undefined
                }
              >
                Start Quiz
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={startRandomQuiz}
              >
                Random Word
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};
