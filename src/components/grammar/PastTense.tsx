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

type PastPatternRow = {
  person: string;
  talalt: string;
  kedvelt: string;
  tort: string;
  ending: string;
};

type PastOttRow = {
  person: string;
  latt: string;
  szeretett: string;
  meglokott: string;
  ending: string;
};

const tPastRows: PastPatternRow[] = [
  { person: "én", talalt: "találtam", kedvelt: "kedveltem", tort: "törtem", ending: "-tam, -tem" },
  { person: "te", talalt: "találtál", kedvelt: "kedveltél", tort: "törtél", ending: "-tál, -tél" },
  {
    person: "ő, Ön",
    talalt: "talált",
    kedvelt: "kedvelt",
    tort: "tört",
    ending: "-t / (-ott, -ett, -ött)",
  },
  {
    person: "mi",
    talalt: "találtunk",
    kedvelt: "kedveltünk",
    tort: "törtünk",
    ending: "-tunk, -tünk",
  },
  {
    person: "ti",
    talalt: "találtatok",
    kedvelt: "kedveltetek",
    tort: "törtetek",
    ending: "-tatok, -tetek",
  },
  {
    person: "ők, Önök",
    talalt: "találtak",
    kedvelt: "kedveltek",
    tort: "törtek",
    ending: "-tak, -tek",
  },
  {
    person: "én téged/titeket",
    talalt: "találtalak",
    kedvelt: "kedveltelek",
    tort: "törtelek",
    ending: "-talak, -telek",
  },
];

const ottPastRows: PastOttRow[] = [
  { person: "én", latt: "láttam", szeretett: "szerettem", meglokott: "meglöktem", ending: "-tam, -tem" },
  { person: "te", latt: "láttál", szeretett: "szerettél", meglokott: "meglöktél", ending: "-tál, -tél" },
  {
    person: "ő, Ön",
    latt: "látott",
    szeretett: "szeretett",
    meglokott: "meglökött",
    ending: "-ott, -ett, -ött",
  },
  {
    person: "mi",
    latt: "láttunk",
    szeretett: "szerettünk",
    meglokott: "meglöktünk",
    ending: "-tunk, -tünk",
  },
  {
    person: "ti",
    latt: "láttatok",
    szeretett: "szerettetek",
    meglokott: "meglötetek",
    ending: "-tatok, -tetek",
  },
  {
    person: "ők, Önök",
    latt: "láttak",
    szeretett: "szerettek",
    meglokott: "meglöktek",
    ending: "-tak, -tek",
  },
  {
    person: "én téged/titeket",
    latt: "láttalak",
    szeretett: "szerettelek",
    meglokott: "meglöktelek",
    ending: "-talak, -telek",
  },
];

const BilingualCardHeader = ({ english, hungarian }: { english: string; hungarian: string }) => (
  <CardTitle className="grid grid-cols-2 gap-4 text-xl sm:text-2xl">
    <span>{english}</span>
    <span className="text-right">{hungarian}</span>
  </CardTitle>
);

