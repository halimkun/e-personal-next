import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getDate, getTime } from "@/lib/date"

interface SuratInternalProps {
  data: any[];
}

const TabelSuratInternal = ({ data }: SuratInternalProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nomor</TableHead>
          <TableHead>PJ</TableHead>
          <TableHead>Perihal</TableHead>
          <TableHead>Tempat</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((d: any) => (
          <TableRow key={d.no_surat} className="group">
            <TableCell className="md:whitespace-nowrap">
              <Badge variant="default">{d.no_surat}</Badge>
            </TableCell>
            <TableCell>
              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="cursor-pointer group-hover:border-primary">
                      {d.pj}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>{d.pj_detail ? d.pj_detail.nama : d.pj}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            <TableCell>
              {d.perihal.length > 50 ? d.perihal.substring(0, 80) + ' . . .' : d.perihal}
            </TableCell>
            <TableCell>{d.tempat}</TableCell>
            <TableCell className="text-right">
              <div className="md:whitespace-nowrap">{getDate(d.tanggal)}</div>
              <div className="md:whitespace-nowrap">{getTime(d.tanggal)}</div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default TabelSuratInternal;