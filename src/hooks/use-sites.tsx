import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Site } from "@/types";
import { sites as initialSites, themes } from "@/lib/data";

const LOCAL_STORAGE_KEY = "performance-dashboard-sites";

export function useSites() {
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar sites do localStorage ou usar os dados iniciais
  useEffect(() => {
    const loadSites = () => {
      try {
        const storedSites = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedSites) {
          setSites(JSON.parse(storedSites));
        } else {
          setSites(initialSites);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialSites));
        }
      } catch (error) {
        console.error("Erro ao carregar sites:", error);
        setSites(initialSites);
      } finally {
        setIsLoading(false);
      }
    };

    loadSites();
  }, []);

  // Salvar sites no localStorage quando mudarem
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sites));
    }
  }, [sites, isLoading]);

  // Adicionar um novo site
  const addSite = (site: Omit<Site, "id" | "createdAt" | "updatedAt">) => {
    const newSite: Site = {
      ...site,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSites((prevSites) => [...prevSites, newSite]);
    return newSite;
  };

  // Atualizar um site existente
  const updateSite = (updatedSite: Site) => {
    setSites((prevSites) =>
      prevSites.map((site) =>
        site.id === updatedSite.id
          ? { ...updatedSite, updatedAt: new Date().toISOString() }
          : site
      )
    );
    return updatedSite;
  };

  // Remover um site
  const removeSite = (siteId: string) => {
    setSites((prevSites) => prevSites.filter((site) => site.id !== siteId));
  };

  // Obter um site por ID
  const getSiteById = (siteId: string) => {
    return sites.find((site) => site.id === siteId);
  };

  // Obter sites por tema
  const getSitesByTheme = (themeId: string) => {
    return sites.filter((site) => site.theme.id === themeId);
  };

  return {
    sites,
    isLoading,
    addSite,
    updateSite,
    removeSite,
    getSiteById,
    getSitesByTheme,
  };
}
