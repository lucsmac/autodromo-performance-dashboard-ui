'use client';

import React, { useState } from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { useSites } from "@/hooks/use-sites";
import { SiteList } from "@/components/sites/site-list";
import { Site } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function SitesPage() {
  const { sites, isLoading, removeSite } = useSites();
  const [siteToDelete, setSiteToDelete] = useState<Site | null>(null);

  // Função para abrir o diálogo de confirmação de exclusão
  const handleDelete = (site: Site) => {
    setSiteToDelete(site);
  };

  // Função para confirmar a exclusão
  const confirmDelete = () => {
    if (siteToDelete) {
      removeSite(siteToDelete.id);
      setSiteToDelete(null);
    }
  };

  // Função para cancelar a exclusão
  const cancelDelete = () => {
    setSiteToDelete(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Gerenciar Sites</h2>
          <Button asChild>
            <Link href="/sites/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              Novo Site
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <Card className="p-8">
              <div className="flex items-center justify-center">
                <p>Carregando sites...</p>
              </div>
            </Card>
          ) : (
            <SiteList
              sites={sites}
              onDelete={handleDelete}
            />
          )}
        </div>

        {/* Diálogo de confirmação de exclusão */}
        <Dialog open={!!siteToDelete} onOpenChange={(open) => !open && setSiteToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir o site
                <span className="font-bold">&quot;{siteToDelete?.name}&quot;</span>?
                Esta ação não poderá ser desfeita e todas as métricas relacionadas também serão removidas.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={cancelDelete}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
