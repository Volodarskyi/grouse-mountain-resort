import type { OrderCartDrawerProps } from "@/store/reducers/drawerStore";

export default function OrderCartDrawer({
    items,
    onCancelOrder,
    onEditItem,
    onSubmitOrder,
    total,
}: OrderCartDrawerProps) {
    return (
        <div className="app-drawer-cart">
            {items.length > 0 ? (
                <ul className="app-drawer-cart__list">
                    {items.map((item) => (
                        <li key={item.cartKey ?? item.id}>
                            <button
                                type="button"
                                className="app-drawer-cart__item-button"
                                onClick={() => onEditItem(item.cartKey ?? item.id)}
                            >
                                <div className="app-drawer-cart__item-content">
                                    <p className="app-drawer-cart__name">
                                        {item.name}
                                    </p>
                                    <p className="app-drawer-cart__meta">
                                        ${item.price.toFixed(2)}
                                    </p>
                                    {(item.modifications ?? []).length > 0 ? (
                                        <div className="app-drawer-cart__modifications">
                                            {(item.modifications ?? []).map(
                                                (modification) => (
                                                    <span
                                                        key={`${item.cartKey ?? item.id}-${modification.type}-${modification.code}`}
                                                        className={[
                                                            "app-drawer-cart__modification",
                                                            `app-drawer-cart__modification--${modification.type}`,
                                                        ].join(" ")}
                                                    >
                                                        <span>
                                                            {modification.name}
                                                        </span>
                                                        {modification.quantity &&
                                                        modification.quantity >
                                                            1 ? (
                                                            <strong>
                                                                x
                                                                {
                                                                    modification.quantity
                                                                }
                                                            </strong>
                                                        ) : null}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    ) : null}
                                </div>
                                <span className="app-drawer-cart__quantity">
                                    x{item.quantity}
                                </span>
                            </button>
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

            <footer className="app-drawer-cart__footer">
                <button
                    type="button"
                    className="app-drawer-cart__button app-drawer-cart__button--secondary"
                    disabled={items.length === 0}
                    onClick={onCancelOrder}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="app-drawer-cart__button"
                    disabled={items.length === 0}
                    onClick={onSubmitOrder}
                >
                    Send Order
                </button>
            </footer>
        </div>
    );
}
