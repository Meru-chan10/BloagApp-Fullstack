import { useState, useEffect } from 'react';
import { Container, Card, Button, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert

export default function BlogDetails() {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState(""); 
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`https://blogapp-fullstack-wtto.onrender.com/blogs/getPost/${blogId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setBlog(data); 
      } catch (error) {
        console.error("Failed to fetch blog details:", error);
      }
    };

    fetchBlog();
  }, [blogId]);

  const handleCommentChange = (e) => setComment(e.target.value);

  const handleCommentSubmit = async () => {
    if (!comment) return; 

    try {
      const response = await fetch(`https://blogapp-fullstack-wtto.onrender.com/blogs/addComment/${blogId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
        },
        body: JSON.stringify({ comment }),
      });

      if (!response.ok) throw new Error('Failed to add comment');

      const savedComment = await response.json();

     
      setBlog((prevBlog) => ({
        ...prevBlog,
        comments: [...prevBlog.comments, savedComment.comment],
      }));

      setComment("");

      Swal.fire({
        icon: 'success',
        title: 'Comment Added!',
        text: 'Your comment has been successfully added.',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Failed to add comment:", error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Add Comment',
        text: 'Please try again later.',
      });
    }
  };

  const isLoggedIn = !!localStorage.getItem('token'); 

  const handleLoginRedirect = () => {
    navigate('/login'); 
  };

  if (!blog) return <div>Loading...</div>; 

  return (
    <Container>
      <h1 className="text-center" style={{ marginTop: '3em' }}>{blog.title}</h1>
      <Card>
        <Card.Img
          variant="top"
          src={blog.image}
          style={{ width: '100%', height: '600px', objectFit: 'cover' }} 
        />
        <Card.Body>
          <Card.Text>{blog.content}</Card.Text>
          <Card.Text><strong>Author:</strong> {blog.author}</Card.Text>
          <Card.Text><strong>Created On:</strong> {new Date(blog.createdOn).toLocaleDateString()}</Card.Text>
        </Card.Body>
      </Card>

      {/* Comment Section */}
      <strong><span>Comments:</span></strong>
      {blog.comments.length > 0 ? (
        blog.comments.map((comment) => (
          <div key={comment._id} className="d-flex align-items-center mt-2">
            <img
              src={comment.image} 
              alt={comment.name} 
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                marginRight: '10px',
              }}
            />
            <span>
              <strong>{comment.name}:</strong> {comment.comment}
            </span>
          </div>
        ))
      ) : (
        <p>No comments yet.</p>
      )}

      {isLoggedIn ? (
        <Form className="mt-3">
          <Form.Group controlId="commentInput">
            <Form.Control
              as="textarea"
              rows={3}
              value={comment}
              onChange={handleCommentChange}
              placeholder="Write a comment..."
            />
          </Form.Group>
          <Button variant="primary" onClick={handleCommentSubmit} className="mt-2">
            Submit Comment
          </Button>
        </Form>
      ) : (
        <Button variant="primary" className="mt-2" onClick={handleLoginRedirect}>
          Login to add comment
        </Button>
      )}
    </Container>
  );
}