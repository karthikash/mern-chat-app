import { Component } from "react"
import { Nav, Navbar, NavbarText } from "reactstrap";

class Footer extends Component {
    render() {
        return (
            <div>
                <Navbar color="faded" light expand="md">
                    <Nav navbar>
                        <NavbarText>Chat App &copy; 2020. All Rights Reserved</NavbarText>
                    </Nav>
                    <Nav className="ml-auto" navbar>
                        <NavbarText>Created by <a href="https://github.com/kpenhanced" rel="noreferrer" target="_blank">Karthik Ashokkumar</a> </NavbarText>
                    </Nav>
                </Navbar>
            </div>
        );
    };
}

export default Footer;