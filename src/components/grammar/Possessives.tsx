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

type PossessiveCell = {
  stem: string;
  ending: string;
  className?: string;
};

type PossessiveRow = {
  person: string;
  forms: PossessiveCell[];
};

type TableColumn = {
  key: string;
  label: string;
  className?: string;
};

type PossessiveEnding = {
  person: string;
  boldEnding: string;
  otherEndings: string;
};

const tableColumns: TableColumn[] = [
  { key: "auto", label: "autó" },
  { key: "szek", label: "szék" },
  { key: "cipo", label: "cipő" },
  { key: "zsemle", label: "zsemle" },
];

const possessiveRows: PossessiveRow[] = [
  {
    person: "én",
    forms: [
      { stem: "autó", ending: "m" },
      { stem: "szék", ending: "em" },
      { stem: "cipő", ending: "m" },
      { stem: "zseml", ending: "ém", className: "font-medium text-primary" },
    ],
  },
  {
    person: "te",
    forms: [
      { stem: "autó", ending: "d" },
      { stem: "szék", ending: "ed" },
      { stem: "cipő", ending: "d" },
      { stem: "zseml", ending: "éd", className: "font-medium text-primary" },
    ],
  },
  {
    person: "ő / Ön",
    forms: [
      { stem: "autó", ending: "ja" },
      { stem: "szék", ending: "e" },
      { stem: "cipő", ending: "je" },
      { stem: "zseml", ending: "éje", className: "font-medium text-primary" },
    ],
  },
  {
    person: "mi",
    forms: [
      { stem: "autó", ending: "nk" },
      { stem: "szék", ending: "ünk" },
      { stem: "cipő", ending: "nk" },
      { stem: "zseml", ending: "énk", className: "font-medium text-primary" },
    ],
  },
  {
    person: "ti",
    forms: [
      { stem: "autó", ending: "tok" },
      { stem: "szék", ending: "etek" },
      { stem: "cipő", ending: "tök" },
      { stem: "zseml", ending: "étek", className: "font-medium text-primary text-nowrap" },
    ],
  },
  {
    person: "ők",
    forms: [
      { stem: "autó", ending: "juk" },
      { stem: "szék", ending: "ük" },
      { stem: "cipő", ending: "jük" },
      { stem: "zseml", ending: "éjük", className: "font-medium text-primary text-nowrap" },
    ],
  },
];

const possessiveEndings: PossessiveEnding[] = [
  { person: "én", boldEnding: "-m", otherEndings: ", -om/-am, -em, -öm" },
  { person: "te", boldEnding: "-d", otherEndings: ", -od/-ad, -ed, -öd" },
  { person: "ő/Ön", boldEnding: "-a/-e", otherEndings: ", -ja/-je" },
  { person: "mi", boldEnding: "-nk", otherEndings: ", -unk, -ünk" },
  {
    person: "ti",
    boldEnding: "-tok/-tek/-tök",
    otherEndings: ", -otok/-atok, -etek, -ötök",
  },
  { person: "ők", boldEnding: "-uk/-ük", otherEndings: ", -juk/-jük" },
];

const desktopEndingPairs: Array<[number, number]> = [
  [0, 3],
  [1, 4],
  [2, 5],
];

const Possessives = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 wrap-break-word">
      <div className="space-y-8 md:grid md:grid-cols-[220px_minmax(0,1fr)] md:items-start md:gap-8 md:space-y-0">
        <aside className="md:sticky md:top-6">
          <GrammarLessonLinks compact vertical />
        </aside>
        <div className="min-w-0 space-y-8 sm:space-y-12">
          {/* HEADER SECTION */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Possessives</h1>
          </div>

          {/* POSSESSION CARD */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Possessive Endings</CardTitle>
              <CardDescription>The English words <em>my, your, his, her,</em> etc. in Hungarian are expressed by possessive endings. For words ending in a vowel, just add the ending. For words ending in a consonant, add the ending with a linking vowel according to vowel harmony.</CardDescription>
            </CardHeader>
            <CardContent>
              <aside className="mb-4 rounded-lg border bg-muted/60 p-3 text-sm">
                <div className="mt-2 overflow-x-auto">
                  <Table className="hidden md:table">
                    <TableBody>
                      {desktopEndingPairs.map(([leftIndex, rightIndex]) => {
                        const left = possessiveEndings[leftIndex];
                        const right = possessiveEndings[rightIndex];

                        return (
                          <TableRow key={`${left.person}-${right.person}`}>
                            <TableCell className="w-20 align-top font-bold">{left.person}</TableCell>
                            <TableCell className="wrap-break-word">
                              <span className="font-semibold">{left.boldEnding}</span>
                              {left.otherEndings}
                            </TableCell>
                            <TableCell className="w-20 align-top font-bold">{right.person}</TableCell>
                            <TableCell className="wrap-break-word">
                              <span className="font-semibold">{right.boldEnding}</span>
                              {right.otherEndings}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-2 overflow-x-auto md:hidden">
                  <Table>
                    <TableBody>
                      {possessiveEndings.map((ending) => (
                        <TableRow key={ending.person}>
                          <TableCell className="w-20 align-top font-bold">{ending.person}</TableCell>
                          <TableCell className="wrap-break-word">
                            <span className="font-semibold">{ending.boldEnding}</span>
                            {ending.otherEndings}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </aside>
              <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
                <p className="text-sm wrap-break-word">
                  If a word ends in <strong>-a</strong> or <strong>-e</strong>, these vowels must lengthen to
                  <strong> -á</strong> and <strong> -é</strong> before you can attach any possessive ending.
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm font-mono sm:gap-8">
                  <span>anya → any<strong>á</strong>m</span>
                  <span>macska → macsk<strong>á</strong>m</span>
                  <span>bögre → bögr<strong>é</strong>m</span>
                </div>
              </div>
            </CardContent>
            <CardContent className="min-w-0 px-0 sm:px-6">
              <div className="w-full max-w-full overflow-x-auto">
                <Table className="min-w-[760px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Person</TableHead>
                        {tableColumns.map((column) => (
                          <TableHead key={column.key} className={column.className}>
                            {column.label}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {possessiveRows.map((row) => (
                        <TableRow key={row.person}>
                          <TableCell className="font-bold">{row.person}</TableCell>
                          {row.forms.map((form, index) => (
                            <TableCell key={`${row.person}-${index}`} className={form.className}>
                              {form.stem}
                              <strong>{form.ending}</strong>
                            </TableCell>
                          ))}
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

export default Possessives;