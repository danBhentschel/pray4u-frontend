import { useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "./App.css";
import AppRoutes from "./Routes";
import { LinkContainer } from "react-router-bootstrap";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { checkLoggedIn, logout, selectAuthProvider, selectIsAuthBusy, selectIsAuthKnown, selectIsLoggedIn } from "./features/auth/authSlice";

const App = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isAuthKnown = useAppSelector(selectIsAuthKnown);
  const isAuthBusy = useAppSelector(selectIsAuthBusy);
  const authProvider = useAppSelector(selectAuthProvider);
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    dispatch(logout(authProvider));
  }

  useEffect(() => {
    if (!isAuthKnown && !isAuthBusy) {
      dispatch(checkLoggedIn());
    }
  }, [dispatch, isAuthKnown, isAuthBusy]);

  if (isAuthKnown) {
    return (
      <div className="App container py-3">
        <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
          <LinkContainer to="/">
            <Navbar.Brand className="font-weight-bold text-muted px-3">
              Pray4U
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav activeKey={window.location.pathname}>
              {isLoggedIn ? (
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <Nav.Link href="/signup">Signup</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Nav.Link href="/login">Login</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>

        </Navbar>
        <AppRoutes />
      </div>
    );
  }

  return <></>;
}

export default App;
