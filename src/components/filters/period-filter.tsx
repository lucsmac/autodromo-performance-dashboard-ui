import React from "react";
import { startOfHour, startOfDay, startOfWeek, startOfMonth, subHours, subDays, subWeeks, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Period, DateRange } from "@/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

interface PeriodFilterProps {
  period: Period;
  setPeriod: (period: Period) => void;
  dateRange: DateRange;
  setDateRange: (dateRange: DateRange) => void;
}

export function PeriodFilter({
  period,
  setPeriod,
  dateRange,
  setDateRange,
}: PeriodFilterProps) {
  const now = new Date();

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);

    // Ajustar o intervalo de data com base no período selecionado
    let from: Date;

    switch (newPeriod) {
      case "hour":
        from = subHours(startOfHour(now), 12); // Últimas 12 horas
        break;
      case "day":
        from = subDays(startOfDay(now), 1); // Último dia
        break;
      case "week":
        from = subWeeks(startOfWeek(now, { weekStartsOn: 1 }), 1); // Última semana
        break;
      case "month":
        from = subMonths(startOfMonth(now), 1); // Último mês
        break;
      default:
        from = subDays(startOfDay(now), 1);
    }

    setDateRange({ from, to: now });
  };

  const formatDateRange = () => {
    return `${format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} - ${format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}`;
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div>
          <Tabs
            defaultValue={period}
            value={period}
            onValueChange={(value) => handlePeriodChange(value as Period)}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="hour">Hora</TabsTrigger>
              <TabsTrigger value="day">Dia</TabsTrigger>
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="month">Mês</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="min-w-52">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>{formatDateRange()}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="range"
                selected={{
                  from: dateRange.from,
                  to: dateRange.to
                }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to });
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </Card>
  );
}
