import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

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
    <div className="min-h-screen bg-gradient-to-br from-bg-darker via-bg-main to-bg-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-accent-gold to-accent-orange rounded-full flex items-center justify-center text-4xl shadow-glow-md">
            🎮
          </div>
          <h1 className="text-5xl font-bold text-accent-gold mb-2">EasyCraft</h1>
          <p className="text-text-secondary text-lg">Entre na sua conta</p>
        </div>

        <Card variant="highlighted" className="animate-slide-in-bottom">
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-white">
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
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-white">
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
              <div className="bg-semantic-error/10 border border-semantic-error text-semantic-error px-4 py-3 rounded-lg text-sm animate-shake">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={loading}
              icon={<LogIn className="w-5 h-5" />}
            >
              Entrar
            </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-text-secondary">Não tem uma conta? </span>
              <Link to="/register" className="text-accent-blue hover:text-accent-blue-light font-semibold transition-colors">
                Registre-se
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
