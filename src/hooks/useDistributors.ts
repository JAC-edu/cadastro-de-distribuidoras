import { useState, useEffect } from 'react';
import type { Distributor } from '../types';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export function useDistributors() {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar distributores ao iniciar
  useEffect(() => {
    const loadDistributors = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const res = await fetch(`${API}/distributors`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (res.ok) {
          const data = await res.json();
          setDistributors(Array.isArray(data) ? data : data.data || []);
        } else if (res.status !== 401) {
          // Se não for erro de autenticação, tentar com dados do localStorage
          const cached = localStorage.getItem('distributors');
          if (cached) {
            setDistributors(JSON.parse(cached));
          }
        }
      } catch (err) {
        console.warn('Erro ao carregar distribuidoras:', err);
        // Carregar do cache
        const cached = localStorage.getItem('distributors');
        if (cached) {
          setDistributors(JSON.parse(cached));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadDistributors();
  }, []);

  // Sincronizar com localStorage
  useEffect(() => {
    localStorage.setItem('distributors', JSON.stringify(distributors));
  }, [distributors]);

  function add(distributor: Omit<Distributor, 'id'>) {
    const newDistributor: Distributor = {
      ...distributor,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    } as Distributor;
    setDistributors([...distributors, newDistributor]);
    return newDistributor;
  }

  function update(id: string, updates: Partial<Distributor>) {
    setDistributors(distributors.map(d => d.id === id ? { ...d, ...updates } : d));
  }

  function remove(id: string) {
    setDistributors(distributors.filter(d => d.id !== id));
  }

  return { distributors, isLoading, error, add, update, remove };
}
