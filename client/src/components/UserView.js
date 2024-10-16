import { useState, useEffect } from 'react';
import BlogCard from './BlogCard';
import { Container, Row, Col } from 'react-bootstrap';

export default function UserView() { 
  const [blogs, setBlogs] = useState([]); 

  // Fetch active blogs from the API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost:4000/blogs/activePosts');
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <Container>
      <h1 className="text-center" style={{ marginTop: '3em' }}>Our Blogs</h1>
      <Row>
        {blogs.map((blog) => (
          <Col md={4} xs={12} key={blog._id}>
            <BlogCard blog={blog} />
          </Col>
        ))}
      </Row>
    </Container>
  ); 
}
