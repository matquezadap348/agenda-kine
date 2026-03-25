import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useLayoutEffect } from 'react';
import ThemeSelector from '@/Components/ThemeSelector';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const roles = user.roles; // Extraemos los roles inyectados en el Middleware

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    useLayoutEffect(() => {
        const theme = user.theme_preference || 'system';
        const root = document.documentElement;

        const applyTheme = (t) => {
            if (t === 'system') {
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                root.setAttribute('data-theme', systemTheme);
            } else {
                root.setAttribute('data-theme', t);
            }
        };

        applyTheme(theme);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => applyTheme(theme);
        
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [user.theme_preference]);

    return (
        <div className="min-h-screen bg-background">
            <nav className="border-b border-border bg-card">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-foreground" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>
                                
                                <NavLink
                                    href={route('citas.index')}
                                    active={route().current('citas.*')}
                                >
                                    Agenda
                                </NavLink>

                                {/* Solo Admin y Secretaria ven Profesionales y Pacientes */}
                                {(roles.includes('admin') || roles.includes('secretaria')) && (
                                    <>
                                        <NavLink
                                            href={route('profesionales.index')}
                                            active={route().current('profesionales.*')}
                                        >
                                            Profesionales
                                        </NavLink>
                                        <NavLink
                                            href={route('pacientes.index')}
                                            active={route().current('pacientes.*')}
                                        >
                                            Pacientes
                                        </NavLink>
                                    </>
                                )}

                                {/* Solo el Admin ve Especialidades */}
                                {roles.includes('admin') && (
                                    <NavLink
                                        href={route('especialidades.index')}
                                        active={route().current('especialidades.*')}
                                    >
                                        Especialidades
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <ThemeSelector />
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-card px-3 py-2 text-sm font-medium leading-4 text-foreground opacity-80 transition duration-150 ease-in-out hover:opacity-100 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>Dashboard</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('citas.index')} active={route().current('citas.*')}>Agenda</ResponsiveNavLink>
                        
                        {(roles.includes('admin') || roles.includes('secretaria')) && (
                            <>
                                <ResponsiveNavLink href={route('profesionales.index')} active={route().current('profesionales.*')}>Profesionales</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('pacientes.index')} active={route().current('pacientes.*')}>Pacientes</ResponsiveNavLink>
                            </>
                        )}
                        
                        {roles.includes('admin') && (
                            <ResponsiveNavLink href={route('especialidades.index')} active={route().current('especialidades.*')}>Especialidades</ResponsiveNavLink>
                        )}
                    </div>

                    <div className="border-t border-border pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-foreground">{user.name}</div>
                            <div className="text-sm font-medium text-foreground opacity-80">{user.email}</div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Perfil</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">Cerrar Sesión</ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-card shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 text-foreground">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}