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
  TableRow,
} from "@/components/ui/table";
import type { ReactNode } from "react";
import { GrammarLessonLinks } from "./GrammarLessonLinks";

type NumberRow = {
  numeral: string;
  hungarian: string;
};

type BilingualRow = {
  english: string;
  hungarian: ReactNode;
  emphasizeEnglish?: boolean;
  monospace?: boolean;
};

const numbersZeroToNine: NumberRow[] = [
  { numeral: "0", hungarian: "nulla" },
  { numeral: "1", hungarian: "egy" },
  { numeral: "2", hungarian: "kettő" },
  { numeral: "3", hungarian: "három" },
  { numeral: "4", hungarian: "négy" },
  { numeral: "5", hungarian: "öt" },
  { numeral: "6", hungarian: "hat" },
  { numeral: "7", hungarian: "hét" },
  { numeral: "8", hungarian: "nyolc" },
  { numeral: "9", hungarian: "kilenc" },
];

const largerNumbers: NumberRow[] = [
  { numeral: "10", hungarian: "tíz" },
  { numeral: "20", hungarian: "húsz" },
  { numeral: "30", hungarian: "harminc" },
  { numeral: "40", hungarian: "negyven" },
  { numeral: "50", hungarian: "ötven" },
  { numeral: "60", hungarian: "hatvan" },
  { numeral: "70", hungarian: "hetven" },
  { numeral: "80", hungarian: "nyolcvan" },
  { numeral: "90", hungarian: "kilencven" },
  { numeral: "100", hungarian: "száz" },
  { numeral: "1000", hungarian: "ezer" },
];

const allNumbers: NumberRow[] = [...numbersZeroToNine, ...largerNumbers];

const kettoRows: BilingualRow[] = [
  {
    english: "How many apples are there? Two.",
    hungarian: "Hány alma van? Kettő.",
  },
  {
    english: "One, two, three...",
    hungarian: "Egy, kettő, három...",
  },
  {
    english: "I only want two [of them].",
    hungarian: "Csak kettőt kérek.",
  },
];

const ketRows: BilingualRow[] = [
  {
    english: "I'd like two coffees.",
    hungarian: "Két kávét kérek.",
  },
  {
    english: "I ran two kilometers.",
    hungarian: "Két kilométert futottam.",
  },
  {
    english: "There are two eggs in the fridge.",
    hungarian: "Két tojás van a hűtőben.",
  },
];

const howOftenRows: BilingualRow[] = [
  {
    english: "I exercise four times a week.",
    hungarian: "Hetente négyszer sportolok.",
  },
  {
    english: "I compete two times a year.",
    hungarian: "Kétszer versenyzem egy év.",
  },
  {
    english: "I dance three times a week.",
    hungarian: "Háromszor táncolok egy hét.",
  },
  {
    english: "I eat five times a day.",
    hungarian: "Naponta ötször eszem.",
  },
];

const BilingualZebraRows = ({ rows }: { rows: BilingualRow[] }) => {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table className="w-full table-fixed text-sm">
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={`${row.english}-${index}`}
              className={`${index % 2 === 0 ? "bg-muted/40" : "bg-background"} ${row.monospace ? "font-mono" : ""}`}
            >
              <TableCell className={`w-1/2 py-2 pr-2 ${row.emphasizeEnglish ? "font-medium" : ""}`}>
                {row.english}
              </TableCell>
              <TableCell className="w-1/2 py-2 pl-2 text-right">{row.hungarian}</TableCell>
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

const Numbers = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 wrap-break-word">
      <div className="space-y-8 md:grid md:grid-cols-[220px_minmax(0,1fr)] md:items-start md:gap-8 md:space-y-0">
        <aside className="md:sticky md:top-6">
          <GrammarLessonLinks compact vertical />
        </aside>
        <div className="min-w-0 space-y-8 sm:space-y-12">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Numbers</h1>
          </div>

          <Card>
            <CardHeader>
              <BilingualCardHeader english="Numbers" hungarian="Számok" />
              <CardDescription className="pt-2 text-xs sm:text-sm">
                In Hungarian, counted nouns are not pluralized (e.g., <strong>két alma</strong>, not{" "}
                <strong>két almák</strong>).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg">
                <Table className="w-full table-fixed">
                  <TableBody>
                    {allNumbers.map((row, index) => (
                      <TableRow key={row.numeral} className={index % 2 === 0 ? "bg-muted/40" : "bg-background"}>
                        <TableCell className="w-1/2 py-2 pr-2 text-right font-semibold">{row.numeral}</TableCell>
                        <TableCell className="w-1/2 py-2 pl-2 text-left">{row.hungarian}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BilingualCardHeader english="Two" hungarian="Két/Kettő" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border-l-4 border-primary bg-muted/40 p-4 text-sm">
                <p>
                  Use <strong>kettő</strong> when the noun is not there, or when you are counting "one, two,
                  three...".
                  </p><p>Use <strong>két</strong> before a noun.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-semibold">kettő</h3>
                <BilingualZebraRows rows={kettoRows} />
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-semibold">két</h3>
                <BilingualZebraRows rows={ketRows} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BilingualCardHeader english="How Often?" hungarian="Milyen gyakran?" />
              <CardDescription className="pt-2 text-xs sm:text-sm">
                Use the suffixes <strong>-szer</strong>, <strong>-szor</strong>, and{" "}
                <strong>-ször</strong> to express "times."
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BilingualZebraRows rows={howOftenRows} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Numbers;
