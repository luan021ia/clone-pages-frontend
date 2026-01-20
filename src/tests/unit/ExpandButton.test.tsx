import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ExpandButton } from '../../components/ExpandButton';

describe('ExpandButton', () => {
  it('deve renderizar o botão de expandir quando não está expandido', () => {
    const onExpand = vi.fn();
    const onCollapse = vi.fn();
    
    render(
      <ExpandButton
        onExpand={onExpand}
        onCollapse={onCollapse}
        size="medium"
        theme="dark"
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Expandir');
  });

  it('deve chamar onExpand quando clicado no estado inicial', () => {
    const onExpand = vi.fn();
    const onCollapse = vi.fn();
    
    render(
      <ExpandButton
        onExpand={onExpand}
        onCollapse={onCollapse}
        size="medium"
        theme="dark"
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(onExpand).toHaveBeenCalledTimes(1);
  });

  it('deve mostrar tooltip ao passar o mouse', () => {
    const onExpand = vi.fn();
    const onCollapse = vi.fn();
    
    render(
      <ExpandButton
        onExpand={onExpand}
        onCollapse={onCollapse}
        size="medium"
        theme="dark"
        showTooltip={true}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);
    
    expect(screen.getByText('Expandir')).toBeInTheDocument();
  });

  it('deve estar desabilitado quando disabled for true', () => {
    const onExpand = vi.fn();
    const onCollapse = vi.fn();
    
    render(
      <ExpandButton
        onExpand={onExpand}
        onCollapse={onCollapse}
        size="medium"
        theme="dark"
        disabled={true}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('deve alternar entre expandir e contrair', () => {
    const onExpand = vi.fn();
    const onCollapse = vi.fn();
    
    const { rerender } = render(
      <ExpandButton
        onExpand={onExpand}
        onCollapse={onCollapse}
        size="medium"
        theme="dark"
      />
    );

    // Primeiro clique - expandir
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onExpand).toHaveBeenCalledTimes(1);

    // Segundo clique - contrair (simulando estado expandido)
    rerender(
      <ExpandButton
        onExpand={onExpand}
        onCollapse={onCollapse}
        size="medium"
        theme="dark"
        isExpanded={true}
      />
    );
    
    fireEvent.click(button);
    expect(onCollapse).toHaveBeenCalledTimes(1);
  });
});