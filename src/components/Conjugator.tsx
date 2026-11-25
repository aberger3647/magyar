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
  CardDescription,
  CardContent,
} from "./ui/card";
import type { VerbConjugation } from "../types/verbConjugation";
import type { Pronouns } from "../types/pronouns";
import type { VoiceType } from "../types/types";
import type { TenseType } from "../types/types";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Badge } from "./ui/badge";
import { CircleCheck, CircleX } from "lucide-react";
import { setRandomWord } from "../lib/setRandomWord";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useTheme } from "./theme-provider";
import { AccentedLetters } from "./AccentedLetters";
import {
  hasConjugationForm,
  isConjugationAnswerCorrect,
} from "@/lib/conjugatorQuiz";

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
  const { resolved } = useTheme();
  const [searchParams] = useSearchParams();
  const isRandomQuiz = searchParams.get("mode") === "random";
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
  const { tense, voice } = useParams<{
    tense: TenseType;
    voice: VoiceType;
  }>();
  const quizConjugations = useMemo(
    () =>
      conjugations.filter((conjugation) =>
        hasConjugationForm(conjugation, tense ?? "present", voice ?? "indefinite")
      ),
    [tense, voice]
  );
  const selectedConjugations = useMemo(() => {
    if (isRandomQuiz) {
      return quizConjugations.filter(
        (conjugation) => conjugation.lemma === storedWord
      );
    }
    if (selectedWords.length === 0) return quizConjugations;
    const selectedWordSet = new Set(selectedWords);
    return quizConjugations.filter((conjugation) =>
      selectedWordSet.has(conjugation.lemma)
    );
  }, [isRandomQuiz, quizConjugations, selectedWords, storedWord]);
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
  const isLastQuizWord = totalQuizWords > 0 && currentWordNumber === totalQuizWords;
  const progressPercent =
    totalQuizWords === 0 ? 0 : (completedQuizWordsCount / totalQuizWords) * 100;
  const [isDisabled, setIsDisabled] = useState(true);
  const [isHintDisabled, setIsHintDisabled] = useState(true);
  const [activeField, setActiveField] = useState<PronounKey>("én");
  const [readyToFinishQuiz, setReadyToFinishQuiz] = useState(false);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  // Keep showing the current word even after it's marked completed;
  // we only advance to a new word when the user clicks "Next Verb".
  const randomWord = selectedConjugations.find(
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
      setIsDisabled(true);
      setReadyToFinishQuiz(false);

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
      const allCorrect = correctSubmissions.length === PRONOUN_KEYS.length;
      if (allCorrect) {
        toast.success("All 6 forms correct");
      } else if (correctSubmissions.length === 0) {
        toast.error("Check the highlighted fields and try again.");
      } else {
        toast.error(
          `${correctSubmissions.length} of ${PRONOUN_KEYS.length} correct. Check the highlighted fields.`,
        );
      }
      setIsHintDisabled(allCorrect);
      if (allCorrect) {
        if (isLastQuizWord) {
          setReadyToFinishQuiz(true);
        }
        setIsDisabled(false);
      }
    },
  });

  const FormField = form.Field;
  const resetAnswerForm = () => {
    setIsDisabled(true);
    setIsHintDisabled(true);
    setReadyToFinishQuiz(false);
    form.reset();
  };
  const resetSessionProgress = () => {
    sessionStorage.removeItem(COMPLETED_WORDS_SESSION_KEY);
    setCompletedWords([]);
    setStoredWord(null);
  };
  const chooseRandomWord = () => {
    setRandomWord({
      words: isRandomQuiz ? quizConjugations : selectedConjugations,
      excludedWord: lemma,
      setStoredWord,
    });
    resetAnswerForm();
  };
  const hasStoredWordInSelection = !!selectedConjugations.find(
    (conjugation) => conjugation.lemma === storedWord
  );
  useEffect(() => {
    if (!storedWord || !hasStoredWordInSelection) {
      setRandomWord({ words: availableConjugations, setStoredWord });
    }
  }, [
    availableConjugations,
    hasStoredWordInSelection,
    setStoredWord,
    storedWord,
  ]);
  if (availableConjugations.length === 0) {
    return (
      <>
        <Card className="w-full sm:max-w-md">
          <CardHeader>
            <h1 className="text-xl font-semibold tracking-tight">Session complete</h1>
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
        <Toaster theme={resolved} />
      </>
    );
  }
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

  const handleHint = () => {
    if (!randomWord) return;
    const focusedField = PRONOUN_KEYS.find(
      (pronoun) => inputRefs.current[pronoun] === document.activeElement
    );
    const fallbackField = PRONOUN_KEYS.find((pronoun) => {
      const expected = getExpectedWord(
        randomWord,
        tense ?? "present",
        voice ?? "indefinite",
        pronoun
      );
      const current = form.getFieldValue(pronoun) || "";
      return current !== expected;
    });
    const targetField = focusedField ?? fallbackField ?? activeField;
    setActiveField(targetField);

    const expectedWord = getExpectedWord(
      randomWord,
      tense ?? "present",
      voice ?? "indefinite",
      targetField
    );
    if (!expectedWord) return;
    const currentVal = form.getFieldValue(targetField) || "";
    if (currentVal === expectedWord) return;

    const correctPrefixLength = getCorrectPrefixLength(currentVal, expectedWord);
    const hasIncorrectLetters = correctPrefixLength !== currentVal.length;
    if (hasIncorrectLetters) {
      form.setFieldValue(targetField, currentVal.slice(0, -1));
      return;
    }

    const nextChar = expectedWord[correctPrefixLength];
    if (!nextChar) return;
    form.setFieldValue(targetField, currentVal + nextChar);
  };

  return (
    <>
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold tracking-tight" lang="hu">
            {lemma}
          </h1>
          <CardDescription>
            <div className="flex justify-between gap-4">
              <p lang="hu">{infinitive}</p>
              <p>{translation}</p>
            </div>
          </CardDescription>
          <CardDescription className="flex flex-wrap gap-2">
            <Badge variant="outline">{tense}</Badge>
            <Badge variant="outline">{voice}</Badge>
          </CardDescription>
          <CardDescription>
            <div className="space-y-2">
              <p className="tabular-nums">
                Word {currentWordNumber} of {totalQuizWords}
              </p>
              <div
                role="progressbar"
                aria-label="Quiz progress"
                aria-valuenow={completedQuizWordsCount}
                aria-valuemin={0}
                aria-valuemax={totalQuizWords}
                className="h-2 w-full overflow-hidden rounded-full bg-muted"
              >
                <div
                  className="h-full w-full origin-left rounded-full bg-primary transition-transform duration-200 ease-out"
                  style={{ transform: `scaleX(${progressPercent / 100})` }}
                />
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AccentedLetters handleCharInsert={handleCharInsert} />
          <form
            className="flex w-full max-w-md flex-col items-center justify-center gap-4"
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
                      const statusId = `${field.name}-status`;

                      return (
                        <Field
                          data-invalid={isInvalid}
                          orientation="horizontal"
                          className="[&>[data-slot=field-label]]:flex-none"
                        >
                          <FieldLabel
                            htmlFor={field.name}
                            lang="hu"
                            className="w-10 justify-end text-right"
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
                              isCorrect ? "border-success" : ""
                            } min-w-0 flex-1`}
                            aria-invalid={isInvalid}
                            aria-describedby={isCorrect || isInvalid ? statusId : undefined}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="none"
                            spellCheck={false}
                          />
                          <span
                            id={statusId}
                            className="flex h-8 w-6 shrink-0 items-center justify-center"
                          >
                            {isCorrect && (
                              <>
                                <CircleCheck className="size-5 text-success" aria-hidden="true" />
                                <span className="sr-only">Correct</span>
                              </>
                            )}
                            {isInvalid && (
                              <>
                                <CircleX className="size-5 text-destructive" aria-hidden="true" />
                                <span className="sr-only">Incorrect</span>
                              </>
                            )}
                          </span>
                        </Field>
                      );
                    }}
                  />
                );
              })}
            </FieldGroup>
            <div className="flex flex-wrap justify-center gap-3">
              <Button type="submit" variant={isDisabled ? "default" : "outline"}>
                Submit
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isHintDisabled}
                onClick={(e) => {
                  e.preventDefault();
                  handleHint();
                }}
              >
                Hint
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  chooseRandomWord();
                }}
              >
                Random Word
              </Button>
              <Button
                type="button"
                variant={isDisabled ? "outline" : "default"}
                disabled={isDisabled || availableConjugations.length === 0}
                onClick={(e) => {
                  e.preventDefault();
                  if (readyToFinishQuiz) {
                    resetSessionProgress();
                    navigate("/conjugator");
                    return;
                  }
                  if (lemma) {
                    markWordAsCompleted(lemma);
                  }
                  setRandomWord({
                    words: availableConjugations,
                    excludedWord: lemma,
                    setStoredWord,
                  });
                  resetAnswerForm();
                }}
              >
                {readyToFinishQuiz ? "Finish Quiz" : "Next Verb"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Toaster theme={resolved} />
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
    if (isConjugationAnswerCorrect(userWord, correctWord)) {
      return [pronoun];
    }
    return [];
  });
}

function getExpectedWord(
  randomWord: VerbConjugation,
  tense: TenseType,
  voice: VoiceType,
  pronoun: PronounKey
): string {
  const voiceGroup = randomWord[tense][voice];
  return voiceGroup ? voiceGroup[pronoun] : "";
}

function getCorrectPrefixLength(typed: string, correct: string): number {
  const sharedLength = Math.min(typed.length, correct.length);
  for (let i = 0; i < sharedLength; i += 1) {
    if (typed[i] !== correct[i]) {
      return i;
    }
  }
  return sharedLength;
}
