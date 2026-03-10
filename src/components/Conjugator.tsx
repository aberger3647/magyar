import conjugations from "../assets/conjugations.json";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import type { VerbConjugation } from "../types/verbConjugation";
import type { Pronouns } from "../types/pronouns";
import type { VoiceType } from "../types/types";
import type { TenseType } from "../types/types";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "./ui/badge";
import { CircleCheck, CircleX } from "lucide-react";
import { setRandomWord } from "../lib/setRandomWord";
import { useMemo, useRef, useState } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { AccentedLetters } from "./AccentedLetters";

const COMPLETED_WORDS_SESSION_KEY = "completedQuizWords";
const PRONOUN_KEYS = ["én", "te", "ő", "mi", "ti", "ők"] as const;
type PronounKey = (typeof PRONOUN_KEYS)[number];

const formSchema = z.object({
  én: z.string().nonempty("This field is required"),
  te: z.string().nonempty("This field is required"),
  ő: z.string().nonempty("This field is required"),
  mi: z.string().nonempty("This field is required"),
  ti: z.string().nonempty("This field is required"),
  ők: z.string().nonempty("This field is required"),
});

export const Conjugator = () => {
  const navigate = useNavigate();
  const [storedWord, setStoredWord] = useLocalStorage<string | null>(
    "randomWord",
    null
  );
  const [selectedWords] = useLocalStorage<string[]>("quizWords", []);
  const [completedWords, setCompletedWords] = useState<string[]>(() => {
    const rawValue = sessionStorage.getItem(COMPLETED_WORDS_SESSION_KEY);
    if (!rawValue) return [];
    try {
      const parsed = JSON.parse(rawValue);
      return Array.isArray(parsed)
        ? parsed.filter((word): word is string => typeof word === "string")
        : [];
    } catch {
      return [];
    }
  });
  const markWordAsCompleted = (word: string) => {
    setCompletedWords((prev) => {
      if (prev.includes(word)) return prev;
      const next = [...prev, word];
      sessionStorage.setItem(COMPLETED_WORDS_SESSION_KEY, JSON.stringify(next));
      return next;
    });
  };
  const selectedConjugations = useMemo(() => {
    if (selectedWords.length === 0) return conjugations;
    const selectedWordSet = new Set(selectedWords);
    return conjugations.filter((conjugation) =>
      selectedWordSet.has(conjugation.lemma)
    );
  }, [selectedWords]);
  const completedWordSet = useMemo(
    () => new Set(completedWords),
    [completedWords]
  );
  const availableConjugations = useMemo(
    () =>
      selectedConjugations.filter(
        (conjugation) => !completedWordSet.has(conjugation.lemma)
      ),
    [selectedConjugations, completedWordSet]
  );
  const totalQuizWords = selectedConjugations.length;
  const completedQuizWordsCount = selectedConjugations.filter((conjugation) =>
    completedWordSet.has(conjugation.lemma)
  ).length;
  const currentWordNumber = Math.min(completedQuizWordsCount + 1, totalQuizWords);
  const progressPercent =
    totalQuizWords === 0 ? 0 : (completedQuizWordsCount / totalQuizWords) * 100;
  const [isDisabled, setIsDisabled] = useState(true);
  const resetSessionProgress = () => {
    sessionStorage.removeItem(COMPLETED_WORDS_SESSION_KEY);
    setCompletedWords([]);
    setStoredWord(null);
  };
  if (availableConjugations.length === 0) {
    return (
      <>
        <Card className="w-full sm:max-w-md">
          <CardHeader>
            <CardTitle>Session complete</CardTitle>
            <CardDescription>
              You have completed all selected words for this session.
            </CardDescription>
            <Button
              className="mt-2 w-fit"
              onClick={() => {
                resetSessionProgress();
                navigate("/conjugator");
              }}
            >
              Play Again
            </Button>
          </CardHeader>
        </Card>
        <Toaster />
      </>
    );
  }
  const hasStoredWordInSelection = !!availableConjugations.find(
    (conjugation) => conjugation.lemma === storedWord
  );
  if (!storedWord || !hasStoredWordInSelection) {
    setRandomWord(availableConjugations, setStoredWord);
  }
  const [activeField, setActiveField] = useState<
    "én" | "te" | "ő" | "mi" | "ti" | "ők"
  >("én");

  const { tense, voice } = useParams<{
    tense: TenseType;
    voice: VoiceType;
  }>();

  const randomWord = availableConjugations.find(
    (conjugation) => conjugation.lemma === storedWord
  );
  const infinitive = randomWord?.infinitive;
  const translation = randomWord?.translation;
  const lemma = randomWord?.lemma;

  const form = useForm({
    defaultValues: {
      én: "",
      te: "",
      ő: "",
      mi: "",
      ti: "",
      ők: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value: userAnswers }) => {
      if (!randomWord) return;

      const correctSubmissions = getCorrectSubmissions(
        userAnswers,
        randomWord,
        tense ?? "present",
        voice ?? "indefinite"
      );

      const correctPronouns: PronounKey[] = correctSubmissions;

      PRONOUN_KEYS.forEach((pronoun) => {
        const isCorrect = correctPronouns.includes(pronoun);
        form.setFieldMeta(pronoun, (prev) => ({
          ...prev,
          isCorrect,
          errorMap: {
            onSubmit: isCorrect ? undefined : "no",
          },
        }));
      });
      toast.success("Form submitted successfully");
      if (correctSubmissions.length === PRONOUN_KEYS.length) {
        if (lemma) {
          markWordAsCompleted(lemma);
        }
        setIsDisabled(false);
      }
    },
  });

  const FormField = form.Field;

  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const handleCharInsert = (char: string) => {
    const currentVal = form.getFieldValue(activeField) || "";
    const targetInput = inputRefs.current[activeField];
    const start = targetInput?.selectionStart || 0;
    const end = targetInput?.selectionEnd || 0;
    const before = currentVal.substring(0, start);
    const after = currentVal.substring(end);
    const newVal = before + char + after;
    form.setFieldValue(activeField, newVal);
    setTimeout(() => {
      if (targetInput) {
        const newPos = start + char.length;
        targetInput.setSelectionRange(newPos, newPos);
        targetInput?.focus();
      }
    }, 0);
  };

  return (
    <>
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>{lemma}</CardTitle>
          <CardDescription>
            <div className="flex justify-between">
              <p>{infinitive}</p>
              <p>{translation}</p>
            </div>
          </CardDescription>
          <CardDescription>
            <Badge variant="outline" className="mr-2">
              {tense}
            </Badge>
            <Badge variant="outline">{voice}</Badge>
          </CardDescription>
          <CardDescription>
            <div className="space-y-2">
              <p>
                Word {currentWordNumber} of {totalQuizWords}
              </p>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AccentedLetters handleCharInsert={handleCharInsert} />
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
              {PRONOUN_KEYS.map((pronoun: PronounKey) => {
                return (
                  <FormField
                    key={pronoun}
                    name={pronoun}
                    children={(field) => {
                      const meta = field.state.meta as unknown as {
                        isCorrect?: boolean;
                        errors?: unknown[];
                      };
                      const isCorrect = !!meta.isCorrect;
                      const isInvalid = (meta.errors || []).length > 0;

                      return (
                        <Field
                          data-invalid={isInvalid}
                          orientation="horizontal"
                        >
                          <FieldLabel
                            htmlFor={field.name}
                            className="w-14 justify-center text-center"
                          >
                            {pronoun}
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onFocus={() => setActiveField(field.name)}
                            ref={(el) => {
                              if (el) inputRefs.current[field.name] = el;
                            }}
                            className={`${
                              isCorrect ? "border-green-500" : ""
                            } w-64 md:w-96`}
                            aria-invalid={isInvalid}
                            autoComplete="off"
                          />
                          {isCorrect && (
                            <CircleCheck className="w-6 h-8 text-green-500" />
                          )}
                          {isInvalid && (
                            <CircleX className="w-6 h-8 text-red-500" />
                          )}
                        </Field>
                      );
                    }}
                  />
                );
              })}
            </FieldGroup>
            <div className="flex gap-3">
              <Button type="submit">Submit</Button>
              <Button
                disabled={isDisabled || availableConjugations.length === 0}
                onClick={(e) => {
                  e.preventDefault();
                  setRandomWord(availableConjugations, setStoredWord);
                  setIsDisabled(true);
                  form.reset();
                }}
              >
                Next Verb
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </>
  );
};

function getCorrectSubmissions(
  userAnswers: Pronouns,
  randomWord: VerbConjugation,
  tense: TenseType,
  voice: VoiceType
): PronounKey[] {
  return PRONOUN_KEYS.flatMap((pronoun: PronounKey) => {
    const voiceGroup = randomWord[tense][voice];
    const correctWord = voiceGroup ? voiceGroup[pronoun] : undefined;
    const userWord = userAnswers[pronoun];
    if (correctWord === userWord) {
      return [pronoun];
    }
    return [];
  });
}
