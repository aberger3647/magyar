import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GrammarLessonLinks } from "./GrammarLessonLinks";

type ExampleRow = {
  english: string;
  hungarian: string;
};

type FogLeszRow = {
  person: string;
  fog: string;
  lesz: string;
};

type WordOrderRow = {
  goal: string;
  pattern: string;
  example: string;
};

const fogLeszRows: FogLeszRow[] = [
  { person: "én", fog: "fogok", lesz: "leszek" },
  { person: "te", fog: "fogsz", lesz: "leszel" },
  { person: "ő", fog: "fog", lesz: "lesz" },
  { person: "mi", fog: "fogunk", lesz: "leszünk" },
  { person: "ti", fog: "fogtok", lesz: "lesztek" },
  { person: "ők", fog: "fognak", lesz: "lesznek" },
];

const leszExamples: ExampleRow[] = [
  { english: "I will be happy.", hungarian: "Boldog leszek." },
  { english: "They will be at home.", hungarian: "Otthon lesznek." },
  { english: "I will have a new car.", hungarian: "Lesz egy új autóm." },
];

const fogExamples: ExampleRow[] = [
  { english: "You will work.", hungarian: "Dolgozni fogsz." },
  { english: "He will sleep.", hungarian: "Aludni fog." },
];

const wordOrderRows: WordOrderRow[] = [
  { goal: "Neutral", pattern: "Inf. + Fog + Object", example: "Venni fogok egy táskát." },
  { goal: "Focus on Object", pattern: "Object + Fog + Inf.", example: "Egy táskát fogok venni." },
  {
    goal: "Focus on Completion",
    pattern: "Prefix + Fog + Inf. + Object",
    example: "Meg fogom venni a táskát.",
  },
  {
    goal: "Negative",
    pattern: "Nem + Fog + Inf. + Object",
    example: "Nem fogom megvenni a táskát.",
  },
];

const ExampleList = ({ rows }: { rows: ExampleRow[] }) => (
  <ul className="space-y-2 text-sm leading-relaxed sm:text-base">
    {rows.map((row) => (
      <li key={row.hungarian}>
        <em>{row.hungarian}</em> — {row.english}
      </li>
    ))}
  </ul>
);

const BilingualCardHeader = ({ english, hungarian }: { english: string; hungarian: string }) => (
  <CardTitle className="grid grid-cols-2 gap-4 text-xl sm:text-2xl">
    <span>{english}</span>
    <span className="text-right">{hungarian}</span>
  </CardTitle>
);

