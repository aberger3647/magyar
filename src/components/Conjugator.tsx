import conjugations from "../assets/conjugations.json";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

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
  const form = useForm({
    defaultValues: {
      én: "",
      te: "",
      ő: "",
      mi: "",
      ti: "",
      ők: "",
    },
    // validators: {
    //   onSubmit: formSchema,
    // },
    onSubmit: async ({ value }) => {
      toast.success("Form submitted successfully");
      console.log(value);
    },
  });
  console.log(conjugations);
  return (
    <main className="flex flex-col items-center pb-4">
      <h1 className="mb-5 text-xl">Conjugator Quiz</h1>
      <form className="flex flex-col items-center justify-center w-full max-w-md">
        <FieldCheckbox />
        <Button className="mt-4">Start Quiz</Button>
      </form>

      <form
        className="flex flex-col items-center justify-center w-full max-w-md"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <FieldSet>
            <FieldLegend variant="label">
              {conjugations[0].infinitive} | {conjugations[0].translation}
            </FieldLegend>

            {Object.keys(conjugations[0].present.indefinite).map((key, idx) => {
              const inputId = `answer-present-indefinite-${idx}`;
              return (
                <FieldGroup key={`${key}-${idx}`} className="gap-3">
                  <Field orientation="horizontal">
                    <FieldLabel
                      htmlFor={inputId}
                      className="font-normal"
                      defaultChecked
                    >
                      {key}
                    </FieldLabel>
                    <Input id={inputId} />
                    <FieldError>err</FieldError>
                  </Field>
                </FieldGroup>
              );
            })}
          </FieldSet>
        </FieldGroup>
        <Button className="mt-4">Submit Answers</Button>
      </form>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          {Object.keys(conjugations[0].present.indefinite).map((key, idx) => (
            <form.Field
              name={key}
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>{key}</FieldLabel>
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
          ))}
        </FieldGroup>
        <Button type="submit">Submit</Button>
      </form>
      <Toaster />
    </main>
  );
};

// select past or present
// select definite or indefinite
// display translation
// display infinitive
// get a random pronoun from the key
// the answer is the value
