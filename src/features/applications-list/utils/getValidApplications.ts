import type { Application } from "@/types/applications";

export function getValidApplications(applications: Application[]) {
    return applications.filter((application) => {
        const applicant = application.applicants?.[0];

        return Boolean(
            applicant?.firstName &&
            applicant?.lastName &&
            applicant?.email &&
            applicant?.phone,
        );
    });
}