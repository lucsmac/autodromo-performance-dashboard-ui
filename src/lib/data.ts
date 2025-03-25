import { addDays, subDays, subHours, subMinutes, format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

import { CoreWebVitals, PerformanceMetric, Site, Theme } from "@/types";

// Temas simulados
export const themes: Theme[] = [
  { id: "1", name: "E-commerce" },
  { id: "2", name: "Blog" },
  { id: "3", name: "Institucional" },
  { id: "4", name: "Landing Page" },
  { id: "5", name: "Portal de Notícias" },
];

// Sites simulados
export const sites: Site[] = [
  {
    id: "1",
    name: "Loja Virtual XYZ",
    url: "https://lojaxyz.com.br",
    theme: themes[0],
    frequency: "30min",
    createdAt: "2023-01-15T14:30:00Z",
    updatedAt: "2023-05-20T09:15:00Z",
  },
  {
    id: "2",
    name: "Blog de Tecnologia",
    url: "https://techblog.com.br",
    theme: themes[1],
    frequency: "3h",
    createdAt: "2023-02-10T10:00:00Z",
    updatedAt: "2023-05-18T16:45:00Z",
  },
  {
    id: "3",
    name: "Site Institucional ABC",
    url: "https://empresaabc.com.br",
    theme: themes[2],
    frequency: "3h",
    createdAt: "2023-03-05T08:20:00Z",
    updatedAt: "2023-05-15T11:30:00Z",
  },
  {
    id: "4",
    name: "Landing Page Produto X",
    url: "https://produtox.com.br",
    theme: themes[3],
    frequency: "30min",
    createdAt: "2023-04-20T16:10:00Z",
    updatedAt: "2023-05-19T14:20:00Z",
  },
  {
    id: "5",
    name: "Portal de Notícias",
    url: "https://noticias.com.br",
    theme: themes[4],
    frequency: "30min",
    createdAt: "2023-03-12T09:45:00Z",
    updatedAt: "2023-05-21T08:05:00Z",
  },
];

// Função para gerar métricas aleatórias
function generateRandomMetrics(): CoreWebVitals {
  return {
    cls: Math.random() * 0.25,
    lcp: 1000 + Math.random() * 3000,
    fid: 50 + Math.random() * 150,
    fcp: 500 + Math.random() * 1500,
    ttfb: 100 + Math.random() * 500,
  };
}

// Função para gerar um conjunto de métricas para um site específico
export function generateMetricsForSite(siteId: string, count: number, startDate: Date): PerformanceMetric[] {
  const metrics: PerformanceMetric[] = [];
  let currentDate = new Date(startDate);

  for (let i = 0; i < count; i++) {
    // Ajusta a data com base na frequência do site
    const site = sites.find(s => s.id === siteId);
    if (site) {
      const frequency = site.frequency === "30min" ? 30 : 180; // em minutos
      currentDate = subMinutes(currentDate, frequency);
    } else {
      currentDate = subHours(currentDate, 1);
    }

    metrics.push({
      id: uuidv4(),
      siteId,
      timestamp: currentDate.toISOString(),
      responseTime: 200 + Math.random() * 800,
      lighthouseScore: Math.floor(60 + Math.random() * 40),
      coreWebVitals: generateRandomMetrics(),
    });
  }

  return metrics;
}

// Função para gerar métricas para todos os sites
export function generateAllMetrics(daysBack: number = 30): PerformanceMetric[] {
  let allMetrics: PerformanceMetric[] = [];
  const endDate = new Date();

  for (const site of sites) {
    // Calcular quantas métricas gerar com base na frequência
    const metricsPerDay = site.frequency === "30min" ? 48 : 8;
    const totalMetrics = metricsPerDay * daysBack;

    const siteMetrics = generateMetricsForSite(site.id, totalMetrics, endDate);
    allMetrics = [...allMetrics, ...siteMetrics];
  }

  return allMetrics;
}

// Obter métricas para um período específico
export function getMetricsByPeriod(metrics: PerformanceMetric[], period: "hour" | "day" | "week" | "month", startDate: Date, endDate: Date): PerformanceMetric[] {
  return metrics.filter(metric => {
    const metricDate = new Date(metric.timestamp);
    return metricDate >= startDate && metricDate <= endDate;
  });
}

// Obter métricas para um site específico
export function getMetricsForSite(metrics: PerformanceMetric[], siteId: string): PerformanceMetric[] {
  return metrics.filter(metric => metric.siteId === siteId);
}

// Gerar métricas simuladas para todos os sites
export const allMetrics = generateAllMetrics();
