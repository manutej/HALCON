import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Planet from '@/components/atoms/Planet';
import { PlanetDomain } from '@/types';

describe('Planet Component', () => {
  const mockPlanet: PlanetDomain = {
    id: 'mercury',
    name: 'Mercury',
    domain: 'Communication',
    color: '#fbbf24',
    description: 'Test description',
    orbitRadius: 80,
    orbitDuration: 12,
    tools: [],
  };

  it('should render planet with correct name initial', () => {
    const onClick = vi.fn();
    render(<Planet planet={mockPlanet} isSelected={false} onClick={onClick} />);

    expect(screen.getByText('M')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Planet planet={mockPlanet} isSelected={false} onClick={onClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should have correct aria-label', () => {
    const onClick = vi.fn();
    render(<Planet planet={mockPlanet} isSelected={false} onClick={onClick} />);

    expect(screen.getByLabelText('Mercury - Communication')).toBeInTheDocument();
  });

  it('should indicate selected state with aria-pressed', () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <Planet planet={mockPlanet} isSelected={false} onClick={onClick} />
    );

    let button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'false');

    rerender(<Planet planet={mockPlanet} isSelected={true} onClick={onClick} />);

    button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('should apply correct background color', () => {
    const onClick = vi.fn();
    render(<Planet planet={mockPlanet} isSelected={false} onClick={onClick} />);

    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ backgroundColor: mockPlanet.color });
  });
});
