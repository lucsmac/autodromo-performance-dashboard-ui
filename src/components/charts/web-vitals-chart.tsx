import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { PerformanceMetric, Period } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WebVitalsChartProps {
  metrics: PerformanceMetric[];
  title: string;
  description?: string;
  period: Period;
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

export function WebVitalsChart({
  metrics,
  title,
  description,
  period,
}: WebVitalsChartProps) {
  const metricKeys = [
    { key: "cls", name: "CLS", color: "#8884d8", unit: "", threshold: 0.1, goodThreshold: 0.1, needsThreshold: true },
    { key: "lcp", name: "LCP", color: "#82ca9d", unit: "ms", threshold: 2500, goodThreshold: 2500, needsThreshold: true },
    { key: "fid", name: "FID", color: "#ffc658", unit: "ms", threshold: 100, goodThreshold: 100, needsThreshold: true },
    { key: "fcp", name: "FCP", color: "#ff8042", unit: "ms", threshold: 1800, goodThreshold: 1800, needsThreshold: true },
    { key: "ttfb", name: "TTFB", color: "#ff7300", unit: "ms", threshold: 800, goodThreshold: 500, needsThreshold: true },
  ];

  // Dados para o gráfico
  const chartData = metrics.map((metric) => {
    const webVitals = metric.coreWebVitals;
    return {
      name: formatDateByPeriod(metric.timestamp, period),
      timestamp: metric.timestamp,
      cls: webVitals.cls,
      lcp: webVitals.lcp,
      fid: webVitals.fid,
      fcp: webVitals.fcp,
      ttfb: webVitals.ttfb,
    };
  });

  // Avaliação de cada métrica baseado nos limites
  const evaluateMetric = (metricKey: string, value: number) => {
    const metric = metricKeys.find((m) => m.key === metricKey);
    if (!metric || !metric.needsThreshold) return "Sem avaliação";

    if (value <= metric.goodThreshold) return "Bom";
    if (value <= metric.threshold * 1.5) return "Precisa de melhoria";
    return "Ruim";
  };

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todos</TabsTrigger>
            {metricKeys.map((metric) => (
              <TabsTrigger key={metric.key} value={metric.key}>
                {metric.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => {
                      const item = chartData.find((item) => item.name === value);
                      return item
                        ? `Data: ${format(new Date(item.timestamp), "dd/MM/yyyy HH:mm", { locale: ptBR })}`
                        : value;
                    }}
                    formatter={(value, name) => {
                      const metric = metricKeys.find((m) => m.key === name);
                      const evaluation = evaluateMetric(name as string, Number(value));
                      return [
                        `${Number(value).toFixed(2)}${metric?.unit || ""}`,
                        `${metric?.name || name} (${evaluation})`,
                      ];
                    }}
                  />
                  <Legend />
                  {metricKeys.map((metric) => (
                    <Line
                      key={metric.key}
                      type="monotone"
                      dataKey={metric.key}
                      name={metric.name}
                      stroke={metric.color}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {metricKeys.map((metric) => (
            <TabsContent key={metric.key} value={metric.key}>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => {
                        const item = chartData.find((item) => item.name === value);
                        return item
                          ? `Data: ${format(new Date(item.timestamp), "dd/MM/yyyy HH:mm", { locale: ptBR })}`
                          : value;
                      }}
                      formatter={(value, name) => {
                        if (name === metric.key) {
                          const evaluation = evaluateMetric(metric.key, Number(value));
                          return [
                            `${Number(value).toFixed(2)}${metric.unit}`,
                            `${metric.name} (${evaluation})`,
                          ];
                        }
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey={metric.key}
                      name={metric.name}
                      stroke={metric.color}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
