// Dependencies
import { useContext, useState } from "react";
import { Navbar } from "react-bootstrap";
import Nav from  "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { Link, NavLink } from 'react-router-dom';

// Pages
import UserContext from "../UserContext";



export default function AppNavbar() {
    
    const { user } = useContext(UserContext);

return(

    <Navbar bg="primary" expand="lg">

        <Navbar.Brand as={Link} to="/" exact="true" className="ms-2">GameSphere</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">
                <Nav.Link as={NavLink} to="/" exact="true">Home</Nav.Link>
                <Nav.Link as={Link} to="/blogs">Blogs</Nav.Link>
                {(user.id !== null) 
                ? 
                (user.isAdmin === true) 
                    ? 
                    <>
                        <Nav.Link as={Link} to="/addBlog">Add Blog</Nav.Link>
                        <Nav.Link as={Link} to="/comments">Comments</Nav.Link>
                        <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
                    </>
                    : 
                    <>
                        <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
                    </>
                : 
                <>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    <Nav.Link as={Link} to="/register">Register</Nav.Link>
                </>
            }
            </Nav>
        </Navbar.Collapse>

</Navbar>
)
};