const FutureTense = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 wrap-break-word">
      <div className="space-y-8 md:grid md:grid-cols-[220px_minmax(0,1fr)] md:items-start md:gap-8 md:space-y-0">
        <aside className="md:sticky md:top-6">
          <GrammarLessonLinks compact vertical />
        </aside>
        <div className="min-w-0 space-y-8 sm:space-y-12">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Future Tense</h1>
            <p className="text-muted-foreground">
              Two ways to express the future: <em>fog</em> + infinitive, or <em>lesz</em>.
            </p>
          </div>

          <Card>
            <CardHeader>
              <BilingualCardHeader english="Future Tense" hungarian="Jövő idő" />
              <CardDescription>
                There are two ways to express the future in Hungarian. One is to use the verb{" "}
                <em>fog</em>, an auxiliary verb, and the infinitive. The other is to use the word{" "}
                <em>lesz</em>, the future form of <em>van</em> (to be).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="overflow-hidden rounded-lg border">
                <Table className="w-full text-sm">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/4">Person</TableHead>
                      <TableHead className="w-[37.5%]">fog</TableHead>
                      <TableHead className="w-[37.5%] text-right">lesz</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fogLeszRows.map((row, index) => (
                      <TableRow
                        key={row.person}
                        className={index % 2 === 0 ? "bg-muted/40" : "bg-background"}
                      >
                        <TableCell className="font-medium">{row.person}</TableCell>
                        <TableCell>{row.fog}</TableCell>
                        <TableCell className="text-right">{row.lesz}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">When to Use lesz</CardTitle>
              <CardDescription>
                Use <em>lesz</em> when describing a state — existence, location, possession, or
                adjectives.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExampleList rows={leszExamples} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">When to Use fog</CardTitle>
              <CardDescription>
                Use <em>fog</em> when talking about an action. You will always use a verb with{" "}
                <em>fog</em>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExampleList rows={fogExamples} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Word Order</CardTitle>
              <CardDescription>
                The order of <em>fog</em> and the infinitive depends on focus and verbal prefixes
                (el-, ki-, be-, fel-, etc.).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-sm leading-relaxed sm:text-base">
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">Neutral sentence — infinitive first</p>
                  <p className="mt-1 font-mono text-muted-foreground">Infinitive + Fog + (Object)</p>
                  <ul className="mt-2 space-y-1">
                    <li>
                      <em>Sütni fogok egy kenyeret.</em> — I will bake a loaf of bread.
                    </li>
                    <li>
                      <em>Futni fogok holnap.</em> — I will run tomorrow.
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">Emphasize the activity</p>
                  <p className="mt-1 font-mono text-muted-foreground">Subject + Infinitive + Fog</p>
                  <p className="mt-2">
                    <em>
                      Péter <strong>főzni</strong> fog.
                    </em>{" "}
                    — Peter will <strong>cook</strong>.
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Emphasize the subject</p>
                  <p className="mt-1 font-mono text-muted-foreground">Subject + Fog + Infinitive</p>
                  <p className="mt-2">
                    <em>
                      <strong>Péter</strong> fog főzni.
                    </em>{" "}
                    — <strong>Peter</strong> will cook.
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Emphasize the object</p>
                  <p className="mt-1 font-mono text-muted-foreground">Object + Fog + Infinitive</p>
                  <p className="mt-2">
                    <em>
                      Egy <strong>kenyeret</strong> fog sütni.
                    </em>{" "}
                    — (emphasis on the bread)
                  </p>
                </div>
              </div>

              <div className="rounded-lg border-l-4 border-primary bg-muted/40 p-4 text-sm">
                <p className="font-semibold">Negation</p>
                <p className="mt-2 font-mono">Nem + Fog + Infinitive</p>
                <p className="mt-2">
                  <em>Nem fogok úszni.</em> — I will not swim.
                </p>
                <p className="mt-2 font-mono">Nem + Fog + Object + Infinitive</p>
                <p className="mt-2">
                  <em>Nem fogok egy kenyeret sütni.</em> — I will not bake a bread.
                </p>
              </div>

              <div className="rounded-lg border-l-4 border-primary bg-muted/40 p-4 text-sm">
                <p className="font-semibold">Verbal prefixes</p>
                <p className="mt-2">
                  If a verb has a prefix and the sentence is positive, the prefix detaches and moves
                  in front of <em>fog</em>.
                </p>
                <ul className="mt-2 space-y-1">
                  <li>
                    Present: <em>Elmegyek.</em> — I leave.
                  </li>
                  <li>
                    Future: <em>El fogok menni.</em> — I will leave.
                  </li>
                  <li>
                    Negative: <em>Nem fogok elmenni.</em>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border-l-4 border-primary bg-muted/40 p-4 text-sm">
                <p className="font-semibold">Definite vs. indefinite object</p>
                <p className="mt-2">
                  If the sentence has an object, <em>fog</em> conjugates for definite or indefinite:
                </p>
                <ul className="mt-2 space-y-1">
                  <li>
                    <em>Sütni fogok egy kenyeret.</em> — I will bake a bread. (indefinite)
                  </li>
                  <li>
                    <em>Sütni fogom a kenyeret.</em> — I will bake the bread. (definite)
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <p className="font-semibold">To emphasize completion — prefix first</p>
                <p>
                  <em>
                    <strong>Meg</strong> fogom sütni a kenyeret.
                  </em>{" "}
                  — I <strong>will</strong> bake/finish baking the bread.
                </p>
                <p className="font-semibold">To emphasize the object — object first</p>
                <p>
                  <em>
                    A <strong>kenyeret</strong> fogom megsütni.
                  </em>{" "}
                  — It is the <strong>bread</strong> I will bake.
                </p>
              </div>

              <div className="overflow-hidden rounded-lg border">
                <Table className="w-full text-sm">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/4">Goal</TableHead>
                      <TableHead className="w-2/5">Word Order Pattern</TableHead>
                      <TableHead className="w-[35%] text-right">Example</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wordOrderRows.map((row, index) => (
                      <TableRow
                        key={row.goal}
                        className={index % 2 === 0 ? "bg-muted/40" : "bg-background"}
                      >
                        <TableCell className="font-medium">{row.goal}</TableCell>
                        <TableCell className="font-mono text-xs sm:text-sm">{row.pattern}</TableCell>
                        <TableCell className="text-right">
                          <em>{row.example}</em>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FutureTense;
