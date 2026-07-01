import Link from "next/link";

import { organizations } from "@/features/tenancy/model/tenancyData";

export default function OrganizationsPage() {
    return (
        <main style={{ padding: 32 }}>
            <h1>Organizations</h1>
            <ul>
                {organizations.map((organization) => (
                    <li key={organization.id}>
                        <Link href={`/org/${organization.slug}`}>
                            {organization.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}

