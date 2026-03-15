import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GrammarLessonLinks } from "./GrammarLessonLinks";

const vowelChipClassName =
  "h-12 w-12 flex items-center justify-center rounded-md border bg-muted/30 text-xl font-bold";

const VowelChips = ({ vowels }: { vowels: string[] }) => (
  <div className="flex flex-wrap gap-2">
    {vowels.map((vowel) => (
      <div key={vowel} className={vowelChipClassName}>
        {vowel}
      </div>
    ))}
  </div>
);

const BilingualCardHeader = ({ english, hungarian }: { english: string; hungarian: string }) => {
  return (
    <CardTitle className="grid grid-cols-2 gap-4 text-xl sm:text-2xl">
      <span>{english}</span>
      <span className="text-right">{hungarian}</span>
    </CardTitle>
  );
};

const VowelHarmony = () => {
  return (
    <div className="mx-auto w-full max-w-6xl overflow-x-hidden px-4 py-6 sm:px-6 wrap-break-word">
      <div className="space-y-8 md:grid md:grid-cols-[220px_1fr] md:items-start md:gap-8 md:space-y-0">
        <aside className="md:sticky md:top-6">
          <GrammarLessonLinks compact vertical />
        </aside>
        <div className="space-y-8 sm:space-y-12">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Vowel Harmony</h1>
          </div>

          <Card>
            <CardHeader>
              <BilingualCardHeader english="Vowel Harmony" hungarian="Magánhangzó-harmónia" />
            </CardHeader>
            <CardContent className="min-w-0 space-y-8 sm:space-y-10">
              <div className="space-y-3 text-sm leading-relaxed wrap-break-word">
                <p>
                  Hungarian is an agglutinative language. Words and sentences are formed by
                  adding suffixes.
                </p>
                <p>
                  If a word ends in a vowel, just add the ending. If a word ends in a consonant, add the
                  ending with a linking vowel according to vowel harmony.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold uppercase tracking-widest text-muted-foreground wrap-break-word">
                    Back Vowels (Mély)
                  </h3>
                  <VowelChips vowels={["a", "á", "o", "ó", "u", "ú"]} />
                  <p className="text-sm italic wrap-break-word">
                    Think of the word: <strong>Autó</strong>
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold uppercase tracking-widest text-muted-foreground wrap-break-word">
                    Front Vowels (Magas)
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <VowelChips vowels={["e", "é", "i", "í"]} />
                      <p className="mb-2 text-xs font-semibold opacity-70">Unrounded</p>
                    </div>
                    <div>
                      <VowelChips vowels={["ö", "ő", "ü", "ű"]} />
                      <p className="mb-2 text-xs font-semibold opacity-70">Rounded</p>
                    </div>
                  </div>
                  <p className="text-sm italic wrap-break-word">
                    Think of the word: <strong>Teniszütő</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">The Neutral "i" and "í"</CardTitle>
            </CardHeader>
            <CardContent className="min-w-0">
              <div className="grid grid-cols-1 gap-6 leading-relaxed lg:grid-cols-2">
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="mb-2 font-bold">Rule: Back Vowels Win</p>
                  <p className="text-sm wrap-break-word">
                    If a word contains back vowels followed by neutral vowels, the word is treated as{" "}
                    <strong>Back Vowel</strong>.
                  </p>
                  <p className="mt-3 rounded border bg-background p-2 font-mono text-sm wrap-break-word">
                    taxi + -val = <strong>taxival</strong>
                  </p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="mb-2 font-bold">Rule: Front Vowels Default</p>
                  <p className="text-sm wrap-break-word">
                    If a word contains <strong>only</strong> neutral vowels (and no back vowels), it is
                    treated as <strong>Front Vowel</strong>.
                  </p>
                  <p className="mt-3 rounded border bg-background p-2 font-mono text-sm wrap-break-word">
                    bicikli + -vel = <strong>biciklivel</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

         
        </div>
      </div>
    </div>
  );
};

export default VowelHarmony;
