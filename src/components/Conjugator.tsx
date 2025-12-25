import conjugations from "../assets/conjugations.json";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Toaster } from "sonner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
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
import type { VerbConjugation } from "./VerbConjugation";
import type { Pronouns } from "./Pronouns";
import type { VoiceType } from "./types";
import type { TenseType } from "./types";
import { useParams } from "react-router-dom";

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
  const randomWord = conjugations[0];
  const infinitive = randomWord.infinitive;
  const translation = randomWord.translation;

  const { tense, voice } = useParams<{
    tense: TenseType;
    voice: VoiceType;
  }>();

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
        randomWord,
        tense,
        voice
      );

      if (incorrectSubmissions.length) {
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

      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>
            {infinitive} - {translation}
          </CardTitle>
          <CardDescription>
            {tense} - {voice}
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
  randomWord: VerbConjugation,
  tense: TenseType,
  voice: VoiceType
): PronounKey[] {
  return PRONOUN_KEYS.flatMap((pronoun: PronounKey) => {
    const correctWord = randomWord[tense][voice][pronoun];
    const userWord = userAnswers[pronoun];
    if (correctWord != userWord) {
      return [pronoun];
    }
    return [];
  });
}
