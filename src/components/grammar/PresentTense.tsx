import { Link } from "react-router-dom";
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

type ConjugationRow = {
  person: string;
  ending: string;
  example: string;
};

type HarmonySection = {
  title: string;
  description: string;
  rows: ConjugationRow[];
  examples: ExampleRow[];
};

const backRows: ConjugationRow[] = [
  { person: "én", ending: "-ok", example: "hozok" },
  { person: "te", ending: "-ol", example: "hozol" },
  { person: "ő", ending: "—", example: "hoz" },
  { person: "mi", ending: "-unk", example: "hozunk" },
  { person: "ti", ending: "-otok", example: "hoztok" },
  { person: "ők", ending: "-nak", example: "hoznak" },
];

const frontUnroundedRows: ConjugationRow[] = [
  { person: "én", ending: "-ek", example: "keresek" },
  { person: "te", ending: "-el", example: "keresel" },
  { person: "ő", ending: "—", example: "keres" },
  { person: "mi", ending: "-ünk", example: "keresünk" },
  { person: "ti", ending: "-etek", example: "kerestek" },
  { person: "ők", ending: "-nek", example: "keresnek" },
];

const frontRoundedRows: ConjugationRow[] = [
  { person: "én", ending: "-ök", example: "főzök" },
  { person: "te", ending: "-öl", example: "főzöl" },
  { person: "ő", ending: "—", example: "főz" },
  { person: "mi", ending: "-ünk", example: "főzünk" },
  { person: "ti", ending: "-ötök", example: "főztök" },
  { person: "ők", ending: "-nek", example: "főznek" },
];

const harmonySections: HarmonySection[] = [
  {
    title: "Back Vowels",
    description:
      "Verbs with a, á, o, ó, u, ú in the stem. Example: hoz (to bring).",
    rows: backRows,
    examples: [
      { english: "I bring water.", hungarian: "Vizet hozok." },
      { english: "We study Hungarian.", hungarian: "Magyarul tanulunk." },
      { english: "They wait at the station.", hungarian: "A pályaudvaron várnak." },
    ],
  },
  {
    title: "Front Unrounded Vowels",
    description:
      "Verbs with e, é, i, í in the stem. Example: keres (to search).",
    rows: frontUnroundedRows,
    examples: [
      { english: "I speak Hungarian.", hungarian: "Magyarul beszélek." },
      { english: "What are you looking for?", hungarian: "Mit keresel?" },
      { english: "We live in Budapest.", hungarian: "Budapesten élünk." },
    ],
  },
  {
    title: "Front Rounded Vowels",
    description:
      "Verbs with ö, ő, ü, ű in the stem. Example: főz (to cook).",
    rows: frontRoundedRows,
    examples: [
      { english: "I cook dinner today.", hungarian: "Ma főzök vacsorát." },
      { english: "She sits by the window.", hungarian: "Az ablaknál ül." },
      { english: "We sit in the garden.", hungarian: "A kertben ülünk." },
    ],
  },
];

const ExampleTable = ({ rows }: { rows: ExampleRow[] }) => {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table className="w-full table-fixed text-sm">
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={`${row.english}-${index}`}
              className={index % 2 === 0 ? "bg-muted/40" : "bg-background"}
            >
              <TableCell className="w-1/2 py-2 pr-2">{row.english}</TableCell>
              <TableCell className="w-1/2 py-2 pl-2 text-right">{row.hungarian}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const ConjugationTable = ({ rows }: { rows: ConjugationRow[] }) => {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table className="w-full text-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4">Person</TableHead>
            <TableHead className="w-1/4">Ending</TableHead>
            <TableHead className="w-1/2 text-right">Example</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={row.person}
              className={index % 2 === 0 ? "bg-muted/40" : "bg-background"}
            >
              <TableCell className="font-medium">{row.person}</TableCell>
              <TableCell className="font-mono">{row.ending}</TableCell>
              <TableCell className="text-right">{row.example}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const BilingualCardHeader = ({ english, hungarian }: { english: string; hungarian: string }) => {
  return (
    <CardTitle className="grid grid-cols-2 gap-4 text-xl sm:text-2xl">
      <span>{english}</span>
      <span className="text-right">{hungarian}</span>
    </CardTitle>
  );
};

const PresentTense = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 wrap-break-word">
      <div className="space-y-8 md:grid md:grid-cols-[220px_minmax(0,1fr)] md:items-start md:gap-8 md:space-y-0">
        <aside className="md:sticky md:top-6">
          <GrammarLessonLinks compact vertical />
        </aside>
        <div className="min-w-0 space-y-8 sm:space-y-12">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Present Tense</h1>
            <p className="text-muted-foreground">
              How to conjugate regular verbs in the present indefinite.
            </p>
          </div>

          <Card>
            <CardHeader>
              <BilingualCardHeader english="Present Tense" hungarian="Jelen idő" />
              <CardDescription>
                Hungarian marks the subject on the verb itself. This lesson covers the{" "}
                <strong>indefinite</strong> present only — used when there is no specific direct
                object, or the object is indefinite (a book, some water).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed sm:text-base">
              <p>
                Verbs are listed in the dictionary in their third-person singular indefinite form —
                the bare stem for regular verbs (e.g. <strong>keres</strong>, <strong>hoz</strong>,{" "}
                <strong>főz</strong>).
              </p>
              <p>
                Endings follow{" "}
                <Link to="/grammar/vowel-harmony" className="text-primary underline-offset-4 hover:underline">
                  vowel harmony
                </Link>
                : back vowels (a, á, o, ó, u, ú), front unrounded (e, é, i, í), and front rounded
                (ö, ő, ü, ű).
              </p>
              <div className="rounded-lg border-l-4 border-primary bg-muted/40 p-4 text-sm">
                <p>
                  <strong>2nd person (te) rule:</strong> after stems ending in s, sz, z, dz, dzs, c,
                  cs, t, or ty, use <strong>-sz / -asz / -esz / -ösz</strong> instead of{" "}
                  <strong>-ol / -el / -öl</strong>. For example: lát → látsz, ül → ülsz, tanul →
                  tanulsz.
                </p>
              </div>
              <p>
                Practice with the{" "}
                <Link
                  to="/conjugator/present/indefinite/"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  conjugator
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          {harmonySections.map((section) => (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ConjugationTable rows={section.rows} />
                <div className="space-y-3">
                  <h3 className="font-semibold">Examples</h3>
                  <ExampleTable rows={section.examples} />
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Common Irregular Verbs</CardTitle>
              <CardDescription>
                These verbs do not follow the regular patterns above.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed sm:text-base">
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <span className="mt-0.5 text-muted-foreground">•</span>
                  <span>
                    <strong>lenni</strong> (to be) — suppletive forms: vagyok, vagy, van, vagyunk,
                    vagytok, vannak. No regular endings apply.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-muted-foreground">•</span>
                  <span>
                    <strong>menni</strong> (to go), <strong>jönni</strong> (to come) — irregular
                    stems in the present (megyek, megy; jövök, jön).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-muted-foreground">•</span>
                  <span>
                    <strong>enni</strong> (to eat), <strong>inni</strong> (to drink) — 3rd person
                    eszik / iszik; 1st person eszem / iszom.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-muted-foreground">•</span>
                  <span>
                    <strong>-ik verbs</strong> — 1st person uses -om/-em/-öm and 3rd person ends in
                    -ik. See the{" "}
                    <Link
                      to="/grammar/ik-verbs"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      -ik verbs lesson
                    </Link>
                    .
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PresentTense;
