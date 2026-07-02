import { seedGrouseMountain } from "@/features/dev/lib/seedGrouseMountain";

export async function POST() {
    try {
        const seed = await seedGrouseMountain();

        return Response.json({ seed }, { status: 201 });
    } catch (error) {
        console.error(error);

        return Response.json(
            {
                error: "Seed failed",
            },
            { status: 500 },
        );
    }
}
