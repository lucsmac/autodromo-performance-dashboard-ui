"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  TooltipProps,
  BarChart,
  Bar,
} from "recharts";
import { format, subDays, subHours, subMonths, subWeeks } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MetricsChartProps {
  period: string;
  metricType?: "both" | "responseTime" | "score";
}

export function MetricsChart({
  period = "day",
  metricType = "both"
}: MetricsChartProps) {
  // Gerar dados de exemplo baseados no período selecionado
  const data = React.useMemo(() => {
    const now = new Date();
    let points: { date: Date; responseTime: number; score: number }[] = [];

    switch (period) {
      case "hour":
        // Dados por minuto nas últimas 1 hora
        points = Array.from({ length: 60 }, (_, i) => {
          const date = subHours(now, 1);
          date.setMinutes(date.getMinutes() + i);
          return {
            date,
            responseTime: 350 + Math.random() * 200,
            score: 75 + Math.random() * 25,
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
            responseTime: 350 + Math.random() * 200,
            score: 75 + Math.random() * 25,
          };
        });
        break;
      case "week":
        // Dados por dia nos últimos 7 dias
        points = Array.from({ length: 7 }, (_, i) => {
          return {
            date: subDays(now, 6 - i),
            responseTime: 350 + Math.random() * 200,
            score: 75 + Math.random() * 25,
          };
        });
        break;
      case "month":
        // Dados por semana nos últimos 4 meses
        points = Array.from({ length: 30 }, (_, i) => {
          return {
            date: subDays(now, 29 - i),
            responseTime: 350 + Math.random() * 200,
            score: 75 + Math.random() * 25,
          };
        });
        break;
    }

    return points;
  }, [period]);

  // Formatar os dados para o gráfico
  const formattedData = data.map((item) => ({
    date: item.date.toISOString(),
    responseTime: Math.round(item.responseTime),
    score: Math.round(item.score),
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
                {entry.name === "Tempo de Resposta" ? "ms" : ""}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (metricType === "both") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
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
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
            label={{ value: "Score", angle: -90, position: "insideLeft", offset: -5 }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 800]}
            tick={{ fontSize: 12 }}
            label={{ value: "ms", angle: -90, position: "insideRight", offset: 10 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="score"
            name="Score"
            stroke="#4f46e5"
            fill="#4f46e5"
            fillOpacity={0.2}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="responseTime"
            name="Tempo de Resposta"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  } else if (metricType === "responseTime") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
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
            domain={[0, 800]}
            tick={{ fontSize: 12 }}
            label={{ value: "ms", angle: -90, position: "insideLeft", offset: -5 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="responseTime"
            name="Tempo de Resposta"
            fill="#10b981"
          />
        </BarChart>
      </ResponsiveContainer>
    );
  } else {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
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
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="score"
            name="Score"
            fill="#4f46e5"
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
