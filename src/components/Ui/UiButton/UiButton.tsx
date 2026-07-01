import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import "./UiButton.Styles.scss";

type UiButtonVariant = "primary";
type UiButtonSize = "s" | "m" | "l";

type UiButtonProps = {
    children: ReactNode;
    className?: string;
    href?: string;
    size?: UiButtonSize;
    uppercase?: boolean;
    variant?: UiButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function UiButton({
    children,
    className = "",
    href,
    size = "m",
    type = "button",
    uppercase = false,
    variant = "primary",
    ...buttonProps
}: UiButtonProps) {
    const classes = [
        "ui-button",
        `ui-button--${variant}`,
        `ui-button--${size}`,
        uppercase ? "ui-button--uppercase" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    if (href) {
        return (
            <Link href={href} className={classes}>
                {children}
            </Link>
        );
    }

    return (
        <button type={type} className={classes} {...buttonProps}>
            {children}
        </button>
    );
}
