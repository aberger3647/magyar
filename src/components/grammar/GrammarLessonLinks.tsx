import { NavLink } from "react-router-dom";
import { grammarLessons } from "./lessons";

type GrammarLessonLinksProps = {
  compact?: boolean;
  vertical?: boolean;
};

const baseLinkClass =
  "rounded-md px-3 py-2 transition-colors hover:bg-muted";

export const GrammarLessonLinks = ({
  compact = false,
  vertical = false,
}: GrammarLessonLinksProps) => {
  if (compact) {
    return (
      <div className={vertical ? "flex flex-col gap-1" : "flex flex-wrap gap-2"}>
        {grammarLessons.map((lesson) => (
          <NavLink
            key={lesson.to}
            to={lesson.to}
            className={({ isActive }) =>
              `${baseLinkClass} text-sm font-medium ${
                isActive ? "bg-muted text-foreground" : "text-muted-foreground"
              }`
            }
          >
            {lesson.title}
          </NavLink>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {grammarLessons.map((lesson) => (
        <NavLink
          key={lesson.to}
          to={lesson.to}
          className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
        >
          <h2 className="font-semibold">{lesson.title}</h2>
          <p className="text-sm text-muted-foreground">{lesson.description}</p>
        </NavLink>
      ))}
    </div>
  );
};
