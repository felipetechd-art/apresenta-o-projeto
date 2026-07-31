import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import ProtectedRoute from '../ProtectedRoute';

// To avoid heavy DOM rendering tests without @testing-library/react, 
// we will test the logical branches of ProtectedRoute conceptually.
// We can mock the AuthContext.

vi.mock('react-router-dom', () => ({
  Navigate: ({ to, replace }) => <div data-testid="navigate" data-to={to} data-replace={replace} />,
  useLocation: () => ({ pathname: '/admin' })
}));

vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: vi.fn()
}));

import { useAuth } from '../../../contexts/AuthContext';

describe('ProtectedRoute Logic', () => {
  it('Deve redirecionar usuário não autenticado para o login', () => {
    useAuth.mockReturnValue({
      authEnabled: true,
      loading: false,
      adminLoading: false,
      isAuthenticated: false,
      isAdmin: false
    });
    
    const result = ProtectedRoute({ children: <div data-testid="child" /> });
    expect(result.props.to).toBe('/admin/login');
  });

  it('Deve mostrar loading e não redirecionar prematuramente', () => {
    useAuth.mockReturnValue({
      authEnabled: true,
      loading: true,
      adminLoading: true,
      isAuthenticated: false,
      isAdmin: false
    });
    
    const result = ProtectedRoute({ children: <div data-testid="child" /> });
    // Should render the loading spinner, not Navigate
    expect(result.props.className).toContain('min-h-screen');
    expect(result.props.children[1].props.children).toBe('Verificando credenciais...');
  });

  it('Usuário autenticado mas sem permissão recebe acesso negado', () => {
    useAuth.mockReturnValue({
      authEnabled: true,
      loading: false,
      adminLoading: false,
      isAuthenticated: true,
      isAdmin: false
    });
    
    const result = ProtectedRoute({ children: <div data-testid="child" /> });
    // Access denied screen
    expect(result.props.children[1].props.children).toBe('Acesso Negado');
  });

  it('Administrador ativo recebe acesso livre (renderiza children)', () => {
    useAuth.mockReturnValue({
      authEnabled: true,
      loading: false,
      adminLoading: false,
      isAuthenticated: true,
      isAdmin: true
    });
    
    const child = <div data-testid="child" />;
    const result = ProtectedRoute({ children: child });
    expect(result).toBe(child);
  });
});
