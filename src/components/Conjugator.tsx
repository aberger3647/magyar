import conjugations from "../assets/conjugations.json";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
const PRONOUN_KEYS = ["én", "te", "ő", "mi", "ti", "ők"] as const;
type PronounKey = typeof PRONOUN_KEYS[number];
import * as z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import type { VerbConjugation } from "./VerbConjugation";
import type { Pronouns } from "./Pronouns";

const formSchema = z.object({
  én: z.string().nonempty("This field is required"),
  te: z.string().nonempty("This field is required"),
  ő: z.string().nonempty("This field is required"),
  mi: z.string().nonempty("This field is required"),
  ti: z.string().nonempty("This field is required"),
  ők: z.string().nonempty("This field is required"),
});

// const checkboxFormSchema = z.object({
//   tense: z.array,
//   voice:
// })

function FieldCheckbox() {
  const form = useForm({
    defaultValues: {
      tense: "present",
      voice: "indefinite",
    },
    // validators: {
    //   onSubmit: checkboxFormSchema,
    // },
    onSubmit: async ({ value: quizPrefs }) => {
      console.log(quizPrefs);
    },
  });
  return (
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
            <form.Field
              name="tense"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field orientation="horizontal" data-invalid={isInvalid}>
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
            <form.Field
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
                    <FieldLabel htmlFor="tense-past" className="font-normal">
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
              <form.Field
                name="voice"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field orientation="horizontal" data-invalid={isInvalid}>
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
              <form.Field
                name="voice"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

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
      </FieldGroup>
      <Button className="mt-4">Start Quiz</Button>
    </form>
  );
}

export const Conjugator = () => {
  const randomWord = conjugations[0];
  const infinitive = randomWord.infinitive;
  const translation = randomWord.translation;

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
      const incorrectSubmissions = getIncorrectSubmissions(
        userAnswers,
        randomWord
      );

      if (incorrectSubmissions.length) {
        // 2. Identify WHICH field is problematic (example: highlighting "te")
        // You could also loop through values to find exactly which ones are duplicates
        incorrectSubmissions.forEach((pronoun) => {
          form.setFieldMeta(pronoun, (prev) => ({
            ...prev,
            errorMap: {
              onSubmit: {
                message: "Wrong",
              },
            },
          }));
        });

        toast.error("It's wrong");
        return; // Prevent the actual API call
      }

      toast.success("Form submitted successfully");
    },
  });

  return (
    <main className="flex flex-col items-center gap-4 pb-4">
      <h1 className="mb-5 text-xl">Conjugator Quiz</h1>
      <FieldCheckbox />

      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>{infinitive}</CardTitle>
          <CardDescription>{translation}</CardDescription>
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
              {PRONOUN_KEYS.map((pronoun: PronounKey) => {
                  return (
                    <form.Field
                      key={pronoun}
                      name={pronoun}
                      children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field
                          data-invalid={isInvalid}
                          orientation="horizontal"
                        >
                          <FieldLabel htmlFor={field.name}>
                            {pronoun}
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            autoComplete="off"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                );
              })}
            </FieldGroup>
            <Button type="submit">Submit</Button>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </main>
  );
};

function getIncorrectSubmissions(
  userAnswers: Pronouns,
  randomWord: VerbConjugation
): PronounKey[] {
  return PRONOUN_KEYS.flatMap((pronoun: PronounKey) => {
    const correctWord = randomWord.present.definite[pronoun];
    const userWord = userAnswers[pronoun];
    if (correctWord != userWord) {
      return [pronoun];
    }
    return [];
  });
}
