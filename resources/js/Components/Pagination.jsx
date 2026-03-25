import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    return (
        <div className="flex flex-wrap mt-6 -mb-1 justify-center">
            {links.map((link, key) => (
                link.url === null ? (
                    <div
                        key={key}
                        className="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-foreground opacity-50 border border-border rounded"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <Link
                        key={key}
                        className={`mr-1 mb-1 px-4 py-3 text-sm leading-4 border border-border rounded text-foreground hover:bg-background focus:border-kine-500 focus:text-kine-500 ${link.active ? 'bg-kine-600 text-white' : 'bg-card'}`}
                        href={link.url}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            ))}
        </div>
    );
}