import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GrammarLessonLinks } from "./GrammarLessonLinks";

const holOnExamples = ["ágyon", "asztalon", "polcon", "repülőtéren"];
const holBanExamples = ["szobában", "táskában"];
const holNalExamples = ["fodrásznál", "a barátomnál", "Máténál", "masszőrnél"];

const hovaRaExamples = ["ágyra", "asztalra", "polcra", "repülőtérre"];
const hovaBaExamples = ["szobába", "táskába"];
const hovaHozExamples = ["fodrászhoz", "a barátnőmhöz", "Mátéhoz", "masszőrhöz"];

const ExampleChips = ({ examples }: { examples: string[] }) => (
  <ul className="flex flex-wrap gap-2">
    {examples.map((example) => (
      <li
        key={example}
        className="rounded-md border bg-muted/40 px-3 py-1.5 font-mono text-sm"
      >
        {example}
      </li>
    ))}
  </ul>
);

const BilingualCardHeader = ({ english, hungarian }: { english: string; hungarian: string }) => (
  <CardTitle className="grid grid-cols-2 gap-4 text-xl sm:text-2xl">
    <span>{english}</span>
    <span className="text-right">{hungarian}</span>
  </CardTitle>
);

const Location = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 wrap-break-word">
      <div className="space-y-8 md:grid md:grid-cols-[220px_minmax(0,1fr)] md:items-start md:gap-8 md:space-y-0">
        <aside className="md:sticky md:top-6">
          <GrammarLessonLinks compact vertical />
        </aside>
        <div className="min-w-0 space-y-8 sm:space-y-12">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Location</h1>
            <p className="text-muted-foreground">
              Suffixes for answering <em>hol?</em> (where?) and <em>hova?</em> (where to?).
            </p>
          </div>

          <Card>
            <CardHeader>
              <BilingualCardHeader english="Where?" hungarian="Hol?" />
              <CardDescription>
                Answer <em>hol</em> with <strong>-n / -on / -en / -ön</strong>,{" "}
                <strong>-ban / -ben</strong>, or <strong>-nál / -nél</strong> depending on what you
                are referring to.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-sm leading-relaxed sm:text-base">
              <div className="space-y-3">
                <p>
                  <strong>-n / -on / -en / -ön</strong> — surfaces, open spaces, events, and some
                  institutions
                </p>
                <ExampleChips examples={holOnExamples} />
              </div>
              <div className="space-y-3">
                <p>
                  <strong>-ban / -ben</strong> — closed spaces and 3D objects
                </p>
                <ExampleChips examples={holBanExamples} />
              </div>
              <div className="space-y-3">
                <p>
                  <strong>-nál / -nél</strong> — at a person&apos;s place (the hairdresser&apos;s,
                  Máté&apos;s place, etc.)
                </p>
                <ExampleChips examples={holNalExamples} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BilingualCardHeader english="Where to?" hungarian="Hova?" />
              <CardDescription>
                Answer <em>hova</em> with <strong>-ra / -re</strong>, <strong>-ba / -be</strong>, or{" "}
                <strong>-hoz / -hez / -höz</strong> depending on what you are referring to.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-sm leading-relaxed sm:text-base">
              <div className="space-y-3">
                <p>
                  <strong>-ra / -re</strong> — surfaces, open spaces, and some institutions
                </p>
                <ExampleChips examples={hovaRaExamples} />
              </div>
              <div className="space-y-3">
                <p>
                  <strong>-ba / -be</strong> — closed places and 3D objects
                </p>
                <ExampleChips examples={hovaBaExamples} />
              </div>
              <div className="space-y-3">
                <p>
                  <strong>-hoz / -hez / -höz</strong> — going to a person&apos;s place (the
                  hairdresser&apos;s, Máté&apos;s place, etc.)
                </p>
                <ExampleChips examples={hovaHozExamples} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Location;
