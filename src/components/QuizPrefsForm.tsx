import { useForm } from "@tanstack/react-form";
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

export const QuizPrefsForm = () => {
  const navigate = useNavigate();
  const allWords = conjugations.map((conjugation) => conjugation.lemma);
  const [selectedWords, setSelectedWords] = useLocalStorage<string[]>(
    "quizWords",
    allWords
  );
  const [, setStoredWord] = useLocalStorage<string | null>("randomWord", null);

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
    defaultValues: {
      tense: "present",
      voice: "indefinite",
    },
    onSubmit: async ({ value: quizPrefs }) => {
      navigate(`/conjugator/${quizPrefs.tense}/${quizPrefs.voice}`);
    },
  });

  const FormField = form.Field;
  const startRandomQuiz = () => {
    const tense = form.getFieldValue("tense");
    const voice = form.getFieldValue("voice");
    if (!tense || !voice) return;

    sessionStorage.removeItem("completedQuizWords");
    setRandomWord({ words: conjugations, setStoredWord });
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
                <FieldGroup className="gap-3">
                  <FormField
                    name="tense"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field
                          orientation="horizontal"
                          data-invalid={isInvalid}
                        >
                          <Checkbox
                            id="tense-present"
                            name="tense"
                            value="present"
                            checked={field.state.value === "present"}
                            onCheckedChange={(checked) =>
                              field.handleChange(checked ? "present" : "")
                            }
                            onBlur={field.handleBlur}
                            aria-invalid={isInvalid}
                          />
                          <FieldLabel
                            htmlFor="tense-present"
                            className="font-normal"
                            defaultChecked
                          >
                            Present
                          </FieldLabel>
                        </Field>
                      );
                    }}
                  />
                  <FormField
                    name="tense"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field orientation="horizontal">
                          <Checkbox
                            id="tense-past"
                            name="tense"
                            value="past"
                            checked={field.state.value === "past"}
                            onCheckedChange={(checked) =>
                              field.handleChange(checked ? "past" : "")
                            }
                            onBlur={field.handleBlur}
                            aria-invalid={isInvalid}
                          />
                          <FieldLabel
                            htmlFor="tense-past"
                            className="font-normal"
                          >
                            Past
                          </FieldLabel>
                        </Field>
                      );
                    }}
                  />
                </FieldGroup>
              </FieldSet>
              <FieldSeparator />
              <FieldGroup>
                <FieldSet>
                  <FieldLegend variant="label">Voice</FieldLegend>
                  <FieldGroup className="gap-3">
                    <FormField
                      name="voice"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;

                        return (
                          <Field
                            orientation="horizontal"
                            data-invalid={isInvalid}
                          >
                            <Checkbox
                              id="voice-indefinite"
                              name="voice"
                              value="indefinite"
                              checked={field.state.value === "indefinite"}
                              onCheckedChange={(checked) =>
                                field.handleChange(checked ? "indefinite" : "")
                              }
                              onBlur={field.handleBlur}
                              aria-invalid={isInvalid}
                            />
                            <FieldLabel
                              htmlFor="voice-indefinite"
                              className="font-normal"
                              defaultChecked
                            >
                              Indefinite
                            </FieldLabel>
                          </Field>
                        );
                      }}
                    />
                    <FormField
                      name="voice"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;

                        return (
                          <Field orientation="horizontal">
                            <Checkbox
                              id="voice-definite"
                              name="voice"
                              value="definite"
                              checked={field.state.value === "definite"}
                              onCheckedChange={(checked) =>
                                field.handleChange(checked ? "definite" : "")
                              }
                              onBlur={field.handleBlur}
                              aria-invalid={isInvalid}
                            />
                            <FieldLabel
                              htmlFor="voice-definite"
                              className="font-normal"
                            >
                              Definite
                            </FieldLabel>
                          </Field>
                        );
                      }}
                    />
                  </FieldGroup>
                </FieldSet>
              </FieldGroup>
              <FieldSeparator />
              <FieldSet className="w-full">
                <FieldLegend variant="label">Words</FieldLegend>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>{selectedWords.length} selected</span>
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
                <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-3">
                  {allWords.map((word) => (
                    <Field key={word} orientation="horizontal">
                      <Checkbox
                        id={`word-${word}`}
                        checked={selectedWords.includes(word)}
                        onCheckedChange={(checked) => toggleWord(word, !!checked)}
                      />
                      <FieldLabel htmlFor={`word-${word}`} className="font-normal">
                        {word}
                      </FieldLabel>
                    </Field>
                  ))}
                </div>
              </FieldSet>
            </FieldGroup>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Button disabled={selectedWords.length === 0}>
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
