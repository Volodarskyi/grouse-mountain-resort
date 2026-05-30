import { HomePage } from "@/features/home/HomePage";

type PageProps = {
    params: Promise<{
        lang: string;
    }>;
};

const Page = async ({ params }: PageProps) => {
    const { lang } = await params;

    return <HomePage lang={lang} />;
};

export default Page;