import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AddTodoForm from './AddTodoForm';

describe('AddTodoForm', () => {
  it('renders the add todo button', () => {
    render(<AddTodoForm />);

    const addButton = screen.getByRole('button', { name: /add to-do/i });
    expect(addButton).toBeInTheDocument();
  });
});