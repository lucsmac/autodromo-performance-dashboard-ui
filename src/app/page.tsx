'use client';

import React, { useState, useEffect } from "react";
import { subDays } from "date-fns";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMetrics } from "@/hooks/use-metrics";
import { useSites } from "@/hooks/use-sites";
import { PerformanceChart } from "@/components/charts/performance-chart";
import { WebVitalsChart } from "@/components/charts/web-vitals-chart";
import { PeriodFilter } from "@/components/filters/period-filter";
import { MetricSummary } from "@/components/metrics/metric-summary";
import { DateRange, Period } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Activity, BarChart3, Clock, Globe } from "lucide-react";

export default function HomePage() {
  // Estado para período e filtros
  const [period, setPeriod] = useState<Period>("day");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [selectedSiteId, setSelectedSiteId] = useState<string>("all");
  const [selectedThemeId, setSelectedThemeId] = useState<string>("all");

  // Carregar sites e métricas
  const { sites, isLoading: sitesLoading } = useSites();
  const {
    metrics,
    previousMetrics,
    isLoading: metricsLoading,
    setPeriod: setMetricsPeriod,
    setDateRange: setMetricsDateRange
  } = useMetrics();

  // Atualizar o período e intervalo de datas no hook de métricas
  useEffect(() => {
    setMetricsPeriod(period);
    setMetricsDateRange(dateRange);
  }, [period, dateRange, setMetricsPeriod, setMetricsDateRange]);

  // Filtrar métricas por site e tema
  const filteredMetrics = React.useMemo(() => {
    let filtered = [...metrics];

    // Filtrar por site
    if (selectedSiteId !== "all") {
      filtered = filtered.filter((metric) => metric.siteId === selectedSiteId);
    }

    // Filtrar por tema
    if (selectedThemeId !== "all") {
      const siteIds = sites
        .filter((site) => site.theme.id === selectedThemeId)
        .map((site) => site.id);

      filtered = filtered.filter((metric) => siteIds.includes(metric.siteId));
    }

    return filtered;
  }, [metrics, selectedSiteId, selectedThemeId, sites]);

  // Agrupar temas únicos
  const uniqueThemes = React.useMemo(() => {
    const themes = sites.map((site) => site.theme);
    return [...new Map(themes.map((theme) => [theme.id, theme])).values()];
  }, [sites]);

  const isLoading = sitesLoading || metricsLoading;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Sites Monitorados</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground mt-1">+2 na última semana</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tempo Médio Resposta</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">426ms</div>
                <p className="text-xs text-muted-foreground mt-1">-32ms desde ontem</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Score Médio</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87</div>
                <p className="text-xs text-muted-foreground mt-1">+2 pontos na última semana</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Métricas Coletadas</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,842</div>
                <p className="text-xs text-muted-foreground mt-1">+324 hoje</p>
              </CardContent>
            </Card>
          </div>
          
          <PeriodFilter
            period={period}
            setPeriod={setPeriod}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Filtrar por Site</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedSiteId}
                  onValueChange={setSelectedSiteId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um site" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os sites</SelectItem>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Filtrar por Tema</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedThemeId}
                  onValueChange={setSelectedThemeId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os temas</SelectItem>
                    {uniqueThemes.map((theme) => (
                      <SelectItem key={theme.id} value={theme.id}>
                        {theme.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {isLoading ? (
            <Card className="p-8">
              <div className="flex items-center justify-center">
                <p>Carregando métricas...</p>
              </div>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Resumo de Métricas</CardTitle>
                  <CardDescription>
                    Média de todas as métricas no período selecionado.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MetricSummary
                    metrics={filteredMetrics}
                    previousMetrics={previousMetrics}
                  />
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-6">
                <PerformanceChart
                  metrics={filteredMetrics}
                  title="Tempo de Resposta"
                  description="Tempo que o servidor leva para responder às requisições (ms)"
                  period={period}
                  dataKey="responseTime"
                />

                <PerformanceChart
                  metrics={filteredMetrics}
                  title="Lighthouse Score"
                  description="Pontuação geral de performance (0-100)"
                  period={period}
                  dataKey="lighthouseScore"
                />

                <WebVitalsChart
                  metrics={filteredMetrics}
                  title="Core Web Vitals"
                  description="Métricas essenciais para experiência do usuário"
                  period={period}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
