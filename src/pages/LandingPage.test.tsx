import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LandingPage from './LandingPage';
import { MemoryRouter } from 'react-router';

describe('Landing Page', () => {
  it('renders correctly', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    const element = screen.getByText('page.landing.title');
    expect(element).toBeInTheDocument();
  });
});
