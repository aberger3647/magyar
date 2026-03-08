import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { HUNGARIAN_ALPHABET } from "@/constants/alphabet"

export default function AlphabetTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px]">Letter</TableHead>
          <TableHead>Letter Name</TableHead>
          <TableHead>Pronunciation Guide</TableHead>
          <TableHead className="text-right">Example</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {HUNGARIAN_ALPHABET.map((row, index) => (
          <TableRow key={index}>
            <TableCell className="font-bold text-xl text-primary underline decoration-muted">
              {row.letter}
            </TableCell>
            <TableCell>({row.name})</TableCell>
            <TableCell>{row.pronunciation}</TableCell>
            <TableCell className="text-right italic">{row.example}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}