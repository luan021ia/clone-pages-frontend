import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BordersTab } from './container/BordersTab';
import type { SelectedElement, ElementUpdate } from '@/types/editor.types';

describe('BordersTab Component', () => {
  const mockElement: SelectedElement = {
    xpath: '/html/body/div[1]',
    tagName: 'div',
    id: 'test-div',
    className: 'test-class',
    styles: {
      borderWidth: '0',
      borderRadius: '0',
      borderStyle: 'solid'
    },
    attributes: {},
    boundingRect: {
      top: 0,
      left: 0,
      width: 100,
      height: 100
    }
  };

  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    mockOnUpdate.mockClear();
  });

  describe('Render Tests', () => {
    it('deve renderizar sem erros', () => {
      const { container } = render(
        <BordersTab element={mockElement} onUpdate={mockOnUpdate} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('deve exibir seção de Largura da Borda', () => {
      render(
        <BordersTab element={mockElement} onUpdate={mockOnUpdate} />
      );
      expect(screen.getByText('Largura da Borda')).toBeInTheDocument();
    });

    it('deve exibir seção de Estilo da Borda', () => {
      render(
        <BordersTab element={mockElement} onUpdate={mockOnUpdate} />
      );
      expect(screen.getByText('Estilo da Borda')).toBeInTheDocument();
    });

    it('deve exibir seção de Border Radius', () => {
      render(
        <BordersTab element={mockElement} onUpdate={mockOnUpdate} />
      );
      expect(screen.getByText('Arredondamento (Border Radius)')).toBeInTheDocument();
    });

    it('deve renderizar todos os inputs de range para border width', () => {
      const { container } = render(
        <BordersTab element={mockElement} onUpdate={mockOnUpdate} />
      );
      const rangeInputs = container.querySelectorAll('input[type="range"]');
      // 4 para border width + 4 para border radius = 8
      expect(rangeInputs.length).toBe(8);
    });

    it('deve renderizar botão de link/unlink para border width', () => {
      render(
        <BordersTab element={mockElement} onUpdate={mockOnUpdate} />
      );
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(2); // link buttons + preset buttons
    });
  });

  describe('Border Width Functionality', () => {
    it('deve atualizar border width quando slider muda (linked mode)', async () => {
      const { container } = render(
        <BordersTab element={mockElement} onUpdate={mockOnUpdate} />
      );

      const rangeInputs = container.querySelectorAll('input[type="range"]');
      const topInput = rangeInputs[0] as HTMLInputElement;

      fireEvent.change(topInput, { target: { value: '5' } });

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalled();
        expect(mockOnUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            property: 'borderWidth',
            value: '5px 5px 5px 5px'
          })
        );
      });
    });

    it('deve atualizar apenas um lado quando unlinked', async () => {
      const { container } = render(
        <BordersTab element={mockElement} onUpdate={mockOnUpdate} />
      );

      // Deslincar
      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[0]); // Clica no botão de link para deslincar

      // Agora mudar apenas o top
      const rangeInputs = container.querySelectorAll('input[type="range"]');
      const topInput = rangeInputs[0] as HTMLInputElement;
      fireEvent.change(topInput, { target: { value: '3' } });

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            property: 'borderWidth',
            value: expect.stringContaining('3px')
          })
        );
      });
    });
  });

  describe('Border Radius Functionality', () => {
    it('deve atualizar border radius quando slider muda (linked mode)', async () => {
      const { container } = render(
        <BordersTab element={mockElement} onUpdate={mockOnUpdate} />
      );

      const rangeInputs = container.querySelectorAll('input[type="range"]');
      const topLeftInput = rangeInputs[4] as HTMLInputElement; // 5º input é border radius topLeft

      fireEvent.change(topLeftInput, { target: { value: '10' } });

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            property: 'borderRadius',
            value: '10px 10px 10px 10px'
          })
        );
      });
    });

    it('deve aplicar preset Quadrado (0px)', async () => {
      render(
        <BordersTab element={mockElement} onUpdate={mockOnUpdate} />
      );

      const buttons = screen.getAllByRole('button');
      const quadradoButton = buttons.find(btn => btn.textContent?.includes('Quadrado'));

      fireEvent.click(quadradoButton!);

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            property: 'borderRadius',
            value: '0px 0px 0px 0px'
          })
        );
      });
    });

    it('deve aplicar preset Suave (8px)', async () => {
      render(
        <BordersTab element={mockElement} onUpdate={mockOnUpdate} />
      );

      const buttons = screen.getAllByRole('button');
      const suaveButton = buttons.find(btn => btn.textContent?.includes('Suave'));

      fireEvent.click(suaveButton!);

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            property: 'borderRadius',
            value: '8px 8px 8px 8px'
          })
        );
      });
    });

    it('deve aplicar preset Círculo (999px)', async () => {
      render(
        <BordersTab element={mockElement} onUpdate={mockOnUpdate} />
      );

      const buttons = screen.getAllByRole('button');
      const circuloButton = buttons.find(btn => btn.textContent?.includes('Círculo'));

      fireEvent.click(circuloButton!);

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            property: 'borderRadius',
            value: '999px 999px 999px 999px'
          })
        );
      });
    });
  });

  describe('Border Style Functionality', () => {
    it('deve atualizar border style quando select muda', async () => {
      render(
        <BordersTab element={mockElement} onUpdate={mockOnUpdate} />
      );

      const select = screen.getByDisplayValue('Sólida (―――)');
      fireEvent.change(select, { target: { value: 'dashed' } });

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            property: 'borderStyle',
            value: 'dashed'
          })
        );
      });
    });

    it('deve incluir todas as opções de borda', () => {
      render(
        <BordersTab element={mockElement} onUpdate={mockOnUpdate} />
      );

      const styles = ['Nenhuma', 'Sólida', 'Tracejada', 'Pontilhada', 'Dupla', 'Groove', 'Ridge', 'Inset', 'Outset'];
      styles.forEach(style => {
        expect(screen.getByText(new RegExp(style))).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('deve renderizar quando styles são undefined', () => {
      const elementWithoutStyles = { ...mockElement, styles: {} };
      const { container } = render(
        <BordersTab element={elementWithoutStyles} onUpdate={mockOnUpdate} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('deve lidar com valores numéricos máximos', async () => {
      const { container } = render(
        <BordersTab element={mockElement} onUpdate={mockOnUpdate} />
      );

      const rangeInputs = container.querySelectorAll('input[type="range"]');
      const maxInput = rangeInputs[4] as HTMLInputElement; // border radius com max 500

      fireEvent.change(maxInput, { target: { value: '500' } });

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalled();
      });
    });

    it('deve resetar estados quando novo elemento é selecionado', () => {
      const { rerender } = render(
        <BordersTab element={mockElement} onUpdate={mockOnUpdate} />
      );

      const newElement: SelectedElement = {
        ...mockElement,
        xpath: '/html/body/div[2]',
        styles: { borderWidth: '5', borderRadius: '10', borderStyle: 'dotted' }
      };

      rerender(
        <BordersTab element={newElement} onUpdate={mockOnUpdate} />
      );

      expect(screen.getByDisplayValue('Pontilhada (· · ·)')).toBeInTheDocument();
    });
  });

  describe('CSS Syntax Validation', () => {
    it('deve gerar CSS válido para border width', async () => {
      const { container } = render(
        <BordersTab element={mockElement} onUpdate={mockOnUpdate} />
      );

      const rangeInputs = container.querySelectorAll('input[type="range"]');
      fireEvent.change(rangeInputs[0], { target: { value: '5' } });

      await waitFor(() => {
        const call = mockOnUpdate.mock.calls[0][0];
        const value = call.value as string;
        // Validar que é um CSS válido: "5px 5px 5px 5px"
        expect(value).toMatch(/^\d+px\s\d+px\s\d+px\s\d+px$/);
      });
    });

    it('deve gerar CSS válido para border radius', async () => {
      const { container } = render(
        <BordersTab element={mockElement} onUpdate={mockOnUpdate} />
      );

      const rangeInputs = container.querySelectorAll('input[type="range"]');
      fireEvent.change(rangeInputs[4], { target: { value: '15' } });

      await waitFor(() => {
        const call = mockOnUpdate.mock.calls[0][0];
        const value = call.value as string;
        // Validar CSS válido
        expect(value).toMatch(/^\d+px\s\d+px\s\d+px\s\d+px$/);
      });
    });
  });

  describe('No Render Crashes', () => {
    it('não deve derrubar a tela com CSS inline inválido', () => {
      const { container } = render(
        <BordersTab element={mockElement} onUpdate={mockOnUpdate} />
      );

      // Procurar por qualquer erro de sintaxe nos inline styles
      const elementsWithStyle = container.querySelectorAll('[style]');
      elementsWithStyle.forEach(element => {
        const style = element.getAttribute('style');
        // Se houver erro de sintaxe, React lançará uma exceção
        expect(style).toBeTruthy();
      });

      expect(container.firstChild).toBeTruthy();
    });
  });
});
