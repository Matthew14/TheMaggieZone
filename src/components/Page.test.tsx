import React from 'react';
import { render, screen } from '@testing-library/react';
import Page from './Page';

test('renders learn react link', () => {
  render(<Page />);
  const linkElement = screen.getByText(/Welcome to the Maggie Zone/i);
  expect(linkElement).toBeInTheDocument();
});
