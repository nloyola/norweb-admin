import React from 'react';

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <nav>
                <li>
                    <Link href="/">Home</Link>
                </li>
                <li>
                    <Link href="/people">People</Link>
                </li>
            </nav>
            {children}
        </div>
    );
}
