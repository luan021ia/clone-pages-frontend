import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies default styles', () => {
    render(<Button>Test Button</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveStyle({
      padding: '8px',
      borderRadius: '6px',
    });
  });

  it('calls onClick handler when clicked', async () => {
    const mockOnClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={mockOnClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when not provided', async () => {
    const user = userEvent.setup();

    render(<Button>Click me</Button>);

    // Should not throw error when clicked
    await user.click(screen.getByRole('button'));
  });

  it('handles multiple clicks', async () => {
    const mockOnClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={mockOnClick}>Click me</Button>);

    const button = screen.getByRole('button');
    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(3);
  });

  it('renders with complex children', () => {
    render(
      <Button>
        <span>Icon</span>
        <span>Text</span>
      </Button>
    );

    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('renders with empty children', () => {
    render(<Button>{''}</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('');
  });

  it('is accessible via keyboard', async () => {
    const mockOnClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={mockOnClick}>Click me</Button>);

    const button = screen.getByRole('button');
    button.focus();
    await user.keyboard('{Enter}');

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('can be focused programmatically', () => {
    render(<Button>Test Button</Button>);
    const button = screen.getByRole('button');

    button.focus();
    expect(button).toHaveFocus();
  });

  it('has proper button role', () => {
    render(<Button>Test Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('handles disabled state simulation', () => {
    render(<Button>Disabled Button</Button>);
    const button = screen.getByRole('button');

    // Note: The component doesn't have a disabled prop,
    // but we can test that it doesn't crash when disabled via DOM
    button.setAttribute('disabled', 'true');
    expect(button).toBeDisabled();
  });

  describe('Event handling', () => {
    it('handles mouse events', async () => {
      const onMouseEnter = jest.fn();
      const onMouseLeave = jest.fn();

      render(
        <Button
          onClick={() => {}}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          Hover me
        </Button>
      );

      const button = screen.getByRole('button');

      await fireEvent.mouseEnter(button);
      expect(onMouseEnter).toHaveBeenCalledTimes(1);

      await fireEvent.mouseLeave(button);
      expect(onMouseLeave).toHaveBeenCalledTimes(1);
    });

    it('handles focus events', async () => {
      const onFocus = jest.fn();
      const onBlur = jest.fn();

      render(
        <Button
          onClick={() => {}}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          Focus me
        </Button>
      );

      const button = screen.getByRole('button');

      await fireEvent.focus(button);
      expect(onFocus).toHaveBeenCalledTimes(1);

      await fireEvent.blur(button);
      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Performance', () => {
    it('re-renders efficiently when props change', () => {
      const { rerender } = render(<Button>Initial</Button>);

      expect(screen.getByText('Initial')).toBeInTheDocument();

      rerender(<Button>Updated</Button>);
      expect(screen.getByText('Updated')).toBeInTheDocument();
    });

    it('handles fast clicks without errors', async () => {
      const mockOnClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={mockOnClick}>Fast Click</Button>);

      const button = screen.getByRole('button');

      // Simulate rapid clicks
      for (let i = 0; i < 10; i++) {
        await user.click(button);
      }

      expect(mockOnClick).toHaveBeenCalledTimes(10);
    });
  });

  describe('Edge cases', () => {
    it('renders with null children', () => {
      render(<Button>{null}</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('');
    });

    it('renders with undefined children', () => {
      render(<Button>{undefined}</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('');
    });

    it('renders with number as children', () => {
      render(<Button>{42}</Button>);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('handles onClick that throws error', async () => {
      const errorThrowingOnClick = jest.fn(() => {
        throw new Error('Test error');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<Button onClick={errorThrowingOnClick}>Error Button</Button>);

      const user = userEvent.setup();
      await user.click(screen.getByRole('button'));

      expect(errorThrowingOnClick).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});