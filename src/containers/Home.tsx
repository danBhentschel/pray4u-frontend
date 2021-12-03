import { useEffect } from "react";
import { BsArrowRepeat } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { postHello, selectCognitoId, selectHelloMessage, selectIsHelloReady, selectIsHelloSent } from "../features/hello/helloSlice";
import "./Home.css";

const Home = () => {
    const isHelloSent = useAppSelector(selectIsHelloSent);
    const isHelloReady = useAppSelector(selectIsHelloReady);
    const message = useAppSelector(selectHelloMessage);
    const cognitoId = useAppSelector(selectCognitoId);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!isHelloSent) {
            dispatch(postHello('Dan Hentschel'));
        }
    }, [isHelloSent, dispatch]);

    return (
        <div className="Home">
            <div className="lander">
                <h1>Pray4U</h1>
                <p className="text-muted">Prayer-based social network</p>
                {isHelloReady
                    ? <>
                        <p className="text-muted">{message}</p>
                        <p className="text-muted">Cognito ID: {cognitoId}</p>
                    </>
                    : <p className="text-muted"><BsArrowRepeat className="spinning" size="70" /></p>
                }
            </div>
        </div>
    );
};

export default Home;
