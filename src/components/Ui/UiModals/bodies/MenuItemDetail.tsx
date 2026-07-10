type MenuItemDetailProps = {
    calories: number;
    description: string;
    name: string;
    price: number;
};

export default function MenuItemDetail({
    calories,
    description,
    name,
    price,
}: MenuItemDetailProps) {
    return (
        <div className="app-modal-body">
            <p className="app-modal-body__title">{name}</p>
            <p className="app-modal-body__text">
                ${price.toFixed(2)} / cal: {calories}
            </p>
            {description ? (
                <p className="app-modal-body__text">{description}</p>
            ) : null}
        </div>
    );
}
