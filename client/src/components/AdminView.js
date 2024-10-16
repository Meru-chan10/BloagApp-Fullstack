import { useState, useEffect } from 'react';
import { Form, Card, Button, Row, Col, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

const fetchBlogs = () => { 
  return axios.get('http://localhost:4000/blogs/all', { 
    headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` } 
  });
};

export default function AdminViewBlog() {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentBlog, setCurrentBlog] = useState({});
  const [image, setImages] = useState('');
  const [imageError, setImageError] = useState(null);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const response = await fetchBlogs();
        setBlogs(response.data); // Adjust based on your response structure
      } catch (error) {
        console.error(error);
      }
    };

    loadBlogs();
  }, []);

  const refreshBlogs = async () => {
    try {
      const response = await fetchBlogs();
      setBlogs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const editBlog = async (blog) => {
    try {
      console.log("Updating blog:", blog);
      console.log("PATCH URL:", `http://localhost:4000/blogs/updatePost/${blog._id}`);
      
      const response = await axios.patch(`http://localhost:4000/blogs/updatePost/${blog._id}`, {
        title: blog.title,
        content: blog.content,
        author: blog.author,
        image: image || blog.image
      }, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
  
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Blog Updated"
        });
        refreshBlogs();
        setShowEditModal(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Unsuccessful Blog Update",
          text: response.data.message
        });
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      Swal.fire({
        icon: "error",
        title: "Error Updating Blog",
        text: error.message
      });
    }

    console.log(`Blog ID for update: ${blog._id}`);

  };
  

  const handleEdit = (blog) => {
    setCurrentBlog(blog);
    setShowEditModal(true);
  };

  const deleteBlog = async (blog) => {
    try {
      const response = await fetch(`http://localhost:4000/blogs/deletePost/${blog._id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
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
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const deleteComment = async (postId, commentId) => {
    try {
      const response = await fetch(`http://localhost:4000/blogs/deleteComment/${postId}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ commentId })
      });
      const data = await response.json();
      if (data.message === "Comment deleted successfully") {
        Swal.fire({
          icon: "success",
          title: "Comment Deleted"
        });
        refreshBlogs();
      } else {
        Swal.fire({
          icon: "error",
          title: "Unsuccessful Comment Deletion",
          text: data.message
        });
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    return blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || blog.content.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleImageUpload = async (file) => {
    if (file.size > 50 * 1024 * 1024) { // check if file size is greater than 50MB
		  setImageError("File size is too large. Please upload a file less than 50MB.");
		  return;
		}

    const imgBase64 = await convertToBase64(file);
    console.log(imgBase64);
    setImages(imgBase64);
    setImageError(null);
  }



  return (
    <>
      <h1 className="text-center my-4">Admin Blog Dashboard</h1>
      <Form>
        <Form.Group className='my-5'>
          <Form.Label><strong>Search Blogs:</strong></Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter search query"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Form.Group>
      </Form>

      {filteredBlogs.length === 0 ? (
        <p>No blogs available</p>
      ) : (
        <Row className="g-4">
          {filteredBlogs.map((blog) => (
            <Col key={blog._id} xs={12}>
              <Card className="h-100 d-flex flex-row">
                <div className="p-2">
                  <Card.Img variant="left" src={blog.image} style={{ width: '500px', height: '700px' }} />
                </div>
                <div className="flex-grow-1">
                  <Card.Body>
                    <Card.Title>{blog.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Author: {blog.author}
                    </Card.Subtitle>
                    <Card.Text>{blog.content}</Card.Text>
                    < Card.Text>
                      <strong>Creation Date:</strong> {new Date(blog.createdOn).toLocaleDateString()}
                    </Card.Text>
                    <Card.Text>
                      <strong><span>Comments:</span></strong>
                      {blog.comments && blog.comments.length > 0 ? (
                        blog.comments.map((comment) => (
                          <div key={comment._id} className="d-flex align-items-center">
                            <img
                              src={comment.image}
                              alt={comment.name}
                              style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                marginRight: '10px'
                              }}
                            />
                            <span>
                              <strong>{comment.name}:</strong> {comment.comment}
                            </span>
                            <Button variant="danger" onClick={() => deleteComment(blog._id, comment._id)}>Delete</Button>
                          </div>
                        ))
                      ) : (
                        <span>No comments on this blog.</span>
                      )}
                    </Card.Text>
                    <Button variant="primary" onClick={() => handleEdit(blog)}>Edit Blog</Button>
                    <Button variant="danger" onClick={() => deleteBlog(blog)}>Delete Blog</Button>
                  </Card.Body>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

<Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" value={currentBlog.title} onChange={(e) => setCurrentBlog({ ...currentBlog, title: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Content</Form.Label>
              <Form.Control as="textarea" rows={3} value={currentBlog.content} onChange={(e) => setCurrentBlog({ ...currentBlog, content: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Author</Form.Label>
              <Form.Control type="text" value={currentBlog.author} onChange={(e) => setCurrentBlog({ ...currentBlog, author: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                accept=".jpeg, .png, .jpg"
                onChange={e => handleImageUpload(e.target.files[0])}
              />
              {imageError && <small className="text-danger">{imageError}</small>}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button variant="primary" onClick={() => editBlog(currentBlog)}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
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
