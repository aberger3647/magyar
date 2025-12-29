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
import type { VerbConjugation } from "./VerbConjugation";
import type { Pronouns } from "./Pronouns";
import type { VoiceType } from "./types";
import type { TenseType } from "./types";
import { useParams } from "react-router-dom";
import { Badge } from "./ui/badge";
import { CircleCheck, CircleX } from "lucide-react";
import { setRandomWord } from "./setRandomWord";

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
  const { tense, voice } = useParams<{
    tense: TenseType;
    voice: VoiceType;
  }>();

  const storedWord = localStorage.getItem("randomWord");
  const randomWord = conjugations.find(
    (conjugation) => conjugation.lemma === storedWord
  );
  const infinitive = randomWord?.infinitive;
  const translation = randomWord?.translation;
  const lemma = randomWord?.present.indefinite.ő;

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
      if (correctSubmissions.length === 6) setRandomWord(conjugations);
    },
  });

  const FormField = form.Field;

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
            <Button type="submit">Submit</Button>
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
