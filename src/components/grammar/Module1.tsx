import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AlphabetTable from '../AlphabetTable';

const HungarianModuleOne = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-12">
      {/* HEADER SECTION */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Alphabet, Pronunciation and Vowel Harmony</h1>
      </div>

      {/* ALPHABET & PRONUNCIATION CARD */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">The Hungarian Alphabet</CardTitle>
        </CardHeader>
        <CardContent>
         <AlphabetTable/>
          <div className="mt-6 p-4 bg-muted rounded-md text-sm italic">
            Note: The * letters (Q, W, X, Y) generally only occur in foreign words or traditional family names.
          </div>
        </CardContent>
      </Card>

      {/* VOWEL HARMONY CARD */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Vowel Harmony</CardTitle>
        </CardHeader>
        <CardContent className="space-y-10">
          
          {/* Harmony Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Back Vowels */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold uppercase tracking-widest text-muted-foreground">Back Vowels (Mély)</h3>
              <div className="flex flex-wrap gap-2">
                {['a', 'á', 'o', 'ó', 'u', 'ú'].map(v => (
                  <div key={v} className="h-12 w-12 flex items-center justify-center rounded-md border bg-card text-xl font-bold shadow-sm">
                    {v}
                  </div>
                ))}
              </div>
              <p className="text-sm italic">Think of the word: <strong>Autó</strong></p>
            </div>

            {/* Front Vowels */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold uppercase tracking-widest text-muted-foreground">Front Vowels (Magas)</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold mb-2 opacity-70">Unrounded:</p>
                  <div className="flex flex-wrap gap-2">
                    {['e', 'é', 'i', 'í'].map(v => (
                      <div key={v} className="h-12 w-12 flex items-center justify-center rounded-md border bg-card text-xl font-bold shadow-sm">
                        {v}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-2 opacity-70">Rounded:</p>
                  <div className="flex flex-wrap gap-2">
                    {['ö', 'ő', 'ü', 'ű'].map(v => (
                      <div key={v} className="h-12 w-12 flex items-center justify-center rounded-md border bg-card text-xl font-bold shadow-sm">
                        {v}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm italic">Think of the word: <strong>Teniszütő</strong></p>
            </div>
          </div>

          <hr />

          {/* Neutral Rule Explanation */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">The Neutral "i" and "í"</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 leading-relaxed">
              <div className="p-4 border rounded-lg bg-muted/30">
                <p className="font-bold mb-2">Rule: Back Vowels Win</p>
                <p className="text-sm">
                  If a word contains back vowels followed by neutral vowels, the word is treated as <strong>Back Vowel</strong>.
                </p>
                <p className="mt-3 text-sm font-mono bg-background p-2 rounded border">
                  taxi + -val = <strong>taxival</strong>
                </p>
              </div>
              <div className="p-4 border rounded-lg bg-muted/30">
                <p className="font-bold mb-2">Rule: Front Vowels Default</p>
                <p className="text-sm">
                  If a word contains <strong>only</strong> neutral vowels (and no back vowels), it is treated as <strong>Front Vowel</strong>.
                </p>
                <p className="mt-3 text-sm font-mono bg-background p-2 rounded border">
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

export default HungarianModuleOne;