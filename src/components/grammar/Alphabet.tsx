import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AlphabetTable from "../AlphabetTable";
import { GrammarLessonLinks } from "./GrammarLessonLinks";

const BilingualCardHeader = ({ english, hungarian }: { english: string; hungarian: string }) => {
  return (
    <CardTitle className="grid grid-cols-2 gap-4 text-xl sm:text-2xl">
      <span>{english}</span>
      <span className="text-right">{hungarian}</span>
    </CardTitle>
  );
};

const Alphabet = () => {
  return (
    <div className="mx-auto w-full max-w-6xl overflow-x-hidden px-4 py-6 sm:px-6 wrap-break-word">
      <div className="space-y-8 md:grid md:grid-cols-[220px_1fr] md:items-start md:gap-8 md:space-y-0">
        <aside className="md:sticky md:top-6">
          <GrammarLessonLinks compact vertical />
        </aside>
        <div className="space-y-8 sm:space-y-12">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Alphabet and Pronunciation</h1>
          </div>

          <Card>
            <CardHeader>
              <BilingualCardHeader english="The Hungarian Alphabet" hungarian="A magyar ábécé" />
            </CardHeader>
            <CardContent className="min-w-0">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[640px]">
                  <AlphabetTable />
                </div>
              </div>
              <div className="mt-6 rounded-md bg-muted p-4 text-sm italic wrap-break-word">
                Note: The * letters (Q, W, X, Y) generally only occur in foreign words or traditional family names.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Alphabet;
