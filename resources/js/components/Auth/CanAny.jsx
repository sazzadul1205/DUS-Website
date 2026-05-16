// components/Auth/CanAny.jsx
import { useAuth } from '../../hooks/useAuth';

/**
 * CanAny
 * --------------------------------------------------
 * Renders children if the user has ANY of the provided permissions.
 *
 * Example:
 * <CanAny permissions={['post.edit', 'post.delete']}>
 *   <PostActions />
 * </CanAny>
 *
 * Useful for grouped feature access.
 */
export function CanAny({ permissions, children, fallback = null }) {
  const { hasAnyPermission } = useAuth();

  // Expects permissions as an array of strings
  if (hasAnyPermission(permissions)) {
    return children;
  }

  return fallback;
}