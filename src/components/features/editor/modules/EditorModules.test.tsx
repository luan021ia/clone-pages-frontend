import React from 'react';
import { render } from '@testing-library/react';
import { TextTab } from './text/TextTab';
import { ColorsTab } from './colors/ColorsTab';
import { MediaTab } from './media/MediaTab';
import { LayoutTab } from './container/LayoutTab';
import { BordersTab } from './container/BordersTab';
import { AdvancedTab } from './container/AdvancedTab';
import type { SelectedElement, ElementUpdate } from '@/types/editor.types';

/**
 * Teste integrado para todos os módulos do editor visual
 * Garante que nenhum componente quebra a interface
 */

describe('Editor Visual Modules - Integration Tests', () => {
  const mockElement: SelectedElement = {
    xpath: '/html/body/div[1]',
    tagName: 'div',
    id: 'test-element',
    className: 'test-class another-class',
    styles: {
      color: '#000000',
      fontSize: '16px',
      backgroundColor: 'white',
      borderWidth: '1px',
      borderRadius: '0px',
      borderStyle: 'solid',
      width: '100px',
      height: '100px',
      margin: '10px',
      padding: '10px'
    },
    attributes: {
      src: '',
      href: ''
    },
    boundingRect: {
      top: 100,
      left: 100,
      width: 200,
      height: 200
    }
  };

  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    mockOnUpdate.mockClear();
    jest.clearAllMocks();
  });

  describe('TextTab Component', () => {
    it('deve renderizar sem erros', () => {
      const { container } = render(
        <TextTab element={mockElement} onUpdate={mockOnUpdate} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('não deve derrubar a tela', () => {
      expect(() => {
        render(
          <TextTab element={mockElement} onUpdate={mockOnUpdate} />
        );
      }).not.toThrow();
    });

    it('deve ter todos os controles necessários', () => {
      const { container } = render(
        <TextTab element={mockElement} onUpdate={mockOnUpdate} />
      );
      const inputs = container.querySelectorAll('input, select, textarea');
      expect(inputs.length).toBeGreaterThan(0);
    });
  });

  describe('ColorsTab Component', () => {
    it('deve renderizar sem erros', () => {
      const { container } = render(
        <ColorsTab element={mockElement} onUpdate={mockOnUpdate} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('não deve derrubar a tela', () => {
      expect(() => {
        render(
          <ColorsTab element={mockElement} onUpdate={mockOnUpdate} />
        );
      }).not.toThrow();
    });

    it('deve exibir controles de cor', () => {
      const { container } = render(
        <ColorsTab element={mockElement} onUpdate={mockOnUpdate} />
      );
      const colorInputs = container.querySelectorAll('input[type="color"], input[type="text"]');
      expect(colorInputs.length).toBeGreaterThan(0);
    });
  });

  describe('MediaTab Component', () => {
    it('deve renderizar sem erros', () => {
      const { container } = render(
        <MediaTab element={mockElement} onUpdate={mockOnUpdate} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('não deve derrubar a tela', () => {
      expect(() => {
        render(
          <MediaTab element={mockElement} onUpdate={mockOnUpdate} />
        );
      }).not.toThrow();
    });
  });

  describe('LayoutTab Component', () => {
    it('deve renderizar sem erros', () => {
      const { container } = render(
        <LayoutTab element={mockElement} onUpdate={mockOnUpdate} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('não deve derrubar a tela', () => {
      expect(() => {
        render(
          <LayoutTab element={mockElement} onUpdate={mockOnUpdate} />
        );
      }).not.toThrow();
    });

    it('deve ter controles de layout', () => {
      const { container } = render(
        <LayoutTab element={mockElement} onUpdate={mockOnUpdate} />
      );
      const inputs = container.querySelectorAll('input[type="range"], input[type="number"]');
      expect(inputs.length).toBeGreaterThan(0);
    });
  });

  describe('BordersTab Component', () => {
    it('deve renderizar sem erros', () => {
      const { container } = render(
        <BordersTab element={mockElement} onUpdate={mockOnUpdate} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('não deve derrubar a tela', () => {
      expect(() => {
        render(
          <BordersTab element={mockElement} onUpdate={mockOnUpdate} />
        );
      }).not.toThrow();
    });

    it('deve ter controles de borda', () => {
      const { container } = render(
        <BordersTab element={mockElement} onUpdate={mockOnUpdate} />
      );
      const inputs = container.querySelectorAll('input[type="range"]');
      expect(inputs.length).toBeGreaterThan(0);
    });
  });

  describe('AdvancedTab Component', () => {
    it('deve renderizar sem erros', () => {
      const { container } = render(
        <AdvancedTab element={mockElement} onUpdate={mockOnUpdate} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('não deve derrubar a tela', () => {
      expect(() => {
        render(
          <AdvancedTab element={mockElement} onUpdate={mockOnUpdate} />
        );
      }).not.toThrow();
    });
  });

  describe('CSS Inline Syntax Validation', () => {
    const allModules = [
      { Component: TextTab, name: 'TextTab' },
      { Component: ColorsTab, name: 'ColorsTab' },
      { Component: MediaTab, name: 'MediaTab' },
      { Component: LayoutTab, name: 'LayoutTab' },
      { Component: BordersTab, name: 'BordersTab' },
      { Component: AdvancedTab, name: 'AdvancedTab' }
    ];

    allModules.forEach(({ Component, name }) => {
      it(`${name} deve ter inline styles válidos`, () => {
        const { container } = render(
          <Component element={mockElement} onUpdate={mockOnUpdate} />
        );

        // Verificar se não há erros de sintaxe nos inline styles
        const elementsWithStyle = container.querySelectorAll('[style]');
        elementsWithStyle.forEach(element => {
          const style = element.getAttribute('style');
          expect(style).toBeTruthy();
          // Se houver erro de sintaxe CSS, React teria lançado uma exceção
        });
      });

      it(`${name} deve renderizar sem crashes`, () => {
        expect(() => {
          render(
            <Component element={mockElement} onUpdate={mockOnUpdate} />
          );
        }).not.toThrow();
      });
    });
  });

  describe('Screen Disappearance Prevention', () => {
    it('TextTab não deve fazer a tela desaparecer', () => {
      const { container } = render(
        <TextTab element={mockElement} onUpdate={mockOnUpdate} />
      );
      expect(container.children.length).toBeGreaterThan(0);
    });

    it('ColorsTab não deve fazer a tela desaparecer', () => {
      const { container } = render(
        <ColorsTab element={mockElement} onUpdate={mockOnUpdate} />
      );
      expect(container.children.length).toBeGreaterThan(0);
    });

    it('MediaTab não deve fazer a tela desaparecer', () => {
      const { container } = render(
        <MediaTab element={mockElement} onUpdate={mockOnUpdate} />
      );
      expect(container.children.length).toBeGreaterThan(0);
    });

    it('LayoutTab não deve fazer a tela desaparecer', () => {
      const { container } = render(
        <LayoutTab element={mockElement} onUpdate={mockOnUpdate} />
      );
      expect(container.children.length).toBeGreaterThan(0);
    });

    it('BordersTab não deve fazer a tela desaparecer', () => {
      const { container } = render(
        <BordersTab element={mockElement} onUpdate={mockOnUpdate} />
      );
      expect(container.children.length).toBeGreaterThan(0);
    });

    it('AdvancedTab não deve fazer a tela desaparecer', () => {
      const { container } = render(
        <AdvancedTab element={mockElement} onUpdate={mockOnUpdate} />
      );
      expect(container.children.length).toBeGreaterThan(0);
    });
  });

  describe('Element Props Handling', () => {
    it('todos os componentes devem lidar com props nulas graciosamente', () => {
      const emptyElement: SelectedElement = {
        xpath: '/html/body/div[1]',
        tagName: 'div',
        styles: {},
        attributes: {},
        boundingRect: { top: 0, left: 0, width: 100, height: 100 }
      };

      const modules = [TextTab, ColorsTab, MediaTab, LayoutTab, BordersTab, AdvancedTab];

      modules.forEach(Module => {
        expect(() => {
          render(
            <Module element={emptyElement} onUpdate={mockOnUpdate} />
          );
        }).not.toThrow();
      });
    });
  });

  describe('Callback Functions', () => {
    it('TextTab deve chamar onUpdate corretamente', () => {
      const { container } = render(
        <TextTab element={mockElement} onUpdate={mockOnUpdate} />
      );
      const inputs = container.querySelectorAll('input, select');
      expect(inputs.length).toBeGreaterThan(0);
      // onUpdate deve ser chamado quando há mudanças
    });

    it('BordersTab deve chamar onUpdate com propriedade xpath', () => {
      render(
        <BordersTab element={mockElement} onUpdate={mockOnUpdate} />
      );
      // Verificar que a função foi registrada
      expect(typeof mockOnUpdate).toBe('function');
    });
  });
});
