type TestModalProps = {
    message: string;
    openedFrom: string;
};

export default function TestModal({ message, openedFrom }: TestModalProps) {
    return (
        <div className="app-modal-body">
            <p className="app-modal-body__text">{message}</p>

            <div className="app-modal-body__meta">
                Opened from: <strong>{openedFrom}</strong>
            </div>
        </div>
    );
}
