import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GrammarLessonLinks } from "./GrammarLessonLinks";

const conjugationRows = [
  { person: "Én (1PS)", ending: "-om / -em / -öm", example: "Úszom" },
  { person: "Te (2PS)", ending: "-ol / -el / -öl", example: "Úszol" },
  { person: "Ő (3PS)", ending: "-ik", example: "Úszik" },
];

const realIkExamples = [
  { verb: "Alszik", first: "Alszom" },
  { verb: "Fekszik", first: "Fekszem" },
  { verb: "Dolgozik", first: "Dolgozom" },
  { verb: "Reggelizik", first: "Reggelizem" },
];

const falseIkExamples = [
  { verb: "Eltűnik", first: "Eltűnök" },
];

const IkVerbs = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 wrap-break-word">
      <div className="space-y-8 md:grid md:grid-cols-[220px_minmax(0,1fr)] md:items-start md:gap-8 md:space-y-0">
        <aside className="md:sticky md:top-6">
          <GrammarLessonLinks compact vertical />
        </aside>
        <div className="min-w-0 space-y-8 sm:space-y-12">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">-ik Verbs</h1>
            <p className="text-muted-foreground">
              A special class of verbs with unique singular conjugation endings.
            </p>
          </div>

          {/* Section 1: What are -ik verbs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">What Are -ik Verbs?</CardTitle>
              <CardDescription>
                How to identify them in the dictionary and find the stem.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed sm:text-base">
              <p>
                In Hungarian, verbs are listed in the dictionary by their third-person singular
                (3PS) indefinite form. For regular verbs, this is the bare stem. For -ik verbs, the
                dictionary form ends in -ik, and the stem is found by removing that ending.
              </p>
              <div className="rounded-lg border-l-4 border-primary bg-muted/40 p-4 text-sm">
                <p>Example: Úszik → stem is Úsz- → conjugate from there.</p>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Indefinite Conjugation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">
                Indefinite Conjugation (Singular)
              </CardTitle>
              <CardDescription>
                The unique endings that define the -ik verb class. Example: Úszik (to swim).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="overflow-hidden rounded-lg border">
                <Table className="w-full text-sm">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">Person</TableHead>
                      <TableHead className="w-1/3">Ending</TableHead>
                      <TableHead className="w-1/3 text-right">Example</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {conjugationRows.map((row, i) => (
                      <TableRow
                        key={row.person}
                        className={i % 2 === 0 ? "bg-muted/40" : "bg-background"}
                      >
                        <TableCell className="font-medium">{row.person}</TableCell>
                        <TableCell className="font-mono">{row.ending}</TableCell>
                        <TableCell className="text-right">{row.example}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Important Notes</h3>
                <ul className="space-y-2 text-sm leading-relaxed">
                  <li className="flex gap-2">
                    <span className="mt-0.5 text-muted-foreground">•</span>
                    <span>
                      Plural forms — the indefinite plural forms (mi, ti, ők) are identical to
                      regular verbs.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-0.5 text-muted-foreground">•</span>
                    <span>
                      Definite conjugation — -ik verbs follow the standard regular rules; there is
                      nothing special here.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-0.5 text-muted-foreground">•</span>
                    <span>
                      The "Te" rule — unlike regular verbs that change to -sz after sibilants (s,
                      sz, z), -ik verbs almost always keep the -ol/-el/-öl ending, making them more
                      consistent in the 2nd person.
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Real vs False -ik verbs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">"Real" vs. "False" -ik Verbs</CardTitle>
              <CardDescription>
                Not every verb ending in -ik uses the unique 1st person singular ending.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Real -ik verbs */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold uppercase tracking-widest text-muted-foreground">
                    Real -ik Verbs
                  </h3>
                  <div className="space-y-2 text-sm leading-relaxed">
                    <p>
                      These are the true members of the category. They usually describe a state of
                      being, a feeling, or a reflexive action.
                    </p>
                    <p>Stem endings: frequently end in s, sz, z, or d.</p>
                    <p>1st person: must use -om/-em/-öm.</p>
                  </div>
                  <div className="overflow-hidden rounded-lg border">
                    <Table className="w-full text-sm">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Verb</TableHead>
                          <TableHead className="text-right">1PS Form</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {realIkExamples.map((row, i) => (
                          <TableRow
                            key={row.verb}
                            className={i % 2 === 0 ? "bg-muted/40" : "bg-background"}
                          >
                            <TableCell>{row.verb}</TableCell>
                            <TableCell className="text-right">{row.first}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* False -ik verbs */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold uppercase tracking-widest text-muted-foreground">
                    False -ik Verbs
                  </h3>
                  <div className="space-y-2 text-sm leading-relaxed">
                    <p>
                      These look like -ik verbs in the dictionary but behave like regular verbs in
                      the 1st person singular.
                    </p>
                    <p>
                      The "N" giveaway: if the stem ends in n right before the -ik, it is often a
                      false -ik verb.
                    </p>
                    <p>1st person: uses the regular -ok/-ek/-ök.</p>
                  </div>
                  <div className="overflow-hidden rounded-lg border">
                    <Table className="w-full text-sm">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Verb</TableHead>
                          <TableHead className="text-right">1PS Form</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {falseIkExamples.map((row, i) => (
                          <TableRow
                            key={row.verb}
                            className={i % 2 === 0 ? "bg-muted/40" : "bg-background"}
                          >
                            <TableCell>{row.verb}</TableCell>
                            <TableCell className="text-right">{row.first}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Modern Usage Note */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Modern Usage Note</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed sm:text-base">
              <p>
                In casual, everyday Hungarian, many native speakers use the regular -ok/-ek/-ök
                endings for real -ik verbs — for example, saying Dolgozok instead of the standard
                Dolgozom. However, the -om/-em/-öm forms remain the grammatically correct standard
                and are what you will see in formal writing and what you should aim to produce.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IkVerbs;
