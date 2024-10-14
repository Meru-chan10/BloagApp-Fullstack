import { useState, useEffect } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

const fetchBlogs = () => { 
  return axios.get('http://localhost:4000/blogs/all', { 
    headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` } 
  });
};

export default function AdminViewBlog() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs()
      .then(response => {
        console.log(response.data); // Check response structure
        setBlogs(response.data); // Adjust based on your response structure
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const refreshBlogs = () => {
    fetchBlogs()
      .then(response => {
        setBlogs(response.data); // Adjust based on your response structure
      })
      .catch(error => {
        console.error(error);
      });
  };

  const deleteBlog = (blog) => {
    fetch(`http://localhost:4000/blogs/deletePost/${blog._id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          Swal.fire({
            icon: "error",
            title: "Unsuccessful Blog Deletion",
            text: data.message
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Blog Deleted"
          });
          refreshBlogs();
        }
      })
      .catch(error => {
        console.error("Error deleting blog:", error);
      });
  };

  return (
    <>
      <h1 className="text-center my-4">Admin Blog Dashboard</h1>

      {blogs.length === 0 ? (
        <p>No blogs available</p>
      ) : (
        <Row className="g-4">
          {blogs.map((blog) => (
            <Col key={blog._id} xs={12}>
              <Card className="h-100 d-flex flex-row">
                <div className="p-2">
                  <Card.Img variant="left" src={blog.image} style={{ width: '500px', height: '700px' }} /> {/* Image on the left and larger */}
                </div>
                <div className="flex-grow-1">
                  <Card.Body>
                    <Card.Title>{blog.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Author: {blog.author.name} {/* Display author name */}
                    </Card.Subtitle>
                    <Card.Text>
                      {blog.content}  {/* Display full content */}
                    </Card.Text>
                    <Card.Text>
                      <strong>Creation Date:</strong> {new Date(blog.creation_date).toLocaleDateString()}
                    </Card.Text>
                    <Card.Text>
                      <strong>Comments:</strong>
                      {blog.comments && blog.comments.length > 0 ? (
                        blog.comments.map((comment) => (
                          <p key={comment._id}>
                            <strong>{comment.userId.name}:</strong> {comment.comment} {/* Display user name from userId */}
                          </p>
                        ))
                      ) : (
                        <p>No comments</p>
                      )}
                    </Card.Text>
                    <Button variant="danger" onClick={() => deleteBlog(blog)}>Delete</Button>
                  </Card.Body>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
}