const PastTense = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 wrap-break-word">
      <div className="space-y-8 md:grid md:grid-cols-[220px_minmax(0,1fr)] md:items-start md:gap-8 md:space-y-0">
        <aside className="md:sticky md:top-6">
          <GrammarLessonLinks compact vertical />
        </aside>
        <div className="min-w-0 space-y-8 sm:space-y-12">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Past Tense</h1>
            <p className="text-muted-foreground">
              How to conjugate verbs in the past indefinite.
            </p>
          </div>

          <Card>
            <CardHeader>
              <BilingualCardHeader english="Past Tense" hungarian="Múlt idő" />
              <CardDescription>
                The past tense describes completed actions. This lesson covers the{" "}
                <strong>indefinite</strong> past only — the same object rules as the{" "}
                <Link
                  to="/grammar/present-tense"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  present tense
                </Link>
                .
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed sm:text-base">
              <p>
                Endings follow{" "}
                <Link to="/grammar/vowel-harmony" className="text-primary underline-offset-4 hover:underline">
                  vowel harmony
                </Link>
                . Practice with the{" "}
                <Link
                  to="/conjugator/past/indefinite/"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  conjugator
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Past with -t</CardTitle>
              <CardDescription>
                In the indefinite conjugation, the past is formed with <strong>-t</strong> if the stem
                ends in <strong>-j, -l, -m, -n, -ny, -r</strong>.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="overflow-x-auto rounded-lg border">
                <Table className="min-w-[640px] w-full text-sm">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Person</TableHead>
                      <TableHead>talál</TableHead>
                      <TableHead>kedvel</TableHead>
                      <TableHead>tör</TableHead>
                      <TableHead className="text-right">Ending</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tPastRows.map((row, index) => (
                      <TableRow
                        key={row.person}
                        className={index % 2 === 0 ? "bg-muted/40" : "bg-background"}
                      >
                        <TableCell className="font-medium">{row.person}</TableCell>
                        <TableCell>{row.talalt}</TableCell>
                        <TableCell>{row.kedvelt}</TableCell>
                        <TableCell>{row.tort}</TableCell>
                        <TableCell className="text-right font-mono">{row.ending}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="rounded-lg border-l-4 border-primary bg-muted/40 p-4 text-sm">
                <p className="font-semibold">Remember</p>
                <p className="mt-2">
                  <em>Jár a lányom.</em> — My daughter is walking. This sentence contains all of the
                  consonants that form the past tense with <strong>-t</strong>:{" "}
                  <span className="font-mono">j, l, m, n, ny, r</span>.
                </p>
                <p className="mt-2 font-mono">Fáj, csinál, kíván, akar, ír</p>
              </div>

              <div className="space-y-2 text-sm leading-relaxed sm:text-base">
                <p>
                  In addition, most verbs ending in <strong>-ad</strong> and <strong>-ed</strong> form
                  the past with <strong>-t</strong>: marad, szalad, ébred, eltéved.
                </p>
                <p>
                  Exceptions — these take <strong>-t</strong> and <strong>-tt</strong>: téved, enged,
                  szed, ad.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Past with -ott / -ett / -ött</CardTitle>
              <CardDescription>
                Certain verbs take <strong>-ott, -ett,</strong> or <strong>-ött</strong> in the
                singular third person.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="overflow-x-auto rounded-lg border">
                <Table className="min-w-[640px] w-full text-sm">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Person</TableHead>
                      <TableHead>lát</TableHead>
                      <TableHead>szeret</TableHead>
                      <TableHead>meglök</TableHead>
                      <TableHead className="text-right">Ending</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ottPastRows.map((row, index) => (
                      <TableRow
                        key={row.person}
                        className={index % 2 === 0 ? "bg-muted/40" : "bg-background"}
                      >
                        <TableCell className="font-medium">{row.person}</TableCell>
                        <TableCell>{row.latt}</TableCell>
                        <TableCell>{row.szeretett}</TableCell>
                        <TableCell>{row.meglokott}</TableCell>
                        <TableCell className="text-right font-mono">{row.ending}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Vowel Loss</h3>
                <p className="text-sm leading-relaxed sm:text-base">
                  If the verb ends with <strong>-z</strong> or <strong>-g</strong>, the final vowel is
                  omitted before <strong>-tt</strong>.
                </p>
                <ul className="space-y-1 font-mono text-sm">
                  <li>érez → érzett</li>
                  <li>végez → végzett</li>
                  <li>mozog → mozgott</li>
                  <li>forog → forgott</li>
                </ul>
              </div>
            </CardContent>
          </Card>

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
                    <strong>lenni</strong> (to be) — voltam, voltál, volt, voltunk, voltatok, voltak.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-muted-foreground">•</span>
                  <span>
                    <strong>menni</strong> (to go) — mentem, mentél, ment;{" "}
                    <strong>jönni</strong> (to come) — jöttem, jöttél, jött.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-muted-foreground">•</span>
                  <span>
                    <strong>enni</strong> (to eat) — ettem, ettél, evett;{" "}
                    <strong>inni</strong> (to drink) — ittam, ittál, ivott.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-muted-foreground">•</span>
                  <span>
                    <strong>-ik verbs</strong> — past follows the regular -t- pattern (e.g.
                    dolgoztam). See the{" "}
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

export default PastTense;
