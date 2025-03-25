import { useState, useEffect } from "react";
import { addDays, subDays, differenceInDays } from "date-fns";

import { DateRange, PerformanceMetric, Period } from "@/types";
import { allMetrics, generateMetricsForSite } from "@/lib/data";

export function useMetrics(siteId?: string) {
  // Estado para armazenar todas as métricas
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);

  // Estado para armazenar o período e intervalo de datas selecionado
  const [period, setPeriod] = useState<Period>("day");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  // Estado de carregamento
  const [isLoading, setIsLoading] = useState(true);

  // Carregar métricas iniciais
  useEffect(() => {
    // Simular um tempo de carregamento dos dados
    setIsLoading(true);

    setTimeout(() => {
      // Se tiver siteId, filtra apenas as métricas desse site
      if (siteId) {
        setMetrics(allMetrics.filter((metric) => metric.siteId === siteId));
      } else {
        setMetrics(allMetrics);
      }

      setIsLoading(false);
    }, 500);
  }, [siteId]);

  // Filtrar métricas de acordo com o período selecionado
  const filteredMetrics = metrics.filter((metric) => {
    const metricDate = new Date(metric.timestamp);
    return metricDate >= dateRange.from && metricDate <= dateRange.to;
  });

  // Obter métricas anteriores para comparação
  const getPreviousMetrics = () => {
    const daysDiff = differenceInDays(dateRange.to, dateRange.from);
    const previousFrom = subDays(dateRange.from, daysDiff);
    const previousTo = subDays(dateRange.to, daysDiff);

    return metrics.filter((metric) => {
      const metricDate = new Date(metric.timestamp);
      return metricDate >= previousFrom && metricDate <= previousTo;
    });
  };

  // Obter métricas de um site específico
  const getMetricsForSite = (id: string) => {
    return metrics.filter((metric) => metric.siteId === id);
  };

  // Gerar mais métricas para um site (simulação)
  const generateMoreMetrics = (id: string, count: number = 10) => {
    const newMetrics = generateMetricsForSite(id, count, new Date());
    setMetrics((prev) => [...prev, ...newMetrics]);
    return newMetrics;
  };

  // Agrupar métricas por período
  const groupMetricsByPeriod = (metricsToGroup: PerformanceMetric[]): Record<string, PerformanceMetric[]> => {
    const grouped: Record<string, PerformanceMetric[]> = {};

    metricsToGroup.forEach((metric) => {
      const date = new Date(metric.timestamp);
      let key = "";

      switch (period) {
        case "hour":
          // Agrupar por hora
          key = date.toISOString().slice(0, 13); // YYYY-MM-DDTHH
          break;
        case "day":
          // Agrupar por dia
          key = date.toISOString().slice(0, 10); // YYYY-MM-DD
          break;
        case "week":
          // Agrupar por dia da semana
          key = date.getDay().toString(); // 0-6 (domingo-sábado)
          break;
        case "month":
          // Agrupar por dia do mês
          key = date.getDate().toString(); // 1-31
          break;
        default:
          key = date.toISOString().slice(0, 10);
      }

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(metric);
    });

    return grouped;
  };

  return {
    metrics: filteredMetrics,
    allMetrics: metrics,
    isLoading,
    period,
    setPeriod,
    dateRange,
    setDateRange,
    previousMetrics: getPreviousMetrics(),
    getMetricsForSite,
    generateMoreMetrics,
    groupMetricsByPeriod,
  };
}
