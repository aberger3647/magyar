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

const Possessives = () => {
  return (
    <div className="mx-auto w-full max-w-6xl overflow-x-hidden px-4 py-6 sm:px-6 wrap-break-word">
      <div className="space-y-8 md:grid md:grid-cols-[220px_1fr] md:items-start md:gap-8 md:space-y-0">
        <aside className="md:sticky md:top-6">
          <GrammarLessonLinks compact vertical />
        </aside>
        <div className="space-y-8 sm:space-y-12">
          {/* HEADER SECTION */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Possessives</h1>
          </div>

          {/* CORE RULE CARD */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">The Lengthening Rule</CardTitle>
            </CardHeader>
            <CardContent>
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
          </Card>

          {/* SINGULAR POSSESSION CARD */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Singular Possession (One Item)</CardTitle>
              <CardDescription>Adding suffixes based on vowel harmony groups.</CardDescription>
            </CardHeader>
            <CardContent className="min-w-0">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[720px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Person</TableHead>
                        <TableHead>Back (asztal)</TableHead>
                        <TableHead>Front (szék)</TableHead>
                        <TableHead className="text-right">Rounded Front (főnök)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-bold">én (my)</TableCell>
                        <TableCell>asztalom</TableCell>
                        <TableCell>székem</TableCell>
                        <TableCell className="text-right font-medium text-primary">főnököm</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-bold">te (your)</TableCell>
                        <TableCell>asztalod</TableCell>
                        <TableCell>széked</TableCell>
                        <TableCell className="text-right font-medium text-primary">főnököd</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-bold">ő / Ön (his/her)</TableCell>
                        <TableCell>asztala</TableCell>
                        <TableCell>széke</TableCell>
                        <TableCell className="text-right font-medium text-primary">főnöke</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PLURAL POSSESSION CARD */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Plural Possession (Our, Your, Their)</CardTitle>
              <CardDescription>Suffixes for multiple owners of a singular object.</CardDescription>
            </CardHeader>
            <CardContent className="min-w-0">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[720px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Person</TableHead>
                        <TableHead>Back (iroda)</TableHead>
                        <TableHead>Front (szék)</TableHead>
                        <TableHead className="text-right">Rounded Front (főnök)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-bold">mi (our)</TableCell>
                        <TableCell>irodánk</TableCell>
                        <TableCell>székünk</TableCell>
                        <TableCell className="text-right font-medium text-primary">főnökünk</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-bold">ti (your pl.)</TableCell>
                        <TableCell>irodátok</TableCell>
                        <TableCell>széketek</TableCell>
                        <TableCell className="text-right font-medium text-primary text-nowrap">főnökötök</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-bold">ők (their)</TableCell>
                        <TableCell>irodájuk</TableCell>
                        <TableCell>székük</TableCell>
                        <TableCell className="text-right font-medium text-primary text-nowrap">főnökük</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ADDITIONAL EXAMPLES */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <CardHeader><CardTitle className="text-sm uppercase opacity-60">Family</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-1">
                <p><strong>anyukám</strong> (my mom)</p>
                <p><strong>apukád</strong> (your dad)</p>
                <p><strong>férje</strong> (her husband)</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm uppercase opacity-60">Everyday</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-1">
                <p><strong>autóm</strong> (my car)</p>
                <p><strong>táskád</strong> (your bag)</p>
                <p><strong>irodája</strong> (his office)</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm uppercase opacity-60">Pets</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-1">
                <p><strong>macskám</strong> (my cat)</p>
                <p><strong>kutyád</strong> (your dog)</p>
                <p><strong>hörcsögöm</strong> (my hamster)</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Possessives;