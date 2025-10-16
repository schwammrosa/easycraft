import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, LogOut } from 'lucide-react';
import { useCharacterStore } from '../../store/characterStore';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/auth.service';
import { useToastContext } from '../ToastProvider';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export interface NavbarProps {
  title?: string;
  showBack?: boolean;
  backTo?: string;
  actions?: React.ReactNode;
}

export function Navbar({ title, showBack = true, backTo = '/dashboard', actions }: NavbarProps) {
  const navigate = useNavigate();
  const { selectedCharacter } = useCharacterStore();
  const logout = useAuthStore((state) => state.logout);
  const toast = useToastContext();

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      toast.success('Logout realizado com sucesso!');
      navigate('/login');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <nav className="bg-bg-panel border-b border-primary-medium mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center gap-4">
            {showBack && (
              <Button
                variant="ghost"
                size="sm"
                icon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => navigate(backTo)}
                aria-label="Voltar"
              >
                Voltar
              </Button>
            )}
            {title && (
              <h1 className="text-2xl font-bold text-accent-gold">{title}</h1>
            )}
          </div>

          {/* Center section - Character info */}
          {selectedCharacter && (
            <div className="hidden md:flex items-center gap-3 bg-bg-input px-4 py-2 rounded-lg">
              <div className="w-8 h-8 bg-accent-gold rounded-full flex items-center justify-center text-lg">
                🎮
              </div>
              <div className="text-left">
                <p className="font-bold text-sm text-text-primary">{selectedCharacter.name}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="gold" size="sm">Nv. {selectedCharacter.level}</Badge>
                  <span className="text-xs text-accent-gold">{selectedCharacter.gold}g</span>
                </div>
              </div>
            </div>
          )}

          {/* Right section */}
          <div className="flex items-center gap-2">
            {actions}
            <Button
              variant="ghost"
              size="sm"
              icon={<User className="w-4 h-4" />}
              onClick={() => navigate('/characters')}
              className="hidden sm:inline-flex"
            >
              Personagens
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={<LogOut className="w-4 h-4" />}
              onClick={handleLogout}
            >
              Sair
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
