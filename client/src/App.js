//  Dependencies
import { useState, useEffect } from 'react';
import  { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {UserProvider} from './UserContext'
import {Container} from 'react-bootstrap'

// PAges and Components
import AppNavbar from './components/AppNavbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register';
import Logout from './pages/Logout';
import Error from './pages/Error';
import AddBlog from './pages/AddBlog';
import Blogs from './pages/Blogs'
import BlogDetails from './components/BlogDetails';

import './App.css'

export default function App() {
  
    const [user, setUser] = useState({
        id: null,
        isAdmin: null
      });

  
    function unsetUser(){
        localStorage.clear()
      }
  
      useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          fetch(`http://localhost:4000/users/details`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(res => res.json())
          .then(data => {
            if (data.auth !== "Failed") {
              setUser({
                id: data._id,
                isAdmin: data.isAdmin
              });
            } else {
              unsetUser();
            }
          })
          .catch(error => {
            console.error(error);
            unsetUser();
          });
        } else {
          unsetUser();
        }
      }, []);


      return (
        <>
            <UserProvider value={{ user, setUser, unsetUser }}>
                <Router>
                    <div className="full-background">
                        <div className="overlay"></div>
                        <AppNavbar />
                        <Container className="content">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/logout" element={<Logout />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/addBlog" element={<AddBlog />} />
                                <Route path="/blogs" element={<Blogs />} />
                                <Route path="/blogs/:blogId" element={<BlogDetails />} />
                                <Route path="/*" element={<Error />} />
                            </Routes>
                        </Container>
                    </div>
                </Router>
            </UserProvider>
        </>
)

};

