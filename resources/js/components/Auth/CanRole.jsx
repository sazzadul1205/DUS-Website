// components/Auth/CanRole.jsx
import { useAuth } from '../../hooks/useAuth';

/**
 * CanRole
 * --------------------------------------------------
 * Role-based conditional renderer (single role check).
 *
 * Example:
 * <CanRole role="admin">
 *   <AdminPanel />
 * </CanRole>
 *
 * Note:
 * - Role checks are broader than permissions
 * - Typically used for layout-level access control
 */
export function CanRole({ role, children, fallback = null }) {
  const { hasRole } = useAuth();

  if (hasRole(role)) {
    return children;
  }

  return fallback;
}