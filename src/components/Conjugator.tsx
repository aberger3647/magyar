import conjugations from "../assets/conjugations.json";

import { Checkbox } from "@/components/ui/checkbox";

import {
  Field,
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
  console.log(conjugations);
  return (
    <main className="flex flex-col items-center pb-4">
      <h1 className="mb-5 text-xl">Conjugator Quiz</h1>
      <form className="flex flex-col items-center justify-center w-full max-w-md">
        <FieldCheckbox />
        <Button className="mt-4">Start Quiz</Button>
      </form>

      <form className="flex flex-col items-center justify-center w-full max-w-md">
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
                  </Field>
                </FieldGroup>
              );
            })}
          </FieldSet>
        </FieldGroup>
        <Button className="mt-4">Submit Answers</Button>
      </form>
    </main>
  );
};

// select past or present
// select definite or indefinite
// display translation
// display infinitive
// get a random pronoun from the key
// the answer is the value
