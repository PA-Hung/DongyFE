import React, { useContext } from "react";
import "./NaviBar.scss";
import { Link, useHistory, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import amduongLogo from '../../assets/images/amduongLogo.png'
import { logoutUser } from "../../services/apiService";
import { toast } from "react-toastify";


const NaviBar = (props) => {
    const { user, logoutContext } = useContext(UserContext)
    const location = useLocation()
    const history = useHistory()

    const handleLogout = async () => {
        localStorage.removeItem('tokenJWT') // clear jwt local storage
        let data = await logoutUser() // clear cookie
        logoutContext() // clear user data in context
        if (data && data.EC === 0) {
            toast.success('Đăng xuất thành công')
            localStorage.removeItem('activePage')
            history.push('/login')
        } else {
            toast.error(data.EM)
        }
    }

    if ((user && user.isAuthenticated === true) || location.pathname === '/') {
        return (
            <>
                <div className="nav-header">
                    <Navbar className="bg-header" expand="lg">
                        <div>
                            <Navbar.Brand className="nav-brand">
                                <img src={amduongLogo} width="35" height="35"
                                    alt=""
                                    className="d-inline-block align-top" />
                                <span className="logo-text px-3">PHÒNG KHÁM ĐÔNG Y - BS ĐOÀN VĂN THANH</span>
                            </Navbar.Brand>
                        </div>
                        <Container className="d-flex justify-content-end">
                            <Nav>
                                {user && user.isAuthenticated === true
                                    ?
                                    <>
                                        <div className="setting">
                                            <Nav.Item className="nav-link d-xl-block d-none">Chào bác sĩ {user.account.username} !</Nav.Item>
                                            <NavDropdown title="Cài đặt" id="basic-nav-dropdown " className="d-xl-block d-none">
                                                <NavDropdown.Item>Đổi mật khẩu</NavDropdown.Item>
                                                <NavDropdown.Divider />
                                                <NavDropdown.Item>
                                                    <span onClick={() => handleLogout()}>Đăng xuất</span>
                                                </NavDropdown.Item>
                                            </NavDropdown>
                                        </div>
                                    </>
                                    :
                                    <>
                                        {localStorage.removeItem('activePage')}
                                        {history.push('/login')}
                                    </>
                                }
                            </Nav>
                        </Container>
                    </Navbar>
                </div>
            </>
        )
    } else {
        return <></>
    }
}

export default NaviBar;