import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface NavLinkProps extends ComponentProps<'a'> {
    children: string;
    actual?: boolean;
}

export function NavLink({ children, actual, ...rest }: NavLinkProps) {
    return (
        <a {...rest} className={twMerge('font-medium text-sm',
        actual ? 'opacity-80' : null
        )}>{children}</a>
    )
}