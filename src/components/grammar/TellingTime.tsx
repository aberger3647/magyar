import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GrammarLessonLinks } from "./GrammarLessonLinks";

const quarterCards = [
  {
    hungarian: "Negyed",
    english: "Quarter Past",
    structure: "Negyed + [next hour]",
    exampleClock: "8:15",
    examplePhrase: "Negyed kilenc",
  },
  {
    hungarian: "Fél",
    english: "Half Past",
    structure: "Fél + [next hour]",
    exampleClock: "8:30",
    examplePhrase: "Fél kilenc",
  },
  {
    hungarian: "Háromnegyed",
    english: "Quarter To",
    structure: "Háromnegyed + [next hour]",
    exampleClock: "8:45",
    examplePhrase: "Háromnegyed kilenc",
  },
];

const TellingTime = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 wrap-break-word">
      <div className="space-y-8 md:grid md:grid-cols-[220px_minmax(0,1fr)] md:items-start md:gap-8 md:space-y-0">
        <aside className="md:sticky md:top-6">
          <GrammarLessonLinks compact vertical />
        </aside>
        <div className="min-w-0 space-y-8 sm:space-y-12">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Telling Time</h1>
            <p className="text-muted-foreground">
              How Hungarian names the quarters of the hour and counts minutes.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">The Next Hour, Not the Current One</CardTitle>
              <CardDescription>Why “half past eight” becomes “half nine.”</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed sm:text-base">
              <p>
                Telling time in Hungarian is unique because it often focuses on the upcoming hour
                rather than the current one. Instead of saying “half past eight,” Hungarians say{" "}
                <strong>fél kilenc</strong> — literally “half nine.”
              </p>
              <p>
                After the top of the hour, you reference the <strong>next</strong> full hour (
                <span className="font-mono">óra</span>), using the quarter or half that leads into
                it.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">The Four Quarters</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                The hour is divided into four quarters; past the hour, you name the next hour.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {quarterCards.map((q) => (
                <Card key={q.hungarian}>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-1">
                      <p className="text-3xl font-bold tracking-tight sm:text-4xl">{q.hungarian}</p>
                      <p className="text-base text-muted-foreground sm:text-lg">{q.english}</p>
                    </div>
                    <p className="text-sm leading-relaxed">
                      <span className="font-medium text-foreground">Structure:</span>{" "}
                      <span className="font-mono text-xs sm:text-sm">{q.structure}</span>
                    </p>
                    <p className="text-sm leading-relaxed">
                      <span className="font-medium text-foreground">Example:</span>{" "}
                      <span className="font-mono text-xs sm:text-sm">
                        {q.exampleClock} → {q.examplePhrase}
                      </span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Minutes Past / To</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                For specific minute counts, use <span className="font-mono">múlt</span> or{" "}
                <span className="font-mono">múlva</span>.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-1">
                    <p className="text-3xl font-bold tracking-tight sm:text-4xl">Múlt</p>
                    <p className="text-base text-muted-foreground sm:text-lg">Past</p>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Used when minutes have passed the top of the hour.
                  </p>
                  <p className="text-sm leading-relaxed">
                    <span className="font-medium text-foreground">Example:</span>{" "}
                    <span className="font-mono text-xs sm:text-sm">
                      8:10 → Nyolc óra múlt tíz perccel
                    </span>
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-1">
                    <p className="text-3xl font-bold tracking-tight sm:text-4xl">Múlva</p>
                    <p className="text-base text-muted-foreground sm:text-lg">To / In</p>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Used when counting forward to the next hour (minutes until that time).
                  </p>
                  <p className="text-sm leading-relaxed">
                    <span className="font-medium text-foreground">Example:</span>{" "}
                    <span className="font-mono text-xs sm:text-sm">
                      10 to 9 → Tíz perc múlva kilenc
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TellingTime;
