import { useState, useEffect, FormEvent, createRef, ChangeEvent, RefObject } from "react";
import Form from "react-bootstrap/Form";
import "./Login.css";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { performLogin, selectIsAuthBusy, selectIsLoggedIn } from "../features/auth/authSlice";
import LoaderButton from "../components/LoaderButton";
import { Navigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAutoFilled, setAutoFilled] = useState(false);
    const dispatch = useAppDispatch();
    const isAuthBusy = useAppSelector(selectIsAuthBusy);
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const emailRef = createRef<HTMLInputElement>();
    const passwordRef = createRef<HTMLInputElement>();

    const validateForm = () => {
        return isAutoFilled || (email.length > 0 && password.length > 0);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        dispatch(performLogin({ email, password }));
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setAutoFilled(false);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setAutoFilled(false);
    };

    useEffect(() => {
        const isRefInputAutofilled = (ref: RefObject<HTMLInputElement>): boolean =>
            !!ref && !!ref.current && ref.current.matches(':-internal-autofill-selected');
        setTimeout(() => setAutoFilled(isRefInputAutofilled(emailRef) && isRefInputAutofilled(passwordRef)), 200);
    }, [emailRef, passwordRef]);

    if (isLoggedIn) {
        return <Navigate to='/' />;
    }

    return (
        <div className="Login">
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        ref={emailRef}
                        autoFocus
                        type="email"
                        size="lg"
                        value={email}
                        onChange={handleEmailChange}
                        disabled={isAuthBusy}
                    />
                </Form.Group>
                <div className="d-grid gap-2 py-3">
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            ref={passwordRef}
                            type="password"
                            size="lg"
                            value={password}
                            onChange={handlePasswordChange}
                            disabled={isAuthBusy}
                        />
                    </Form.Group>
                </div>
                <div className="d-grid gap-2 py-3">
                    <LoaderButton size="lg" type="submit" isLoading={isAuthBusy} disabled={!validateForm()}>
                        Login
                    </LoaderButton>
                </div>
            </Form>
        </div>
    );
};

export default Login;
