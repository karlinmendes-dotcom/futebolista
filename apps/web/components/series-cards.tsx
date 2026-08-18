import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { SERIES, type SerieCode } from "@/lib/brasileirao";

export function SeriesCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(Object.keys(SERIES) as SerieCode[]).map((code) => {
        const serie = SERIES[code];
        return (
          <Link key={code} href={`/tabelas/${code}`} className="group">
            <Card className="h-full transition-colors hover:border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {serie.shortName}
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </CardTitle>
                <CardDescription>{serie.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                {serie.grouped ? "Competição agrupada por regiões" : "Pontos corridos"}{" "}
                · Série {serie.code.toUpperCase()}
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
