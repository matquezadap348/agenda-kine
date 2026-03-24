import { usePage } from '@inertiajs/react';

export function usePermission() {
    const { auth } = usePage().props;

    const hasRole = (role) => auth.user?.roles.includes(role);
    const hasPermission = (permission) => auth.user?.permissions.includes(permission);

    return { hasRole, hasPermission };
}