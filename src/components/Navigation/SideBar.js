import React, { useContext, useEffect, useState } from "react";
import "./SideBar.scss";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { logoutUser } from "../../services/apiService";
import { toast } from "react-toastify";
import { Sidebar, Menu, MenuItem, useProSidebar } from 'react-pro-sidebar';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { ActivePageContext } from "../../context/ActivePageContext";

const SideBar = (props) => {
    const { user, logoutContext } = useContext(UserContext)
    const { activePage, setActivePage } = useContext(ActivePageContext)
    const location = useLocation()
    const history = useHistory()

    const { collapseSidebar, toggleSidebar } = useProSidebar();
    const [showHideSideBar, setShowHideSideBar] = useState(true)

    const handleShowHideSideBar = () => {
        collapseSidebar()
        setShowHideSideBar(false)
        if (!showHideSideBar) {
            setShowHideSideBar(true)
        }
    }
    useEffect(() => {
        // console.log('>>>>>>>>> check user', user.account.groupWithRoles.id)
    }, [])

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

    const handlePageChange = page => {
        setActivePage(page);
        localStorage.setItem('activePage', page);
    };

    if ((user && user.isAuthenticated === true &&
        (user.account.groupWithRoles.id === 1 || user.account.groupWithRoles.id === 2))
        || location.pathname === '/') {
        return (
            <>
                <div className="sidebar-content" >
                    <Sidebar breakPoint="xl">
                        <Menu>
                            <MenuItem
                                onClick={() => handlePageChange('Trang chủ')}
                                active={activePage === 'Trang chủ' ? true : false}
                                component={<NavLink to="/home" className='nav-link' exact />}>
                                <HomeIcon className="icon" />Trang chủ
                            </MenuItem>
                            <MenuItem
                                onClick={() => handlePageChange('Quản lý bệnh nhân')}
                                active={activePage === 'Quản lý bệnh nhân' ? true : false}
                                component={<NavLink to="/project" className='nav-link' />}
                            >
                                <FolderSharedIcon className="icon" />Danh sách bệnh nhân
                            </MenuItem>
                            <MenuItem
                                onClick={() => handlePageChange('Thêm mới bệnh nhân')}
                                active={activePage === 'Thêm mới bệnh nhân' ? true : false}
                                component={<NavLink to="/addnewpatient" className='nav-link' />}
                            >
                                <PersonAddAlt1Icon className="icon" />Thêm mới bệnh nhân
                            </MenuItem>
                            {user.account.groupWithRoles.id === 1 ?
                                <>
                                    <MenuItem
                                        onClick={() => handlePageChange('Quản lý bác sĩ')}
                                        active={activePage === 'Quản lý bác sĩ' ? true : false}
                                        component={<NavLink to="/users" className='nav-link' />}
                                    >
                                        <AssignmentIndIcon className="icon" />Quản lý bác sĩ
                                    </MenuItem>

                                    <MenuItem
                                        onClick={() => handlePageChange('Phân quyền')}
                                        active={activePage === 'Phân quyền' ? true : false}
                                        component={<NavLink to="/roles" className='nav-link' />}>
                                        <PeopleAltIcon className="icon" />Phân quyền
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handlePageChange('Nhóm quyền')}
                                        active={activePage === 'Nhóm quyền' ? true : false}
                                        component={<NavLink to="/rolebygroup" className='nav-link' />}>
                                        <Diversity2Icon className="icon" />Nhóm quyền
                                    </MenuItem>
                                </> : ''}
                            <MenuItem
                                onClick={() => handleLogout()}
                                component={<NavLink to="/rolebygroup" className='nav-link' />}>
                                <LogoutIcon className="icon" />Đăng xuất
                            </MenuItem>
                        </Menu>
                    </Sidebar>
                    <div className="showhideArrow d-xl-block d-none">
                        <div className="btnArrow" onClick={() => handleShowHideSideBar()}>
                            {showHideSideBar ?
                                <KeyboardDoubleArrowLeftIcon className="arrowIcon" />
                                :
                                <KeyboardDoubleArrowRightIcon className="arrowIcon" />}
                        </div>
                    </div>
                    <div className="showhideArrow d-xl-none d-block">
                        <div className="btnArrow" onClick={() => toggleSidebar()}>
                            {showHideSideBar ?
                                <KeyboardDoubleArrowLeftIcon className="arrowIcon" />
                                :
                                <KeyboardDoubleArrowRightIcon className="arrowIcon" />}
                        </div>
                    </div>
                </div>
            </>
        )
    } else { return <></> }
}

export default SideBar;