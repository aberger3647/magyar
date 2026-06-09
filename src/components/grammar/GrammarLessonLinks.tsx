import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { grammarLessons } from "./lessons";

type GrammarLessonLinksProps = {
  compact?: boolean;
  vertical?: boolean;
};

const baseLinkClass =
  "rounded-md px-3 py-2 transition-colors hover:bg-muted";

const selectClassName = cn(
  "border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
);

export const GrammarLessonLinks = ({
  compact = false,
  vertical = false,
}: GrammarLessonLinksProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  if (compact && vertical) {
    return (
      <>
        <select
          className={cn(selectClassName, "md:hidden")}
          value={location.pathname}
          onChange={(e) => navigate(e.target.value)}
          aria-label="Select lesson"
        >
          {grammarLessons.map((lesson) => (
            <option key={lesson.to} value={lesson.to}>
              {lesson.title}
            </option>
          ))}
        </select>
        <div className="hidden flex-col gap-1 md:flex">
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
      </>
    );
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
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
