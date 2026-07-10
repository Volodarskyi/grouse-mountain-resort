type OrderCartDrawerProps = {
    items: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
    }>;
    total: number;
};

export default function OrderCartDrawer({ items, total }: OrderCartDrawerProps) {
    return (
        <div className="app-drawer-cart">
            {items.length > 0 ? (
                <ul className="app-drawer-cart__list">
                    {items.map((item) => (
                        <li key={item.id} className="app-drawer-cart__item">
                            <div>
                                <p className="app-drawer-cart__name">
                                    {item.name}
                                </p>
                                <p className="app-drawer-cart__meta">
                                    ${item.price.toFixed(2)}
                                </p>
                            </div>
                            <span className="app-drawer-cart__quantity">
                                x{item.quantity}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="app-drawer-cart__empty">
                    No items in this order yet.
                </p>
            )}

            <div className="app-drawer-cart__total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
            </div>
        </div>
    );
}
