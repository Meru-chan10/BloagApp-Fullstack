import { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function AddBlog() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState(user.name || '');
  const [imageError, setImageError] = useState(null);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const createBlog = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:4000/blogs/addPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ image, title, content, author }),
      });

      const data = await response.json();

      if (data.error) {
        Swal.fire({
          icon: 'error',
          title: 'Unsuccessful Blog Creation',
          text: data.error,
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Blog Added',
        });
        navigate('/blogs');
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Unsuccessful Blog Creation',
        text: 'An error occurred while adding blog.',
      });
    }

    setImage('');
    setTitle('');
    setContent('');
    setAuthor('');
  };

  const handleImageUpload = async (file) => {
    // Check if the user has selected a file
    if (!file) {
      // If no file is selected (user canceled), do nothing
      setImageError(null);
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // Check if file size is greater than 50MB
      setImageError("File size is too large. Please upload a file less than 50MB.");
      return;
    }

    const imgBase64 = await convertToBase64(file);
    setImage(imgBase64);
    setImageError(null);
  };

  return (
    <>
      <h1 className="my-5 text-center">Add Blog</h1>
      <Form onSubmit={createBlog}>
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
          <Form.Label>Title:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Title"
            required
            value={title}
            onChange={handleInputChange(setTitle)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Content:</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Enter Content"
            required
            value={content}
            onChange={handleInputChange(setContent)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Author:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Author"
            required
            value={author}
            onChange={handleInputChange(setAuthor)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="my-5">
          Submit
        </Button>
      </Form>
    </>
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
  