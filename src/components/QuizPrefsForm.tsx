import { useForm } from "@tanstack/react-form";
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
import { type Dispatch, type SetStateAction } from "react";
import type { TenseType } from "./types";
import type { VoiceType } from "./types";

// const checkboxFormSchema = z.object({
//   tense: z.array,
//   voice:
// })

export const QuizPrefsForm = ({
  setTense,
  setVoice,
}: {
  setTense: Dispatch<SetStateAction<TenseType>>;
  setVoice: Dispatch<SetStateAction<VoiceType>>;
}) => {
  const form = useForm({
    defaultValues: {
      tense: "present",
      voice: "indefinite",
    },
    // validators: {
    //   onSubmit: checkboxFormSchema,
    // },
    onSubmit: async ({ value: quizPrefs }) => {
      setTense(quizPrefs.tense);
      setVoice(quizPrefs.voice);
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
};
