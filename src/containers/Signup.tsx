import { Auth } from "aws-amplify";
import { ChangeEvent, useState } from "react";
import Form from "react-bootstrap/Form";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import LoaderButton from "../components/LoaderButton";
import { performLogin, selectIsAuthBusy } from "../features/auth/authSlice";
import { onError } from "../lib/errorLib";
import { useFormFields } from "../lib/hooksLib";
import { ISignUpResult } from "amazon-cognito-identity-js";
import "./Signup.css";
import { useLocation, useNavigate } from "react-router-dom";

const Signup = () => {
    const [fields, handleFieldChange] = useFormFields({
        email: "",
        password: "",
        confirmPassword: "",
        confirmationCode: "",
    });
    const [newUser, setNewUser] = useState(null as ISignUpResult | null);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();
    const isAuthBusy = useAppSelector(selectIsAuthBusy);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const validateForm = () => {
        return (
            fields.email.length > 0 &&
            fields.password.length > 0 &&
            fields.password === fields.confirmPassword
        );
    }

    const validateConfirmationForm = () => {
        return fields.confirmationCode.length > 0;
    }

    const handleSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsLoading(true);

        try {
            const newUser = await Auth.signUp({
                username: fields.email,
                password: fields.password
            });
            setIsLoading(false);
            setNewUser(newUser);
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    const handleConfirmationSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsLoading(true);

        try {
            await Auth.confirmSignUp(fields.email, fields.confirmationCode);
            dispatch(performLogin({
                email: fields.email,
                password: fields.password,
                next: () => navigate(from, { replace: true })
            }));
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    const renderConfirmationForm = () => {
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
                        isLoading={isLoading || isAuthBusy}
                        disabled={!validateConfirmationForm()}
                    >
                        Verify
                    </LoaderButton>
                </div>
            </Form>
        );
    }

    const renderForm = () => {
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
