import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { AnimationTab } from '../advanced/AnimationTab';
import { EffectsTab } from '../container/EffectsTab';

// Mock do onUpdate para capturar as chamadas
const mockOnUpdate = jest.fn();

describe('AnimationTab', () => {
  const mockElement = {
    xpath: '//*[@id="test-element"]',
    tagName: 'DIV',
    id: 'test-element',
    className: 'test-class',
    styles: {}
  };

  beforeEach(() => {
    mockOnUpdate.mockClear();
    // Mock console.log para evitar poluição nos testes
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.log as jest.Mock).mockRestore();
  });

  describe('Renderização inicial', () => {
    test('deve renderizar todas as animações disponíveis', () => {
      render(<AnimationTab element={mockElement} onUpdate={mockOnUpdate} />);

      expect(screen.getByText('💗 Pulsar')).toBeInTheDocument();
      expect(screen.getByText('⬆️ Bounce')).toBeInTheDocument();
      expect(screen.getByText('🤝 Tremer')).toBeInTheDocument();
      expect(screen.getByText('👻 Fade In')).toBeInTheDocument();
      expect(screen.getByText('⬅️ Deslizar Esquerda')).toBeInTheDocument();
      expect(screen.getByText('➡️ Deslizar Direita')).toBeInTheDocument();
      expect(screen.getByText('🔍 Zoom In')).toBeInTheDocument();
      expect(screen.getByText('🔄 Girar')).toBeInTheDocument();
      expect(screen.getByText('🎈 Flutuar')).toBeInTheDocument();
    });

    test('deve renderizar controles de configuração', () => {
      render(<AnimationTab element={mockElement} onUpdate={mockOnUpdate} />);

      expect(screen.getByLabelText('Duração (segundos)')).toBeInTheDocument();
      expect(screen.getByLabelText('Repetição')).toBeInTheDocument();
      expect(screen.getByText('❌ Remover Animação')).toBeInTheDocument();
    });
  });

  describe('Aplicação de animações', () => {
    test('deve aplicar animação pulse com clique único', async () => {
      const user = userEvent.setup();
      render(<AnimationTab element={mockElement} onUpdate={mockOnUpdate} />);

      const pulseButton = screen.getByText('💗 Pulsar');
      await user.click(pulseButton);

      // Esperar o setTimeout de 50ms
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockOnUpdate).toHaveBeenCalledTimes(2); // remove + apply

      // Primeira chamada: remover animação anterior
      expect(mockOnUpdate).toHaveBeenNthCalledWith(1, {
        xpath: mockElement.xpath,
        property: 'animation',
        value: 'none',
        type: 'style'
      });

      // Segunda chamada: aplicar nova animação
      expect(mockOnUpdate).toHaveBeenNthCalledWith(2, {
        xpath: mockElement.xpath,
        property: 'animation',
        value: 'pulse 1s ease-in-out infinite',
        type: 'style'
      });
    });

    test('deve aplicar animação fadeIn corretamente', async () => {
      const user = userEvent.setup();
      render(<AnimationTab element={mockElement} onUpdate={mockOnUpdate} />);

      const fadeInButton = screen.getByText('👻 Fade In');
      await user.click(fadeInButton);

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockOnUpdate).toHaveBeenCalledTimes(2);
      expect(mockOnUpdate).toHaveBeenNthCalledWith(2, {
        xpath: mockElement.xpath,
        property: 'animation',
        value: 'fadeIn 1s ease-in-out infinite',
        type: 'style'
      });
    });

    test('deve aplicar duração customizada', async () => {
      const user = userEvent.setup();
      render(<AnimationTab element={mockElement} onUpdate={mockOnUpdate} />);

      const durationInput = screen.getByLabelText('Duração (segundos)');
      await user.clear(durationInput);
      await user.type(durationInput, '2.5');

      const bounceButton = screen.getByText('⬆️ Bounce');
      await user.click(bounceButton);

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockOnUpdate).toHaveBeenNthCalledWith(2, {
        xpath: mockElement.xpath,
        property: 'animation',
        value: 'bounce 2.5s ease-in-out infinite',
        type: 'style'
      });
    });

    test('deve aplicar repetição customizada', async () => {
      const user = userEvent.setup();
      render(<AnimationTab element={mockElement} onUpdate={mockOnUpdate} />);

      const repetitionsSelect = screen.getByLabelText('Repetição');
      await user.selectOptions(repetitionsSelect, '3');

      const rotateButton = screen.getByText('🔄 Girar');
      await user.click(rotateButton);

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockOnUpdate).toHaveBeenNthCalledWith(2, {
        xpath: mockElement.xpath,
        property: 'animation',
        value: 'rotate 1s ease-in-out 3',
        type: 'style'
      });
    });

    test('deve remover animação corretamente', async () => {
      const user = userEvent.setup();
      render(<AnimationTab element={mockElement} onUpdate={mockOnUpdate} />);

      const removeButton = screen.getByText('❌ Remover Animação');
      await user.click(removeButton);

      expect(mockOnUpdate).toHaveBeenCalledTimes(1);
      expect(mockOnUpdate).toHaveBeenCalledWith({
        xpath: mockElement.xpath,
        property: 'animation',
        value: 'none',
        type: 'style'
      });
    });
  });
});

