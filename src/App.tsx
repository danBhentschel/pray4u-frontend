import { useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "./App.css";
import AppRoutes from "./Routes";
import { LinkContainer } from "react-router-bootstrap";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { logout, selectIsAuthKnown, selectIsLoggedIn, setLoggedIn } from "./features/auth/authSlice";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";

const App = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isAuthKnown = useAppSelector(selectIsAuthKnown);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await Auth.signOut();
    dispatch(logout());
  }

  useEffect(() => {
    (async () => {
      try {
        await Auth.currentSession();
        dispatch(setLoggedIn());
      } catch (e) {
        if (e !== 'No current user') {
          // TODO: Handle this error properly
          alert(e);
        }
        dispatch(logout());
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    // TODO: Causes an error. Need a better way to do this.
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate, isLoggedIn]);

  return (
    isAuthKnown && (
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
    )
  );
}

export default App;
