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
import { Badge } from "./ui/badge";

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

const getRandomWord = () => {
  const numOfWords = conjugations.length;
  const randomNum = Math.floor(Math.random() * (0 - numOfWords) + numOfWords);
  return conjugations[randomNum];
};

export const Conjugator = () => {
  const randomWord = getRandomWord();
  const infinitive = randomWord.infinitive;
  const translation = randomWord.translation;
  const lemma = randomWord.present.indefinite.ő;

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
                message: "Incorrect",
              },
            },
          }));
        });

        toast.error("Check your answers and try again.");
        return; // Prevent the actual API call
      }

      toast.success("Form submitted successfully");
    },
  });

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
            <Badge variant="outline" className="mr-2">{tense}</Badge>
            <Badge variant="outline">{voice}</Badge>
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
    </>
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
