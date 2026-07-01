import type { ShiftReportPreviewModalProps } from "@/store/reducers/modalStore";

export default function ShiftReportPreview({
    reportId,
    aiErrors,
}: ShiftReportPreviewModalProps) {
    return (
        <div className="app-modal-body">
            <div className="app-modal-body__meta">
                Report ID: <strong>{reportId}</strong>
            </div>

            <ul className="app-modal-body__list">
                {aiErrors.map((error) => (
                    <li key={error}>{error}</li>
                ))}
            </ul>
        </div>
    );
}