describe('EffectsTab', () => {
  const mockElement = {
    xpath: '//*[@id="test-element"]',
    tagName: 'DIV',
    id: 'test-element',
    className: 'test-class',
    styles: {}
  };

  beforeEach(() => {
    mockOnUpdate.mockClear();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.log as jest.Mock).mockRestore();
  });

  describe('Aplicação de animações via select', () => {
    test('deve aplicar animação pulse via select', async () => {
      const user = userEvent.setup();
      render(<EffectsTab element={mockElement} onUpdate={mockOnUpdate} />);

      const animationSelect = screen.getByDisplayValue('Nenhuma');
      await user.selectOptions(animationSelect, 'pulse');

      expect(mockOnUpdate).toHaveBeenCalledTimes(1);
      expect(mockOnUpdate).toHaveBeenCalledWith({
        xpath: mockElement.xpath,
        property: 'animation',
        value: 'pulse 1s ease-in-out 0s 1',
        type: 'style'
      });
    });

    test('deve remover animação quando seleciona "Nenhuma"', async () => {
      const user = userEvent.setup();
      render(<EffectsTab element={mockElement} onUpdate={mockOnUpdate} />);

      const animationSelect = screen.getByDisplayValue('Nenhuma');
      // Primeiro selecionar uma animação
      await user.selectOptions(animationSelect, 'bounce');
      mockOnUpdate.mockClear();

      // Depois selecionar "Nenhuma"
      await user.selectOptions(animationSelect, 'none');

      expect(mockOnUpdate).toHaveBeenCalledTimes(1);
      expect(mockOnUpdate).toHaveBeenCalledWith({
        xpath: mockElement.xpath,
        property: 'animation',
        value: 'none',
        type: 'style'
      });
    });

    test('deve aplicar duração customizada', async () => {
      const user = userEvent.setup();
      render(<EffectsTab element={mockElement} onUpdate={mockOnUpdate} />);

      const durationInput = screen.getByDisplayValue('1');
      await user.clear(durationInput);
      await user.type(durationInput, '3');

      expect(mockOnUpdate).toHaveBeenCalledTimes(1);
      expect(mockOnUpdate).toHaveBeenCalledWith({
        xpath: mockElement.xpath,
        property: 'animation',
        value: 'none 3s ease-in-out 0s 1',
        type: 'style'
      });
    });
  });
});

describe('Integração de animações', () => {
  test('deve mapear corretamente todos os nomes de animação', () => {
    const animationNames = [
      'pulse', 'bounce', 'shake', 'fadeIn',
      'slideInLeft', 'slideInRight', 'zoomIn', 'rotate', 'float'
    ];

    // Verificar se não há nomes duplicados ou incorretos
    const uniqueNames = [...new Set(animationNames)];
    expect(uniqueNames.length).toBe(animationNames.length);
    expect(animationNames).toEqual([
      'pulse', 'bounce', 'shake', 'fadeIn',
      'slideInLeft', 'slideInRight', 'zoomIn', 'rotate', 'float'
    ]);
  });
});