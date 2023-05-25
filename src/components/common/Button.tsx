import React from "react";

interface ButtonProps {
    variant: "outlined" | "contained";
    children: React.ReactNode;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    className: React.HTMLAttributes<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
    const { children, variant, onClick, className } = props;

    const variantClass: () => string = () => {
        switch (variant) {
            case "contained":
                return "py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75";
            case "outlined":
                return "py-2 px-4 border border-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75";
        }
    };
    return (
        <button className={`${variantClass()} ${className}`} onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;
