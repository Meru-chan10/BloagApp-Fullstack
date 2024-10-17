import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';
import './styles/Register.css' // Import the CSS file for styling

export default function Register() {
  const { user } = useContext(UserContext);

  const [image, setImages] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [imageError, setImageError] = useState(null);
  const [isActive, setIsActive] = useState(false);

  function registerUser(e) {
    e.preventDefault();

    fetch(`https://blogapp-fullstack-wtto.onrender.com/users/register`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        image: image,
        name: name,
        email: email,
        password: password
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === "Registered Successfully") {
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');

        Swal.fire({
          title: "Registration Successful",
          icon: "success",
          text: "Thank you for registering!"
        });
      } else {
        Swal.fire({
          title: "Something went wrong.",
          icon: "error",
          text: "Please try again later or contact us for assistance"
        });
      }
    })
  }

  useEffect(() => {
    if ((image !== "" && name !== "" && email !== "" && password !== "" && confirmPassword !== "") && (password === confirmPassword)) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [image, name, email, password, confirmPassword]);

  const handleImageUpload = async (file) => {
    if (file.size > 50 * 1024 * 1024) { // Check if file size is greater than 50MB
      setImageError("File size is too large. Please upload a file less than 50MB.");
      return;
    }

    const imgBase64 = await convertToBase64(file);
    setImages(imgBase64);
    setImageError(null);
  }

  

  return (
    (user.id !== null) ?
      <Navigate to="/login" />
      :
      <div className="register-container"> {/* Add this wrapper div */}
        <Form className="register-form" onSubmit={(e) => registerUser(e)}>
          <h1 className="my-5 text-center">Register</h1>

          <Form.Group>
            <Form.Label>Upload Profile picture</Form.Label>
            <Form.Control 
              type="file" 
              accept='.jpeg, .png, .jpg'
              onChange={e => handleImageUpload(e.target.files[0])} 
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Name:</Form.Label>
            <Form.Control 
              type="text"
              placeholder="Enter your Name" 
              required 
              value={name} 
              onChange={e => setName(e.target.value)} 
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email:</Form.Label>
            <Form.Control 
              type="email"
              placeholder="Enter Email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password:</Form.Label>
            <Form.Control 
              type="password"
              placeholder="Enter Password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Confirm Password:</Form.Label>
            <Form.Control 
              type="password"
              placeholder="Enter Confirm Password" 
              required 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
            />
          </Form.Group>

          <Button 
            variant="dark" 
            type="submit" 
            id='register'
            className='btn-register'
          >
            Create Account
          </Button>
          <p className="my-3 mb-3 text-center">Already have an account? <Link to="/Login">Login</Link></p>
        </Form>
      </div>
  );
}

function convertToBase64(file) {
  return new Promise((res, rej) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      res(fileReader.result);
    }
    fileReader.onerror = (e) => {
      rej(e);
    }
  })
}
