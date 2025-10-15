import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';

export function Register() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError('A senha deve conter pelo menos uma letra maiúscula');
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError('A senha deve conter pelo menos um número');
      return;
    }

    setLoading(true);

    try {
      const authData = await authService.register({ email, password });
      setUser(authData.user);
      navigate('/characters');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-accent-gold mb-2">🎮 EasyCraft</h1>
          <p className="text-text-secondary">Crie sua conta</p>
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
              <p className="mt-1 text-xs text-text-secondary">
                Mínimo 8 caracteres, 1 maiúscula e 1 número
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirmar Senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-text-secondary">Já tem uma conta? </span>
            <Link to="/login" className="text-accent-blue hover:underline">
              Faça login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
