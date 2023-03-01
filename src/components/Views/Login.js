import './Login.scss'
import { useHistory } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { loginUser } from '../../services/apiService'
import { UserContext } from '../../context/UserContext';
import amduongLogo from '../../assets/images/amduongLogo.png'
import { ActivePageContext } from "../../context/ActivePageContext";

const Login = (props) => {
    const { activePage, setActivePage } = useContext(ActivePageContext)
    const { user, loginContext } = useContext(UserContext);
    let history = useHistory();

    const [valueLogin, setValueLogin] = useState('')
    const [password, setPassword] = useState('')

    const defaultObjValidInput = {
        isValidLogin: true,
        isValidPass: true
    }
    const [objValidInput, SetObjValidInput] = useState(defaultObjValidInput)

    const handleLogin = async () => {
        SetObjValidInput(defaultObjValidInput)
        if (!valueLogin) {
            toast.error('Hãy nhập email hoặc số điện thoại của bạn')
            SetObjValidInput({ ...defaultObjValidInput, isValidLogin: false })
            return false
        }
        if (!password) {
            toast.error('Hãy nhập mật khẩu của bạn')
            SetObjValidInput({ ...defaultObjValidInput, isValidPass: false })
            return false
        }
        let response = await loginUser(valueLogin, password)
        if (response && +response.EC === 0) {

            let groupWithRoles = response.DT.groupWithRoles
            let email = response.DT.email
            let username = response.DT.username
            let token = response.DT.access_token

            let data = {
                isAuthenticated: true,
                token: token,
                account: { groupWithRoles, email, username }
            }
            localStorage.setItem('tokenJWT', token)
            loginContext(data)
            localStorage.setItem('activePage', 'Trang chủ');
            setActivePage('Trang chủ')
            history.push("/home");

        }
        if (response && +response.EC !== 0) {
            toast.error(response.EM)
        }

    }

    const handleKeyPressLogin = (event) => {
        if (event.code === "Enter") {
            handleLogin()
        }
    }

    const handleCreateNewAccount = () => {
        history.push("/register");
    }

    useEffect(() => {
        if (user && user.isAuthenticated) { // eslint-disable-next-line react-hooks/exhaustive-deps
            history.push('/home') // eslint-disable-next-line react-hooks/exhaustive-deps
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    return (
        <div className="login-container">
            <div className="container">
                <div className="row px-3 px-sm-0 justify-content-center">

                    <div className="content-left col-12 d-none col-md-7 d-md-block">
                        {/* Mặc định col 12 và sẽ ẩn, chỉ hiện khi size col-7 (màn hinh bé hơn hoặc bằng ≥768px) */}
                        <div className='logo-left'>
                            <img className='logo-web mx-3' src={amduongLogo} alt="logo-web" />
                            <label className='title'>PHÒNG KHÁM ĐÔNG Y - BS. ĐOÀN VĂN THANH</label>
                        </div>
                    </div>

                    <div className="content-right d-flex flex-column gap-3 py-3 col-12 col-md-5 col-xl-4">
                        {/* Mặc định col 12, khi size md ≥768px và hiện 5 col, 
                        khi size ≥1200px hiện 4 col, khi size ≥1400px hiện 3 col */}
                        <div className='facebook-right d-md-none'>
                            <img className='logo-mobi' src={amduongLogo} alt="logo-mobi" />
                        </div>
                        <input
                            className={
                                objValidInput.isValidLogin ?
                                    'Input-email form-control' :
                                    'Input-email form-control is-invalid'
                            } type='text'
                            placeholder='Nhập email hoặc số điện thoại'
                            value={valueLogin}
                            onChange={(event) => setValueLogin(event.target.value)}
                        />
                        <input
                            className={
                                objValidInput.isValidPass ?
                                    'Input-pass form-control' :
                                    'Input-pass form-control is-invalid'
                            } type='password'
                            placeholder='Mật khẩu'
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            onKeyPress={(event) => handleKeyPressLogin(event)}
                        />
                        <button
                            className='btLogin btn btn-primary'
                            onClick={() => handleLogin()}
                        >Đăng nhập</button>
                        <span className='text-center'>
                            <a className='forgot-pass' href='xxx'>Quên mật khẩu?</a>
                        </span>
                        <hr />
                        <div className='text-center'>
                            <button className='btCNAcc btn btn-success'
                                onClick={() => handleCreateNewAccount()}>Tạo tài khoản mới</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}
export default Login