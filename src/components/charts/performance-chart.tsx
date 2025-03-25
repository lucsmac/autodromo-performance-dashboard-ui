import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { PerformanceMetric, Period } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PerformanceChartProps {
  metrics: PerformanceMetric[];
  title: string;
  description?: string;
  period: Period;
  dataKey: keyof Pick<PerformanceMetric, "responseTime" | "lighthouseScore">;
}

function formatDateByPeriod(dateString: string, period: Period): string {
  const date = new Date(dateString);
  switch (period) {
    case "hour":
      return format(date, "HH:mm", { locale: ptBR });
    case "day":
      return format(date, "HH:mm", { locale: ptBR });
    case "week":
      return format(date, "EEE", { locale: ptBR });
    case "month":
      return format(date, "dd/MM", { locale: ptBR });
    default:
      return format(date, "dd/MM HH:mm", { locale: ptBR });
  }
}

export function PerformanceChart({
  metrics,
  title,
  description,
  period,
  dataKey,
}: PerformanceChartProps) {
  // Preparar dados para o gráfico
  const chartData = metrics.map((metric) => ({
    name: formatDateByPeriod(metric.timestamp, period),
    valor: dataKey === "responseTime" ? metric.responseTime : metric.lighthouseScore,
    media: 0, // Será calculado abaixo
    timestamp: metric.timestamp,
  }));

  // Calcular a média
  const sum = chartData.reduce((acc, item) => acc + item.valor, 0);
  const avg = metrics.length > 0 ? sum / metrics.length : 0;

  // Atualizar o valor da média
  chartData.forEach((item) => {
    item.media = avg;
  });

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => {
                  const item = chartData.find((item) => item.name === value);
                  return item
                    ? `Data: ${format(new Date(item.timestamp), "dd/MM/yyyy HH:mm", { locale: ptBR })}`
                    : value;
                }}
                formatter={(value, name) => {
                  if (name === "valor") {
                    return [
                      dataKey === "responseTime"
                        ? `${Number(value).toFixed(2)} ms`
                        : Number(value).toFixed(0),
                      dataKey === "responseTime" ? "Tempo de Resposta" : "Score Lighthouse"
                    ];
                  } else if (name === "media") {
                    return [
                      dataKey === "responseTime"
                        ? `${Number(value).toFixed(2)} ms`
                        : Number(value).toFixed(0),
                      "Média"
                    ];
                  }
                  return [value, name];
                }}
              />
              <Legend />
              <Bar
                dataKey="valor"
                fill="#8884d8"
                name={dataKey === "responseTime" ? "Tempo de Resposta" : "Score Lighthouse"}
              />
              <Line
                type="monotone"
                dataKey="media"
                stroke="#ff7300"
                name="Média"
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
