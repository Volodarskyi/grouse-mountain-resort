import type { Locale } from "@/i18n/config";

type HomePageProps = {
    params: Promise<{
        lang: Locale;
    }>;
};

export default async function HomePage({ params }: HomePageProps) {

    return <div>Home Page</div>;
}