import { PageTitle } from "./PageTitle";
import { GrammarLessonLinks } from "./grammar/GrammarLessonLinks";

export const Grammar = () => {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <PageTitle title="Grammar" />
      <p className="text-center text-muted-foreground">
        Choose a lesson:
      </p>
      <GrammarLessonLinks />
    </div>
  );
};
