import { useState, useEffect, FormEvent, createRef, ChangeEvent, RefObject } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Login.css";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { performLogin, selectIsAuthBusy, selectIsLoggedIn } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAutoFilled, setAutoFilled] = useState(false);
    const dispatch = useAppDispatch();
    const isAuthBusy = useAppSelector(selectIsAuthBusy);
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const emailRef = createRef<HTMLInputElement>();
    const passwordRef = createRef<HTMLInputElement>();
    const navigate = useNavigate();

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

    useEffect(() => {
        // TODO: Causes an error. Need a better way to do this.
        if (isLoggedIn) {
            navigate('/');
        }
    }, [navigate, isLoggedIn]);

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
                    <Button size="lg" type="submit" disabled={isAuthBusy || !validateForm()}>
                        {isAuthBusy
                            ? <><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Please wait...</>
                            : <>Login</>
                        }
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default Login;
