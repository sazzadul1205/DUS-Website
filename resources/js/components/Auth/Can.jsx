// components/Auth/Can.jsx
import { useAuth } from '../../hooks/useAuth';

/**
 * Can
 * --------------------------------------------------
 * Permission-based conditional rendering component.
 *
 * Purpose:
 * - Renders children only if the user has a specific permission
 * - Otherwise renders an optional fallback (default: null)
 *
 * Usage:
 * <Can permission="post.create">
 *   <CreatePostButton />
 * </Can>
 *
 * This keeps UI authorization logic declarative and reusable.
 */
export function Can({ permission, children, fallback = null }) {
  const { hasPermission } = useAuth();

  // Guard: only render protected UI if permission exists
  if (hasPermission(permission)) {
    return children;
  }

  return fallback;
}