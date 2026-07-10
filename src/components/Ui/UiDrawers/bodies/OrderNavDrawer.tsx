import Link from "next/link";

type OrderNavDrawerProps = {
    links: Array<{
        href: string;
        label: string;
    }>;
};

export default function OrderNavDrawer({ links }: OrderNavDrawerProps) {
    return (
        <nav className="app-drawer-nav" aria-label="Order navigation">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className="app-drawer-nav__link"
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    );
}
