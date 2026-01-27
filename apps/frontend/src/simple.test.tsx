import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('Simple Test', () => {
  it('should pass', () => {
    // Renderiza un componente básico
    render(<div data-testid="test-element">Hello World</div>);

    // Verifica que se renderizó correctamente
    const element = screen.getByTestId('test-element');
    expect(element).toBeInTheDocument();
    expect(element.textContent).toBe('Hello World');
  });
});
