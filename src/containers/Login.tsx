import { useState, useEffect, FormEvent, createRef, ChangeEvent, RefObject } from "react";
import Form from "react-bootstrap/Form";
import "./Login.css";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { performGoogleLogin, performLogin, selectIsAuthBusy } from "../features/auth/authSlice";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../lib/hooksLib";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
    const [fields, handleFieldChange] = useFormFields({
        email: "",
        password: ""
    });
    const [isAutoFilled, setAutoFilled] = useState(false);
    const dispatch = useAppDispatch();
    const isAuthBusy = useAppSelector(selectIsAuthBusy);
    const emailRef = createRef<HTMLInputElement>();
    const passwordRef = createRef<HTMLInputElement>();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const validateForm = () => {
        return isAutoFilled || (fields.email.length > 0 && fields.password.length > 0);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        dispatch(performLogin({
            email: fields.email,
            password: fields.password,
            next: () => navigate(from, { replace: true })
        }));
    };

    const handleFieldChangeWithAutoFilled = (e: ChangeEvent<HTMLInputElement>) => {
        handleFieldChange(e);
        setAutoFilled(false);
    };

    const googleSignIn = () => {
        dispatch(performGoogleLogin(() => navigate(from, { replace: true })));
    }

    useEffect(() => {
        const isRefInputAutofilled = (ref: RefObject<HTMLInputElement>): boolean =>
            !!ref && !!ref.current && ref.current.matches(':-internal-autofill-selected');
        setTimeout(() => setAutoFilled(isRefInputAutofilled(emailRef) && isRefInputAutofilled(passwordRef)), 200);
    }, [emailRef, passwordRef]);

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
                        value={fields.email}
                        onChange={handleFieldChangeWithAutoFilled}
                        disabled={isAuthBusy}
                    />
                </Form.Group>
                <div className="d-grid gap-2 py-3">
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            ref={passwordRef}
                            type="password"
                            size="lg"
                            value={fields.password}
                            onChange={handleFieldChangeWithAutoFilled}
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
            <div>
                <button onClick={googleSignIn}>Sign in with Google</button>
            </div>
        </div>
    );
};

export default Login;
