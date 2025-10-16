import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface TutorialStep {
  title: string;
  content: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface TutorialProps {
  steps: TutorialStep[];
  onComplete: () => void;
  onSkip: () => void;
}

export function Tutorial({ steps, onComplete, onSkip }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    onComplete();
  };

  const handleSkipClick = () => {
    setIsVisible(false);
    onSkip();
  };

  if (!isVisible) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-300" />

      {/* Tutorial Card */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg animate-in zoom-in-95 duration-300">
        <div className="bg-bg-panel border-2 border-accent-gold rounded-lg shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-primary-medium">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-bold text-accent-gold">
                {step.title}
              </h3>
              <button
                onClick={handleSkipClick}
                className="text-text-secondary hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-bg-input rounded-full h-2 overflow-hidden">
              <div 
                className="bg-accent-gold h-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-text-secondary mt-1">
              Passo {currentStep + 1} de {steps.length}
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-text-primary leading-relaxed">
              {step.content}
            </p>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-primary-medium flex justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition
                ${currentStep === 0 
                  ? 'text-text-secondary cursor-not-allowed opacity-50' 
                  : 'text-white bg-primary-medium hover:bg-primary-light'
                }
              `}
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-accent-gold text-white rounded-lg font-bold hover:bg-yellow-500 transition"
            >
              {currentStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Welcome Tutorial Component
export function WelcomeTutorial({ onComplete }: { onComplete: () => void }) {
  const steps: TutorialStep[] = [
    {
      title: '🎮 Bem-vindo ao EasyCraft!',
      content: 'Prepare-se para uma aventura épica em um mundo de fantasia! Este tutorial rápido vai te mostrar o básico do jogo.',
    },
    {
      title: '📊 Dashboard',
      content: 'Este é o seu centro de comando. Aqui você pode ver as estatísticas do seu personagem e acessar todas as funcionalidades do jogo.',
    },
    {
      title: '⚔️ Batalhas',
      content: 'Enfrente inimigos para ganhar XP, gold e loot! Quanto mais forte você fica, mais desafios te aguardam.',
    },
    {
      title: '🎒 Inventário',
      content: 'Gerencie seus itens e equipamentos aqui. Equipar itens melhores aumenta seus atributos!',
    },
    {
      title: '🔨 Crafting',
      content: 'Crie itens poderosos usando materiais que você coleta. Explore receitas para fazer equipamentos lendários!',
    },
    {
      title: '📜 Quests',
      content: 'Complete missões para ganhar recompensas especiais e desbloquear novas áreas.',
    },
    {
      title: '🏪 Marketplace',
      content: 'Compre e venda itens com outros jogadores. Uma economia dinâmica onde você define os preços!',
    },
    {
      title: '🏰 Dungeons',
      content: 'Masmorras desafiadoras com múltiplos andares. Derrote bosses para conseguir os melhores itens do jogo!',
    },
    {
      title: '🎉 Divirta-se!',
      content: 'Agora você está pronto para começar sua jornada! Lembre-se: este é um jogo em desenvolvimento, então bugs podem acontecer. Boa sorte, aventureiro!',
    },
  ];

  const handleComplete = () => {
    localStorage.setItem('easycraft_tutorial_completed', 'true');
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem('easycraft_tutorial_skipped', 'true');
    onComplete();
  };

  // Check if tutorial was already completed
  const tutorialCompleted = localStorage.getItem('easycraft_tutorial_completed');
  const tutorialSkipped = localStorage.getItem('easycraft_tutorial_skipped');

  if (tutorialCompleted || tutorialSkipped) {
    return null;
  }

  return <Tutorial steps={steps} onComplete={handleComplete} onSkip={handleSkip} />;
}
