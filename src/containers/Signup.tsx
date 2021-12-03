import { ChangeEvent, useState } from "react";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import LoaderButton from "../components/LoaderButton";
import { selectIsLoggedIn } from "../features/auth/authSlice";
import { useFormFields } from "../lib/hooksLib";
import "./Signup.css";

const Signup = () => {
    const [fields, handleFieldChange] = useFormFields({
        email: "",
        password: "",
        confirmPassword: "",
        confirmationCode: "",
    });
    const navigate = useNavigate();
    const [newUser, setNewUser] = useState(null as string | null);
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const [isLoading, setIsLoading] = useState(false);

    function validateForm() {
        return (
            fields.email.length > 0 &&
            fields.password.length > 0 &&
            fields.password === fields.confirmPassword
        );
    }

    function validateConfirmationForm() {
        return fields.confirmationCode.length > 0;
    }

    async function handleSubmit(event: ChangeEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsLoading(true);

        setNewUser("test");

        setIsLoading(false);
    }

    async function handleConfirmationSubmit(event: ChangeEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsLoading(true);
    }

    function renderConfirmationForm() {
        return (
            <Form onSubmit={handleConfirmationSubmit}>
                <Form.Group controlId="confirmationCode">
                    <Form.Label>Confirmation Code</Form.Label>
                    <Form.Control
                        size="lg"
                        autoFocus
                        type="tel"
                        onChange={handleFieldChange}
                        value={fields.confirmationCode}
                    />
                    <Form.Text muted>Please check your email for the code.</Form.Text>
                </Form.Group>
                <div className="d-grid gap-2 py-3">
                    <LoaderButton
                        size="lg"
                        type="submit"
                        variant="success"
                        isLoading={isLoading}
                        disabled={!validateConfirmationForm()}
                    >
                        Verify
                    </LoaderButton>
                </div>
            </Form>
        );
    }

    function renderForm() {
        return (
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        size="lg"
                        autoFocus
                        type="email"
                        value={fields.email}
                        onChange={handleFieldChange}
                    />
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        size="lg"
                        type="password"
                        value={fields.password}
                        onChange={handleFieldChange}
                    />
                </Form.Group>
                <Form.Group controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        size="lg"
                        type="password"
                        onChange={handleFieldChange}
                        value={fields.confirmPassword}
                    />
                </Form.Group>
                <div className="d-grid gap-2 py-3">
                    <LoaderButton
                        size="lg"
                        type="submit"
                        variant="success"
                        isLoading={isLoading}
                        disabled={!validateForm()}
                    >
                        Signup
                    </LoaderButton>
                </div>
            </Form>
        );
    }

    return (
        <div className="Signup">
            {newUser === null ? renderForm() : renderConfirmationForm()}
        </div>
    );
};

export default Signup;
