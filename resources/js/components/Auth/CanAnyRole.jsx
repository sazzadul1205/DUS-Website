// components/Auth/CanAnyRole.jsx
import { useAuth } from '../../hooks/useAuth';

/**
 * CanAnyRole
 * --------------------------------------------------
 * Renders children if user has ANY of the given roles.
 *
 * Example:
 * <CanAnyRole roles={['admin', 'manager']}>
 *   <Dashboard />
 * </CanAnyRole>
 *
 * Typical use case:
 * - multiple elevated roles sharing same UI access
 */
export function CanAnyRole({ roles, children, fallback = null }) {
  const { hasAnyRole } = useAuth();

  if (hasAnyRole(roles)) {
    return children;
  }

  return fallback;
}