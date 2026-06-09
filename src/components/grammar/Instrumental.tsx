import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GrammarLessonLinks } from "./GrammarLessonLinks";

type UsageExample = {
  category: string;
  hungarian: string;
  english: string;
};

const usageExamples: UsageExample[] = [
  {
    category: "A partner",
    hungarian: "Alexandrával beszélgetek.",
    english: "I'm talking with Alexandra.",
  },
  {
    category: "Tools or means",
    hungarian: "Szinte soha nem írok kézzel.",
    english: "I almost never write by hand.",
  },
  {
    category: "Means of transport",
    hungarian: "Repülővel megyek Magyarországra.",
    english: "I'm going to Hungary by plane.",
  },
  {
    category: "Worn, eaten, etc. together",
    hungarian: "Kávét kérek két cukorral.",
    english: "I'd like a coffee with two sugars.",
  },
  {
    category: "With some verbs",
    hungarian: "Molekuláris biológiával foglalkozom.",
    english: "I'm working in molecular biology.",
  },
  {
    category: "With some verbs",
    hungarian: "Megismerkedtem egy színésszel.",
    english: "I met an actor.",
  },
];

const BilingualCardHeader = ({ english, hungarian }: { english: string; hungarian: string }) => (
  <CardTitle className="grid grid-cols-2 gap-4 text-xl sm:text-2xl">
    <span>{english}</span>
    <span className="text-right">{hungarian}</span>
  </CardTitle>
);

const Instrumental = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 wrap-break-word">
      <div className="space-y-8 md:grid md:grid-cols-[220px_minmax(0,1fr)] md:items-start md:gap-8 md:space-y-0">
        <aside className="md:sticky md:top-6">
          <GrammarLessonLinks compact vertical />
        </aside>
        <div className="min-w-0 space-y-8 sm:space-y-12">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Instrumental Case</h1>
            <p className="text-muted-foreground">
              How Hungarian expresses &quot;with&quot; using <strong>-val / -vel</strong>.
            </p>
          </div>

          <Card>
            <CardHeader>
              <BilingualCardHeader english="Instrumental Case" hungarian="Eszközhatározó eset" />
              <CardDescription>
                The instrumental case is how Hungarian expresses &quot;with&quot;.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-sm leading-relaxed sm:text-base">
              <div className="space-y-4">
                <p>
                  If the word ends in a consonant, add the ending <strong>-val / -vel</strong>.
                </p>
                <p>
                  <em>Számítógéppel dolgozom.</em> — I&apos;m working with a computer.
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  If the word ends in a vowel, the final consonant is doubled and the{" "}
                  <strong>-v</strong> is dropped.
                </p>
                <p>
                  <em>Biciklivel járok munkába.</em> — I go to work by bike.
                </p>
              </div>
              <div className="rounded-lg border-l-4 border-primary bg-muted/40 p-4 text-sm">
                <p>
                  In words ending in a digraph, the first letter of the digraph doubles.
                </p>
                <p className="mt-2">
                  <em>Farmert hordok bakanccsal.</em> — I&apos;m wearing jeans with boots.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold uppercase tracking-widest text-muted-foreground">
                  Uses
                </h3>
                <ul className="space-y-4">
                  {usageExamples.map((example) => (
                    <li key={example.hungarian} className="space-y-1">
                      <p className="font-medium">{example.category}</p>
                      <p>
                        <em>{example.hungarian}</em> — {example.english}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Instrumental;
