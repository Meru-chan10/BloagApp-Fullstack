import { useState, useEffect } from 'react';
import BlogCard from './BlogCard';
import { Container, Row, Col, Form } from 'react-bootstrap';

export default function UserView() { 
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

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

  // Filter blogs based on search query
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <h1 className="text-center" style={{ marginTop: '3em' }}>Our Blogs</h1>

      {/* Search Input */}
      <Form className="my-4">
        <Form.Control
          type="text"
          placeholder="Search blogs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Form>

      <Row>
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <Col md={4} xs={12} key={blog._id}>
              <BlogCard blog={blog} />
            </Col>
          ))
        ) : (
          <p className="text-center">No blogs match your search.</p>
        )}
      </Row>
    </Container>
  ); 
}
