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

function FieldCheckbox() {
  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend variant="label">Past or Present</FieldLegend>
        <FieldGroup className="gap-3">
          <Field orientation="horizontal">
            <Checkbox id="tense-present" />
            <FieldLabel
              htmlFor="tense-present"
              className="font-normal"
              defaultChecked
            >
              Present
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="tense-past" />
            <FieldLabel htmlFor="tense-past" className="font-normal">
              Past
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
      <FieldSeparator />
      <FieldSet>
        <FieldLegend variant="label">Definite or Indefinite</FieldLegend>
        <FieldGroup className="gap-3">
          <Field orientation="horizontal">
            <Checkbox id="voice-definite" />
            <FieldLabel
              htmlFor="voice-definite"
              className="font-normal"
              defaultChecked
            >
              Definite
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="voice-indefinite" />
            <FieldLabel htmlFor="voice-indefinite" className="font-normal">
              Indefinite
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
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
      console.log("VALUE", userAnswers);

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
              onSubmit: "This conjugation is a duplicate of another field.",
            },
          }));
        });

        toast.error("It's wrong");
        return; // Prevent the actual API call
      }

      toast.success("Form submitted successfully");
    },
  });

  console.log(conjugations);
  return (
    <main className="flex flex-col items-center gap-4 pb-4">
      <h1 className="mb-5 text-xl">Conjugator Quiz</h1>
      <form className="flex flex-col items-center justify-center w-full max-w-md">
        <FieldCheckbox />
        <Button className="mt-4">Start Quiz</Button>
      </form>

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
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              {PRONOUN_KEYS.map((pronoun) => {
                return (
                  <form.Field
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
) {
  return PRONOUN_KEYS.flatMap((pronoun) => {
    const correctWord = randomWord.present.definite[pronoun];
    const userWord = userAnswers[pronoun];
    if (correctWord != userWord) {
      return pronoun;
    }
    return [];
  });
}
// select past or present
// select definite or indefinite
// display translation
// display infinitive
// get a random pronoun from the key
// the answer is the value
