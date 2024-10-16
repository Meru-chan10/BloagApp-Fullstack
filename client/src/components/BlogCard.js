import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function BlogCard({ blog }) {
  const { _id, title, content, image } = blog;

  return (
    <Card className="my-3">
      <Card.Img variant="top" src={image} />
      <Card.Body>
        <Card.Title className="text-center">{title}</Card.Title>
        <Card.Text>{content.substring(0, 100)}...</Card.Text> {/* Show a preview of the content */}
      </Card.Body>
      <Card.Footer className="text-center">
        <Link className="btn btn-dark" to={`/blogs/${_id}`}>Read More</Link> {/* Link to BlogDetails */}
      </Card.Footer>
    </Card>
  );
}
