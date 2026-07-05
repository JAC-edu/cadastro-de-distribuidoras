import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export type User = { id: number; name?: string; email: string; role?: string };

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const v = localStorage.getItem('currentUser');
      return v && v !== 'null' ? JSON.parse(v) : null;
    } catch {
      console.error('Erro ao carregar usuário do localStorage');
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sincronizar usuário com localStorage
  useEffect(() => {
    try {
      localStorage.setItem('currentUser', currentUser ? JSON.stringify(currentUser) : 'null');
    } catch (err) {
      console.error('Erro ao salvar usuário no localStorage:', err);
    }
  }, [currentUser]);

  // Validar sessão ao iniciar
  useEffect(() => {
    const validateSession = async () => {
      try {
        if (currentUser) {
          // Se há usuário em localStorage, verificar se ainda é válido
          const res = await fetch(`${API}/auth/me`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
          }).catch(() => null);

          if (!res?.ok) {
            // Sessão expirou
            setCurrentUser(null);
            localStorage.removeItem('authToken');
          }
        }
      } catch (err) {
        console.warn('Não foi possível validar sessão:', err);
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, []);

  async function login(email: string, password: string) {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: 'Erro ao autenticar' }));
        setError(data.message || 'Erro ao autenticar');
        return { success: false, message: data.message || 'Erro ao autenticar' };
      }

      const data = await res.json();
      setCurrentUser(data.user);
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      return { success: true, message: 'Login realizado com sucesso!' };
    } catch (err) {
      const message = 'Erro de rede. Verifique se o servidor está rodando em ' + API;
      setError(message);
      console.error('Erro de login:', err);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  }

  async function register(name: string, email: string, password: string, role: 'admin' | 'user' = 'user') {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: 'Erro ao cadastrar' }));
        setError(data.message || 'Erro ao cadastrar');
        return { success: false, message: data.message || 'Erro ao cadastrar' };
      }

      const data = await res.json();
      setCurrentUser(data.user);
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      return { success: true, message: 'Cadastro realizado com sucesso!' };
    } catch (err) {
      const message = 'Erro de rede. Verifique se o servidor está rodando em ' + API;
      setError(message);
      console.error('Erro de registro:', err);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  }

  return { currentUser, isLoading, error, login, register, logout };
}

export default useAuth;
