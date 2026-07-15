import { useEffect, useState } from "react";

type ConfirmActionProps = {
    message: string;
    customerNameLabel?: string;
    details?: string;
    initialNotes?: string;
    notesLabel?: string;
    onCustomerNameChange?: (customerName: string) => void;
    onNotesChange?: (notes: string) => void;
    summaryItems?: Array<{
        label: string;
        value: string;
    }>;
};

export default function ConfirmAction({
    customerNameLabel,
    details,
    initialNotes = "",
    message,
    notesLabel,
    onCustomerNameChange,
    onNotesChange,
    summaryItems,
}: ConfirmActionProps) {
    const [customerName, setCustomerName] = useState("");
    const [notes, setNotes] = useState(initialNotes);

    useEffect(() => {
        onCustomerNameChange?.(customerName);
    }, [customerName, onCustomerNameChange]);

    useEffect(() => {
        onNotesChange?.(notes);
    }, [notes, onNotesChange]);

    return (
        <div className="app-modal-body">
            <p className="app-modal-body__title">{message}</p>

            {details ? (
                <p className="app-modal-body__text">{details}</p>
            ) : null}

            {summaryItems && summaryItems.length > 0 ? (
                <dl className="app-modal-body__summary">
                    {summaryItems.map((item) => (
                        <div key={item.label}>
                            <dt>{item.label}</dt>
                            <dd>{item.value}</dd>
                        </div>
                    ))}
                </dl>
            ) : null}

            {customerNameLabel ? (
                <label className="app-modal-body__field">
                    <span>{customerNameLabel}</span>
                    <input
                        className="app-modal-body__input app-modal-body__input--single"
                        value={customerName}
                        onChange={(event) =>
                            setCustomerName(event.target.value)
                        }
                    />
                </label>
            ) : null}

            {notesLabel ? (
                <label className="app-modal-body__field">
                    <span>{notesLabel}</span>
                    <textarea
                        className="app-modal-body__input"
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                    />
                </label>
            ) : null}
        </div>
    );
}
