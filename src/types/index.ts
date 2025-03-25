export type Theme = {
  id: string;
  name: string;
};

export type Site = {
  id: string;
  name: string;
  url: string;
  theme: Theme;
  frequency: "30min" | "3h";
  createdAt: string;
  updatedAt: string;
};

export type CoreWebVitals = {
  cls: number; // Cumulative Layout Shift
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
};

export type PerformanceMetric = {
  id: string;
  siteId: string;
  timestamp: string;
  responseTime: number; // in milliseconds
  lighthouseScore: number; // 0-100
  coreWebVitals: CoreWebVitals;
};

export type Period = "hour" | "day" | "week" | "month";

export type DateRange = {
  from: Date;
  to: Date;
};
