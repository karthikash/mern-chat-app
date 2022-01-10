import './App.css';
import { Component } from 'react';
import { Auth, Header, Footer, Chat, Profile, ResetPassword } from './components';
import { Container, Col, Row } from 'reactstrap';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { verify } from 'jsonwebtoken';
import { Constants } from './config';

class App extends Component {

	isAuth = () => {
		const _id = localStorage.getItem('_id');
		const token = localStorage.getItem('token');
		if (!_id || !token) return false;
		const decoded = verify(token, Constants.REACT_APP_JWT_SECRET_KEY, { ignoreExpiration: true });
		if (decoded._id === _id) {
			return true;
		} else {
			return false;
		}
	}

	render() {
		if (!this.isAuth()) {
			return (
				<Container>
					<Row>
						<Col>
							<Header />
						</Col>
					</Row>
					<Auth />
					<Row>
						<Col>
							<Footer />
						</Col>
					</Row>
				</Container>
			);
		} else {
			return (
				<Container>
					<Row>
						<Col>
							<Header />
						</Col>
					</Row>
					<Router>
						<Switch>
							<Route exact path="/" component={Chat} />
                            <Route exact path="/profile" component={Profile} />
							<Route exact path="/reset" component={ResetPassword} />
						</Switch>
					</Router>
					<Row>
						<Col>
							<Footer />
						</Col>
					</Row>
				</Container>
			);
		}
	};
}

export default App;
