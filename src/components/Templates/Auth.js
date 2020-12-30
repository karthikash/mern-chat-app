import { Component } from "react";
import { Register, Login } from '..';
import { Card, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';

class Auth extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '2'
        };

    }

    toggle = (tab) => {
        if (this.state.activeTab !== tab) this.setState({ activeTab: tab });
    }

    render() {
        return (
            <Row className="justify-content-md-center">
                <div>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '1' })}
                                onClick={() => { this.toggle('1') }}>
                                Create your account
								</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '2' })}
                                onClick={() => { this.toggle('2') }}>
                                Log in to Chat
								</NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab} >
                        <TabPane tabId="1">
                            <br />
                            <Row >
                                <Col md={12}>
                                    <Card body>
                                        {this.state.activeTab === '1' ? <Register /> : null}
                                    </Card>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="2">
                            <br />
                            <Row>
                                <Col md={12}>
                                    <Card body>
                                        {this.state.activeTab === '2' ? <Login /> : null}
                                    </Card>
                                </Col>
                            </Row>
                        </TabPane>
                    </TabContent>
                </div>
            </Row>
        )
    }
}

export default Auth;