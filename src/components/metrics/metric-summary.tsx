import React from "react";

import { PerformanceMetric } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/metrics/metric-card";

interface MetricSummaryProps {
  metrics: PerformanceMetric[];
  previousMetrics?: PerformanceMetric[];
}

export function MetricSummary({ metrics, previousMetrics }: MetricSummaryProps) {
  if (!metrics.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Métricas</CardTitle>
          <CardDescription>Nenhuma métrica disponível para o período selecionado.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Calcular médias das métricas atuais
  const avgResponseTime = metrics.reduce((acc, metric) => acc + metric.responseTime, 0) / metrics.length;
  const avgLighthouseScore = metrics.reduce((acc, metric) => acc + metric.lighthouseScore, 0) / metrics.length;
  const avgCls = metrics.reduce((acc, metric) => acc + metric.coreWebVitals.cls, 0) / metrics.length;
  const avgLcp = metrics.reduce((acc, metric) => acc + metric.coreWebVitals.lcp, 0) / metrics.length;
  const avgFid = metrics.reduce((acc, metric) => acc + metric.coreWebVitals.fid, 0) / metrics.length;
  const avgFcp = metrics.reduce((acc, metric) => acc + metric.coreWebVitals.fcp, 0) / metrics.length;
  const avgTtfb = metrics.reduce((acc, metric) => acc + metric.coreWebVitals.ttfb, 0) / metrics.length;

  // Calcular médias das métricas anteriores (se disponíveis)
  let prevAvgResponseTime, prevAvgLighthouseScore, prevAvgCls, prevAvgLcp, prevAvgFid, prevAvgFcp, prevAvgTtfb;

  if (previousMetrics && previousMetrics.length > 0) {
    prevAvgResponseTime = previousMetrics.reduce((acc, metric) => acc + metric.responseTime, 0) / previousMetrics.length;
    prevAvgLighthouseScore = previousMetrics.reduce((acc, metric) => acc + metric.lighthouseScore, 0) / previousMetrics.length;
    prevAvgCls = previousMetrics.reduce((acc, metric) => acc + metric.coreWebVitals.cls, 0) / previousMetrics.length;
    prevAvgLcp = previousMetrics.reduce((acc, metric) => acc + metric.coreWebVitals.lcp, 0) / previousMetrics.length;
    prevAvgFid = previousMetrics.reduce((acc, metric) => acc + metric.coreWebVitals.fid, 0) / previousMetrics.length;
    prevAvgFcp = previousMetrics.reduce((acc, metric) => acc + metric.coreWebVitals.fcp, 0) / previousMetrics.length;
    prevAvgTtfb = previousMetrics.reduce((acc, metric) => acc + metric.coreWebVitals.ttfb, 0) / previousMetrics.length;
  }

  // Helper para determinar o tipo do card com base no valor e limites
  const getCardType = (value: number, goodThreshold: number, warningThreshold: number, isGoodWhenLower: boolean = true) => {
    if (isGoodWhenLower) {
      if (value <= goodThreshold) return "success";
      if (value <= warningThreshold) return "warning";
      return "error";
    } else {
      if (value >= goodThreshold) return "success";
      if (value >= warningThreshold) return "warning";
      return "error";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Tempo de Resposta"
        value={avgResponseTime}
        unit="ms"
        previousValue={prevAvgResponseTime}
        isGoodWhenLower={true}
        type={getCardType(avgResponseTime, 300, 700, true)}
      />

      <MetricCard
        title="Lighthouse Score"
        value={avgLighthouseScore}
        previousValue={prevAvgLighthouseScore}
        isGoodWhenLower={false}
        type={getCardType(avgLighthouseScore, 90, 70, false)}
      />

      <MetricCard
        title="CLS"
        value={avgCls}
        description="Cumulative Layout Shift"
        previousValue={prevAvgCls}
        isGoodWhenLower={true}
        type={getCardType(avgCls, 0.1, 0.25, true)}
      />

      <MetricCard
        title="LCP"
        value={avgLcp}
        unit="ms"
        description="Largest Contentful Paint"
        previousValue={prevAvgLcp}
        isGoodWhenLower={true}
        type={getCardType(avgLcp, 2500, 4000, true)}
      />

      <MetricCard
        title="FID"
        value={avgFid}
        unit="ms"
        description="First Input Delay"
        previousValue={prevAvgFid}
        isGoodWhenLower={true}
        type={getCardType(avgFid, 100, 300, true)}
      />

      <MetricCard
        title="FCP"
        value={avgFcp}
        unit="ms"
        description="First Contentful Paint"
        previousValue={prevAvgFcp}
        isGoodWhenLower={true}
        type={getCardType(avgFcp, 1800, 3000, true)}
      />

      <MetricCard
        title="TTFB"
        value={avgTtfb}
        unit="ms"
        description="Time to First Byte"
        previousValue={prevAvgTtfb}
        isGoodWhenLower={true}
        type={getCardType(avgTtfb, 500, 1000, true)}
      />
    </div>
  );
}
