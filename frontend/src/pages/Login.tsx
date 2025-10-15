import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';

export function Login() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const authData = await authService.login({ email, password });
      setUser(authData.user);
      navigate('/characters');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-accent-gold mb-2">🎮 EasyCraft</h1>
          <p className="text-text-secondary">Entre na sua conta</p>
        </div>

        <div className="bg-bg-panel rounded-lg p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-bg-input rounded-lg border border-primary-medium focus:border-accent-blue focus:outline-none text-text-primary"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-bg-input rounded-lg border border-primary-medium focus:border-accent-blue focus:outline-none text-text-primary"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-accent-red/10 border border-accent-red text-accent-red px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-blue hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-lg font-semibold transition-colors"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-text-secondary">Não tem uma conta? </span>
            <Link to="/register" className="text-accent-blue hover:underline">
              Registre-se
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
