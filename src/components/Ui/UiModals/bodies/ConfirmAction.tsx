type ConfirmActionProps = {
    message: string;
    details?: string;
};

export default function ConfirmAction({ message, details }: ConfirmActionProps) {
    return (
        <div className="app-modal-body">
            <p className="app-modal-body__title">{message}</p>

            {details ? (
                <p className="app-modal-body__text">{details}</p>
            ) : null}
        </div>
    );
}
