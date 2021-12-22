import { useState, useEffect, FormEvent, createRef, ChangeEvent, RefObject } from "react";
import Form from "react-bootstrap/Form";
import "./Login.css";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { performGoogleLogin, performLogin, selectIsAuthBusy, selectIsLoggedIn } from "../features/auth/authSlice";
import LoaderButton from "../components/LoaderButton";
import { Navigate } from "react-router-dom";
import { useFormFields } from "../lib/hooksLib";

const Login = () => {
    const [fields, handleFieldChange] = useFormFields({
        email: "",
        password: ""
    });
    const [isAutoFilled, setAutoFilled] = useState(false);
    const dispatch = useAppDispatch();
    const isAuthBusy = useAppSelector(selectIsAuthBusy);
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const emailRef = createRef<HTMLInputElement>();
    const passwordRef = createRef<HTMLInputElement>();

    const validateForm = () => {
        return isAutoFilled || (fields.email.length > 0 && fields.password.length > 0);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        dispatch(performLogin({
            email: fields.email,
            password: fields.password,
        }));
    };

    const handleFieldChangeWithAutoFilled = (e: ChangeEvent<HTMLInputElement>) => {
        handleFieldChange(e);
        setAutoFilled(false);
    };

    const googleSignIn = () => {
        dispatch(performGoogleLogin());
    }

    useEffect(() => {
        const isRefInputAutofilled = (ref: RefObject<HTMLInputElement>): boolean =>
            !!ref && !!ref.current && ref.current.matches(':-internal-autofill-selected');
        setTimeout(() => setAutoFilled(isRefInputAutofilled(emailRef) && isRefInputAutofilled(passwordRef)), 200);

        const createScript = () => {
            // load the Google SDK
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/platform.js';
            script.async = true;
            script.onload = initGapi;
            document.body.appendChild(script);
        }

        const initGapi = () => {
            // init the Google SDK client
            const g = window.gapi;
            g.load('auth2', function () {
                g.auth2.init({
                    client_id: '344279965332-4cma6kuef2essduetjc4mb19dpr5663b.apps.googleusercontent.com',
                    // authorized scopes
                    scope: 'profile email openid'
                });
            });
        }

        const ga = window.gapi && window.gapi.auth2 ?
            window.gapi.auth2.getAuthInstance() :
            null;

        if (!ga) createScript();
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
