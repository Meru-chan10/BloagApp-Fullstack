import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './styles/Home.css'; // Import the CSS file

export default function Home() {
    return (
        <div>
            <Row className="full-height">
                <Col className="mt-5 pt-5 text-center mx-auto">
                    <h1>Your Ultimate Gaming Destination.</h1>
                    <p>Dive into epic game reviews, insider tips, and the latest news.</p>
                    <Link className="btn btn-violet" to={"/blogs"}>View More</Link>
                </Col>
            </Row>
        </div>
    );
}
