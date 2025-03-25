import React from "react";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: number;
  unit?: string;
  previousValue?: number;
  description?: string;
  changeIsPositive?: boolean;
  type?: "default" | "success" | "warning" | "error";
  isGoodWhenLower?: boolean;
}

export function MetricCard({
  title,
  value,
  unit = "",
  previousValue,
  description,
  changeIsPositive,
  type = "default",
  isGoodWhenLower = false,
}: MetricCardProps) {
  const formattedValue = value % 1 === 0 ? value.toString() : value.toFixed(2);

  // Calcular a mudança percentual, se houver um valor anterior
  const hasChange = previousValue !== undefined && previousValue !== 0;
  const changePercent = hasChange
    ? Math.abs(((value - previousValue) / previousValue) * 100)
    : 0;

  // Determinar se a mudança é boa ou ruim com base nos parâmetros
  let isGoodChange = false;
  if (hasChange && changeIsPositive !== undefined) {
    isGoodChange = changeIsPositive;
  } else if (hasChange) {
    isGoodChange = isGoodWhenLower ? value < previousValue : value > previousValue;
  }

  // Definir as classes de cores para cada tipo
  const typeClasses = {
    default: {
      bg: "bg-background",
      text: "text-foreground",
      accent: "text-primary",
    },
    success: {
      bg: "bg-green-50 dark:bg-green-950",
      text: "text-green-700 dark:text-green-300",
      accent: "text-green-600 dark:text-green-400",
    },
    warning: {
      bg: "bg-yellow-50 dark:bg-yellow-950",
      text: "text-yellow-700 dark:text-yellow-300",
      accent: "text-yellow-600 dark:text-yellow-400",
    },
    error: {
      bg: "bg-red-50 dark:bg-red-950",
      text: "text-red-700 dark:text-red-300",
      accent: "text-red-600 dark:text-red-400",
    },
  };

  return (
    <Card className={`${typeClasses[type].bg}`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-sm font-medium ${typeClasses[type].text}`}>
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-xs">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">
            {formattedValue}
            {unit && <span className="ml-1 text-sm font-normal">{unit}</span>}
          </div>
          {hasChange && (
            <div className={`flex items-center text-xs ${isGoodChange ? "text-green-600" : "text-red-600"}`}>
              {value > previousValue ? (
                <ArrowUpIcon className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDownIcon className="mr-1 h-3 w-3" />
              )}
              <span>
                {changePercent.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
