import { Component } from "react"
import { Nav, Navbar, NavbarText, Row, Col, Container } from "reactstrap";

class Footer extends Component {

    constructor(props) {
        super(props)
        this.state = { matches: window.matchMedia("(min-width: 992px)").matches };
    }

    componentDidMount() {
        const handler = e => this.setState({ matches: e.matches });
        window.matchMedia("(min-width: 992px)").addEventListener('change', handler);
    }

    render() {
        return (
            <div>
                {this.state.matches &&
                    (<Navbar color="faded" light expand="md">
                        <Nav navbar>
                            <NavbarText>Chat App &copy; 2020. All Rights Reserved</NavbarText>
                        </Nav>
                        <Nav className="ml-auto" navbar>
                            <NavbarText>Created by <a href="https://github.com/kpenhanced" rel="noreferrer" target="_blank">Karthik Ashokkumar</a> </NavbarText>
                        </Nav>
                    </Navbar>)}
                {!this.state.matches &&
                    (<Container>
                        <br />
                        <Row>
                            <Col style={{ textAlign: "center", color: "gray" }}>
                                Chat App &copy; 2020. All Rights Reserved
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{ textAlign: "center", color: "gray" }}>
                                Created by <a href="https://github.com/kpenhanced" rel="noreferrer" target="_blank" style={{ textDecoration: "none !important" }}>Karthik Ashokkumar</a>
                            </Col>
                        </Row>
                    </Container>
                    )}
            </div>
        );
    };
}

export default Footer;