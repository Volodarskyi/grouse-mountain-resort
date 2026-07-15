import { useEffect, useState } from "react";

type ConfirmActionProps = {
    message: string;
    details?: string;
    initialNotes?: string;
    notesLabel?: string;
    onNotesChange?: (notes: string) => void;
};

export default function ConfirmAction({
    details,
    initialNotes = "",
    message,
    notesLabel,
    onNotesChange,
}: ConfirmActionProps) {
    const [notes, setNotes] = useState(initialNotes);

    useEffect(() => {
        onNotesChange?.(notes);
    }, [notes, onNotesChange]);

    return (
        <div className="app-modal-body">
            <p className="app-modal-body__title">{message}</p>

            {details ? (
                <p className="app-modal-body__text">{details}</p>
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
