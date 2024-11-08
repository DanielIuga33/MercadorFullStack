import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import './Header.css';

const Header = ({ userData, setUserData }) => {

    const logout = () => {
        const reset = ({
            id: '',
            name: '',
            surname: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            birthDate: '',
            country: '',
            city: '',
            street: '',
            role: '',
            carIds: []
        });
        setUserData(reset);
    }

    return (
        <div className="navBar">
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container fluid>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <div className="navbar-left">
                            <NavLink className="nav-link" id="Home" to="/">Home</NavLink>
                            <NavLink className="nav-link" id="Account" to="/account">Account</NavLink>
                        </div>
                        <Nav className="ms-auto my-2 my-lg-0 options navbar-right" navbarScroll>
                            {!userData.email && <NavLink className="nav-link" id="login" to="/login">Login</NavLink>}
                            {!userData.email && <NavLink className="nav-link" id="register" to="/register">Register</NavLink>}
                            {userData.email && <button onClick={logout} className="nav-link logout-btn" id="logout">Logout</button>}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

export default Header;
