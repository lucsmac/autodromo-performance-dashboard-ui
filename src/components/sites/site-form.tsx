import React from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

import { Site, Theme } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { themes } from "@/lib/data";

interface SiteFormProps {
  site?: Site;
  onSave: (site: Site) => void;
  onCancel: () => void;
}

export function SiteForm({ site, onSave, onCancel }: SiteFormProps) {
  const router = useRouter();
  const [name, setName] = React.useState(site?.name || "");
  const [url, setUrl] = React.useState(site?.url || "");
  const [themeId, setThemeId] = React.useState(site?.theme.id || "");
  const [frequency, setFrequency] = React.useState<"30min" | "3h">(site?.frequency || "30min");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !url || !themeId || !frequency) {
      return;
    }

    const theme = themes.find((t) => t.id === themeId) as Theme;

    const newSite: Site = {
      id: site?.id || uuidv4(),
      name,
      url,
      theme,
      frequency,
      createdAt: site?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newSite);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{site ? "Editar Site" : "Novo Site"}</CardTitle>
          <CardDescription>
            {site
              ? "Edite as informações do site para monitoramento de performance."
              : "Preencha as informações do site para começar a monitorar sua performance."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Site</Label>
            <Input
              id="name"
              placeholder="Ex: Meu E-commerce"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              placeholder="https://meusite.com.br"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="theme">Tema</Label>
            <Select
              value={themeId}
              onValueChange={(value) => setThemeId(value)}
              required
            >
              <SelectTrigger id="theme">
                <SelectValue placeholder="Selecione um tema" />
              </SelectTrigger>
              <SelectContent>
                {themes.map((theme) => (
                  <SelectItem key={theme.id} value={theme.id}>
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequência de Coleta</Label>
            <Select
              value={frequency}
              onValueChange={(value: "30min" | "3h") => setFrequency(value)}
              required
            >
              <SelectTrigger id="frequency">
                <SelectValue placeholder="Selecione a frequência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30min">A cada 30 minutos</SelectItem>
                <SelectItem value="3h">A cada 3 horas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {site ? "Salvar Alterações" : "Criar Site"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
