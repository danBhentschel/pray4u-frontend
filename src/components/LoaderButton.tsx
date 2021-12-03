import { ButtonProps } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { BsArrowRepeat } from "react-icons/bs";
import "./LoaderButton.css";

export interface LoaderButtonParameters {
    isLoading: boolean;
    className?: string;
    disabled?: boolean;
}

const LoaderButton = ({
    isLoading,
    className = "",
    disabled = false,
    ...props
}: LoaderButtonParameters & ButtonProps) => {
    return (
        <Button
            disabled={disabled || isLoading}
            className={`LoaderButton ${className}`}
            {...props}
        >
            {isLoading && <BsArrowRepeat className="spinning" />}
            {props.children}
        </Button>
    );
};

export default LoaderButton;
