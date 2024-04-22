import { render, screen, cleanup } from '@testing-library/react';
import * as React from 'react'
import LoadSpinner from '../components/LoadSpinner';
import '@testing-library/jest-dom';
import 'jest';

// afterEach function runs after each test suite is executed
afterEach(() => {
  cleanup();
})

describe('LoadSpinner Component', () => {
  test('Text Rendering', () => {
    render(<LoadSpinner />);
    const yearLabel = screen.getByTestId('yearLabel');
    expect(yearLabel).toBeInTheDocument();
  })
})
