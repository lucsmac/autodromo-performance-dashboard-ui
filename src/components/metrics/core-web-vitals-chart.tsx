"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  TooltipProps,
  ReferenceLine,
} from "recharts";
import { format, subDays, subHours } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CoreWebVitalsChartProps {
  period: string;
}

export function CoreWebVitalsChart({ period = "day" }: CoreWebVitalsChartProps) {
  // Gerar dados de exemplo baseados no período selecionado
  const data = React.useMemo(() => {
    const now = new Date();
    let points: { date: Date; cls: number; lcp: number; fid: number }[] = [];

    switch (period) {
      case "hour":
        // Dados por minuto nas últimas 1 hora
        points = Array.from({ length: 60 }, (_, i) => {
          const date = subHours(now, 1);
          date.setMinutes(date.getMinutes() + i);
          return {
            date,
            cls: 0.01 + Math.random() * 0.05,
            lcp: 1.5 + Math.random() * 1.5,
            fid: 10 + Math.random() * 40,
          };
        });
        break;
      case "day":
        // Dados por hora nas últimas 24 horas
        points = Array.from({ length: 24 }, (_, i) => {
          const date = subDays(now, 1);
          date.setHours(date.getHours() + i);
          return {
            date,
            cls: 0.01 + Math.random() * 0.05,
            lcp: 1.5 + Math.random() * 1.5,
            fid: 10 + Math.random() * 40,
          };
        });
        break;
      case "week":
        // Dados por dia nos últimos 7 dias
        points = Array.from({ length: 7 }, (_, i) => {
          return {
            date: subDays(now, 6 - i),
            cls: 0.01 + Math.random() * 0.05,
            lcp: 1.5 + Math.random() * 1.5,
            fid: 10 + Math.random() * 40,
          };
        });
        break;
      case "month":
        // Dados por semana nos últimos 4 meses
        points = Array.from({ length: 30 }, (_, i) => {
          return {
            date: subDays(now, 29 - i),
            cls: 0.01 + Math.random() * 0.05,
            lcp: 1.5 + Math.random() * 1.5,
            fid: 10 + Math.random() * 40,
          };
        });
        break;
    }

    return points;
  }, [period]);

  // Formatar os dados para o gráfico
  const formattedData = data.map((item) => ({
    date: item.date.toISOString(),
    cls: Number(item.cls.toFixed(3)),
    lcp: Number(item.lcp.toFixed(2)),
    fid: Math.round(item.fid),
  }));

  // Configurar formatação de eixo X baseado no período
  const formatXAxis = (dateString: string) => {
    const date = new Date(dateString);
    switch (period) {
      case "hour":
        return format(date, "HH:mm");
      case "day":
        return format(date, "HH:mm");
      case "week":
        return format(date, "dd/MM");
      case "month":
        return format(date, "dd/MM");
      default:
        return format(date, "dd/MM");
    }
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      let formattedDate;

      switch (period) {
        case "hour":
          formattedDate = format(date, "HH:mm", { locale: ptBR });
          break;
        case "day":
          formattedDate = format(date, "dd/MM HH:mm", { locale: ptBR });
          break;
        case "week":
        case "month":
          formattedDate = format(date, "dd 'de' MMMM", { locale: ptBR });
          break;
      }

      return (
        <div className="bg-background border rounded-md shadow-sm p-3">
          <p className="font-medium text-sm mb-2">{formattedDate}</p>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center gap-2 py-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-muted-foreground">
                {entry.name}: {entry.value}
                {entry.name === "LCP" ? "s" : entry.name === "FID" ? "ms" : ""}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={formattedData}
        margin={{
          top: 10,
          right: 30,
          left: 10,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="date"
          tickFormatter={formatXAxis}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          yAxisId="left"
          orientation="left"
          domain={[0, 0.1]}
          tick={{ fontSize: 12 }}
          label={{ value: "CLS", angle: -90, position: "insideLeft", offset: -5 }}
        />
        <YAxis
          yAxisId="middle"
          orientation="left"
          domain={[0, 4]}
          tick={{ fontSize: 12 }}
          label={{ value: "LCP (s)", angle: -90, position: "insideLeft", offset: 40 }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[0, 100]}
          tick={{ fontSize: 12 }}
          label={{ value: "FID (ms)", angle: -90, position: "insideRight", offset: 5 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <ReferenceLine yAxisId="left" y={0.1} stroke="red" strokeDasharray="3 3" label="CLS Ruim" />
        <ReferenceLine yAxisId="middle" y={2.5} stroke="red" strokeDasharray="3 3" label="LCP Ruim" />
        <ReferenceLine yAxisId="right" y={100} stroke="red" strokeDasharray="3 3" label="FID Ruim" />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="cls"
          name="CLS"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={{ stroke: '#8b5cf6', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          yAxisId="middle"
          type="monotone"
          dataKey="lcp"
          name="LCP"
          stroke="#f97316"
          strokeWidth={2}
          dot={{ stroke: '#f97316', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="fid"
          name="FID"
          stroke="#0ea5e9"
          strokeWidth={2}
          dot={{ stroke: '#0ea5e9', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
