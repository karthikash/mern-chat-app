import { Component } from "react"
import { DropdownItem, DropdownMenu, DropdownToggle, Media, Nav, Navbar, NavbarBrand, NavItem, UncontrolledDropdown } from "reactstrap";
import { verify } from 'jsonwebtoken';
import { Constants } from '../../config';

class Header extends Component {

    isAuth = () => {
        const _id = localStorage.getItem('_id');
        const token = localStorage.getItem('token');
        if (!_id || !token) return false;
        const decoded = verify(token, Constants.REACT_APP_JWT_SECRET_KEY);
        if (decoded._id === _id) {
            return true;
        } else {
            return false;
        }
    }

    logout = () => {
        const _id = localStorage.getItem('_id');
        const token = localStorage.getItem('token');
        const httpHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${token}`
        }
        const options = {
            method: 'POST',
            headers: new Headers(httpHeaders)
        };
        fetch(`${Constants.REACT_APP_API_BASE_URL}/auth/logout/${_id}`, options)
            .then(() => {
                localStorage.removeItem('_id');
                localStorage.removeItem('token');
                localStorage.removeItem('dp');
                window.location.reload();
            })
            .catch((error) => {
                console.log('error: ', error);
            });
    }

    deactivateAccount = () => {
        const _id = localStorage.getItem('_id');
        const token = localStorage.getItem('token');
        const httpHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${token}`
        }
        const options = {
            method: 'DELETE',
            headers: new Headers(httpHeaders)
        };
        fetch(`${Constants.REACT_APP_API_BASE_URL}/user/delete/${_id}`, options)
            .then(() => {
                localStorage.removeItem('_id');
                localStorage.removeItem('token');
                window.location.reload();
            })
            .catch((error) => {
                console.log('error: ', error);
            });
    }

    render() {
        if (!this.isAuth()) {
            return (
                <div>
                    <Navbar color="faded" light expand="md">
                        <NavbarBrand href="/chat">Mern Chat App</NavbarBrand>
                    </Navbar>
                </div>
            )
        } else {
            const sImage = localStorage.getItem('dp');
            return (
                <div>
                    <Navbar color="faded" light expand="md">
                        <NavbarBrand href="/chat">Mern Chat App</NavbarBrand>
                        <Nav className="ml-auto" navbar>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>Account</DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem href="/profile">  Profile </DropdownItem>
                                    <DropdownItem onClick={this.logout}> Logout </DropdownItem>
                                    <DropdownItem href="/reset">Reset Password </DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem onClick={this.deactivateAccount}>  Deactivate Account   </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                            <NavItem>
                                <Media className="dp" src={sImage} alt="Name" />
                            </NavItem>
                        </Nav>
                    </Navbar>
                </div>
            );
        }
    };
}

export default Header;