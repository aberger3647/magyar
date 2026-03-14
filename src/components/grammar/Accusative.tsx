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
import { GrammarLessonLinks } from "./GrammarLessonLinks";

type ExampleRow = {
  english: string;
  hungarian: string;
};

const directObjectRows: ExampleRow[] = [
  { english: "I see the dog.", hungarian: "Látom a kutyát." },
  { english: "She reads a book.", hungarian: "Olvas egy könyvet." },
  { english: "We are drinking coffee.", hungarian: "Kávét iszunk." },
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

const BilingualCardHeader = ({ english, hungarian }: { english: string; hungarian: string }) => {
  return (
    <CardTitle className="grid grid-cols-2 gap-4 text-xl sm:text-2xl">
      <span>{english}</span>
      <span className="text-right">{hungarian}</span>
    </CardTitle>
  );
};

const Accusative = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 wrap-break-word">
      <div className="space-y-8 md:grid md:grid-cols-[220px_minmax(0,1fr)] md:items-start md:gap-8 md:space-y-0">
        <aside className="md:sticky md:top-6">
          <GrammarLessonLinks compact vertical />
        </aside>
        <div className="min-w-0 space-y-8 sm:space-y-12">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Accusative Case</h1>
          </div>

          <Card>
            <CardHeader>
              <BilingualCardHeader english="Accusative Case" hungarian="Tárgyeset" />
              <CardDescription>
                Use the accusative to mark the <strong>direct object</strong>: the person or thing that
                directly receives the action.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border-l-4 border-primary bg-muted/40 p-4 text-sm">
                <p>
                  Add <strong>-t</strong> after words ending in a vowel. For words ending in a consonant,
                  use the correct linking vowel before <strong>-t</strong>.
                </p>
              </div>
              <div className="space-y-4 text-sm leading-relaxed sm:text-base">
                <p>
                  An <strong>object</strong> is the person or thing that receives the action of a verb.
                </p>
                <p>
                  In the sentence &quot;I read <strong>a book</strong>,&quot; the phrase &quot;a book&quot; is
                  the object.
                </p>
                <p>
                  Use the accusative when the verb acts on something directly: read a book, drink coffee,
                  see the dog.
                </p>
                <p>
                  If the verb does not take a direct object (for example, sleep, arrive, run), there is no
                  accusative object to mark.
                </p>
              </div>
              <ExampleTable rows={directObjectRows} />
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Accusative;
