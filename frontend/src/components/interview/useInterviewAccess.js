import { useAuth } from '../../contexts/AuthContext';

/**
 * Barreira adicional de defesa: além das rotas protegidas e das regras do
 * Firestore no servidor, os componentes recusam carregar dados quando o
 * usuário autenticado não é administrador ativo.
 */
export function useInterviewAccess() {
  const { authEnabled, isAdmin, adminLoading } = useAuth();
  const denied = authEnabled === true && adminLoading === false && isAdmin === false;
  return { denied };
}
