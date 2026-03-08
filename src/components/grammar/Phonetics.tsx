import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AlphabetTable from "../AlphabetTable";
import { GrammarLessonLinks } from "./GrammarLessonLinks";

const Phonetics = () => {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 overflow-x-hidden px-4 py-6 sm:space-y-12 sm:px-6 wrap-break-word">
      {/* HEADER SECTION */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Alphabet, Pronunciation and Vowel Harmony
        </h1>
        <GrammarLessonLinks compact />
      </div>

      {/* ALPHABET & PRONUNCIATION CARD */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">The Hungarian Alphabet</CardTitle>
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

      {/* VOWEL HARMONY CARD */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Vowel Harmony</CardTitle>
        </CardHeader>
        <CardContent className="min-w-0 space-y-8 sm:space-y-10">
          {/* Harmony Breakdown */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Back Vowels */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold uppercase tracking-widest text-muted-foreground wrap-break-word">Back Vowels (Mély)</h3>
              <div className="flex flex-wrap gap-2">
                {["a", "á", "o", "ó", "u", "ú"].map((v) => (
                  <div key={v} className="h-12 w-12 flex items-center justify-center rounded-md border bg-card text-xl font-bold shadow-sm">
                    {v}
                  </div>
                ))}
              </div>
              <p className="text-sm italic wrap-break-word">Think of the word: <strong>Autó</strong></p>
            </div>

            {/* Front Vowels */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold uppercase tracking-widest text-muted-foreground wrap-break-word">Front Vowels (Magas)</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold mb-2 opacity-70">Unrounded:</p>
                  <div className="flex flex-wrap gap-2">
                    {["e", "é", "i", "í"].map((v) => (
                      <div key={v} className="h-12 w-12 flex items-center justify-center rounded-md border bg-card text-xl font-bold shadow-sm">
                        {v}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-2 opacity-70">Rounded:</p>
                  <div className="flex flex-wrap gap-2">
                    {["ö", "ő", "ü", "ű"].map((v) => (
                      <div key={v} className="h-12 w-12 flex items-center justify-center rounded-md border bg-card text-xl font-bold shadow-sm">
                        {v}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm italic wrap-break-word">Think of the word: <strong>Teniszütő</strong></p>
            </div>
          </div>

          <hr />

          {/* Neutral Rule Explanation */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">The Neutral "i" and "í"</h3>
            <div className="grid grid-cols-1 gap-6 leading-relaxed lg:grid-cols-2">
              <div className="p-4 border rounded-lg bg-muted/30">
                <p className="font-bold mb-2">Rule: Back Vowels Win</p>
                <p className="text-sm wrap-break-word">
                  If a word contains back vowels followed by neutral vowels, the word is treated as <strong>Back Vowel</strong>.
                </p>
                <p className="mt-3 rounded border bg-background p-2 font-mono text-sm wrap-break-word">
                  taxi + -val = <strong>taxival</strong>
                </p>
              </div>
              <div className="p-4 border rounded-lg bg-muted/30">
                <p className="font-bold mb-2">Rule: Front Vowels Default</p>
                <p className="text-sm wrap-break-word">
                  If a word contains <strong>only</strong> neutral vowels (and no back vowels), it is treated as <strong>Front Vowel</strong>.
                </p>
                <p className="mt-3 rounded border bg-background p-2 font-mono text-sm wrap-break-word">
                  bicikli + -vel = <strong>biciklivel</strong>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Phonetics;
