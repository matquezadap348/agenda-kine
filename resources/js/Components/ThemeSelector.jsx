import { router, usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';

export default function ThemeSelector() {
    const { auth } = usePage().props;
    const currentTheme = auth.user.theme_preference || 'system';

    const handleThemeChange = (theme) => {
        router.post(route('theme.update'), { theme }, {
            preserveScroll: true,
        });
    };

    return (
        <Dropdown>
            <Dropdown.Trigger>
                <span className="inline-flex rounded-md">
                    <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-transparent bg-card px-3 py-2 text-sm font-medium leading-4 text-foreground transition duration-150 ease-in-out hover:opacity-70 focus:outline-none"
                    >
                        {currentTheme === 'light' ? 'Claro' : currentTheme === 'dark' ? 'Oscuro' : 'Sistema'}
                        <svg className="-me-0.5 ms-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </span>
            </Dropdown.Trigger>

            <Dropdown.Content>
                <button onClick={() => handleThemeChange('light')} className="block w-full px-4 py-2 text-start text-sm leading-5 text-foreground hover:bg-background focus:bg-background transition duration-150 ease-in-out">Claro</button>
                <button onClick={() => handleThemeChange('dark')} className="block w-full px-4 py-2 text-start text-sm leading-5 text-foreground hover:bg-background focus:bg-background transition duration-150 ease-in-out">Oscuro</button>
                <button onClick={() => handleThemeChange('system')} className="block w-full px-4 py-2 text-start text-sm leading-5 text-foreground hover:bg-background focus:bg-background transition duration-150 ease-in-out">Sistema</button>
            </Dropdown.Content>
        </Dropdown>
    );
}
