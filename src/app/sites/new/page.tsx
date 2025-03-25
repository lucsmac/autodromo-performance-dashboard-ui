'use client';

import React from "react";
import { useRouter } from "next/navigation";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SiteForm } from "@/components/sites/site-form";
import { useSites } from "@/hooks/use-sites";
import { Site } from "@/types";

export default function NewSitePage() {
  const router = useRouter();
  const { addSite } = useSites();

  const handleSave = (site: Site) => {
    addSite(site);
    router.push("/sites");
  };

  const handleCancel = () => {
    router.push("/sites");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Adicionar Novo Site</h2>
        <div className="space-y-4">
          <SiteForm
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
