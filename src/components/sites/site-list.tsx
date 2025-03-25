import React from "react";
import Link from "next/link";
import { Edit2Icon, ExternalLinkIcon, MoreHorizontalIcon, BarChart2Icon, TrashIcon } from "lucide-react";

import { Site } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SiteListProps {
  sites: Site[];
  onDelete: (site: Site) => void;
}

export function SiteList({ sites, onDelete }: SiteListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sites Cadastrados</CardTitle>
        <CardDescription>
          Gerencie todos os sites que estão sendo monitorados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">
              Nenhum site cadastrado ainda.
            </p>
            <Button asChild>
              <Link href="/sites/new">Adicionar Primeiro Site</Link>
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Tema</TableHead>
                <TableHead>Frequência</TableHead>
                <TableHead>Atualizado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell>
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:underline text-blue-500"
                    >
                      {site.url.replace(/^https?:\/\//, "")}
                      <ExternalLinkIcon className="ml-1 h-4 w-4" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{site.theme.name}</Badge>
                  </TableCell>
                  <TableCell>
                    {site.frequency === "30min" ? "30 minutos" : "3 horas"}
                  </TableCell>
                  <TableCell>
                    {format(new Date(site.updatedAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontalIcon className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/metrics/${site.id}`} className="cursor-pointer flex items-center">
                            <BarChart2Icon className="mr-2 h-4 w-4" />
                            <span>Ver Métricas</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/sites/edit/${site.id}`} className="cursor-pointer flex items-center">
                            <Edit2Icon className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600 cursor-pointer flex items-center"
                          onClick={() => onDelete(site)}
                        >
                          <TrashIcon className="mr-2 h-4 w-4" />
                          <span>Excluir</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
