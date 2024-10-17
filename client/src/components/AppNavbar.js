// Dependencies
import { useContext } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";

// Pages
import UserContext from "../UserContext";

// CSS
import './styles/AppNavbar.css'; // Import the CSS file

export default function AppNavbar() {
  const { user } = useContext(UserContext);

  return (
    <Navbar expand="lg" className="navbar">
      <Container fluid> {/* Use fluid to allow full width */}
        <Navbar.Brand as={Link} to="/" className="ms-2"> {/* Removed exact="true" */}
          GameSphere
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={NavLink} to="/" exact>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/blogs">Blogs</Nav.Link>
            {user.id !== null ? (
              user.isAdmin ? (
                <>
                  <Nav.Link as={Link} to="/addBlog">Add Blog</Nav.Link>
                  <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
                </>
              ) : (
                <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
              )
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
