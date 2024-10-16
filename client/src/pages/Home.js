import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {


    return (
        <Row>
            <Col className="mt-5 pt-5 text-center mx-auto">
                <h1>Your Ultimate Gaming Destination.</h1>
                <p>Dive into epic game reviews, insider tips, and the latest news.</p>
                <Link className="btn btn-primary" to={"/blogs"}>View More</Link>
            </Col>
        </Row>
    )
}