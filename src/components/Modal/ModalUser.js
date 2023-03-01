import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react'
import { fetchGroup, createNewUser, updateCurrentUser } from '../../services/apiService';
import { toast } from 'react-toastify';
import _ from 'lodash'

const ModalUser = (props) => {
    const { action, dataModalUser } = props // khai bao biến như vậy dùng không cần props chấm nữa
    const [userGroups, setUserGroups] = useState([])
    const defaultUserData = {
        email: '',
        phone: '',
        username: '',
        password: '',
        address: '',
        sex: '',
        group: ''
    }
    const [userData, setUserData] = useState(defaultUserData)

    const validInputsDefault = {
        email: true,
        phone: true,
        username: true,
        password: true,
        address: true,
        sex: true,
        group: true
    }

    const [validInputs, setValidInput] = useState(validInputsDefault)

    useEffect(() => {
        getGroup() // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (action === 'UPDATE') {
            //console.log('>>>>> check dataModalUser.sex : ', dataModalUser.sex)
            setUserData({
                ...dataModalUser,
                group: dataModalUser.Group ? dataModalUser.Group.id : '',
            })
            //console.log('>>>>> check userData ', dataModalUser)
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.dataModalUser])

    useEffect(() => {
        if (action === 'CREATE') {
            if (userGroups && userGroups.length > 0) {
                setUserData({
                    ...userData,
                    group: userGroups[0].id, // eslint-disable-next-line react-hooks/exhaustive-deps
                }) // eslint-disable-next-line react-hooks/exhaustive-deps
            } // eslint-disable-next-line react-hooks/exhaustive-deps
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action]) // eslint-disable-next-line react-hooks/exhaustive-deps

    const checkValidInputs = () => {
        if (action === 'UPDATE') {
            return true
        }
        setValidInput(validInputsDefault)
        let arr = ['email', 'phone', 'password', 'group']
        let check = true
        for (let i = 0; i < arr.length; i++) {
            if (!userData[arr[i]]) {
                let _validInputs = _.cloneDeep(validInputsDefault)
                _validInputs[arr[i]] = false
                setValidInput(_validInputs)
                toast.error(`Empty input ${arr[i]}`);
                check = false;
                break;
            }
        }
        return check
    }

    const getGroup = async () => {
        let res = await fetchGroup()
        if (res && res.EC === 0) {
            setUserGroups(res.DT)
            let dataGroup = res.DT
            if (dataGroup && dataGroup.length > 0) {
                setUserData({ ...userData, group: dataGroup[0].id })
                //console.log('>>>>>> check group ID', defaultUserData.group)
            }
        } else {
            toast.error(res.EM)
        }
    }

    const handleonChangeInput = (value, name) => {
        let _userData = _.cloneDeep(userData)
        _userData[name] = value
        setUserData(_userData)
    }

    const handleSaveUser = async () => {
        //console.log('>>>>>>>>> check user data send to server :', userData)
        let check = checkValidInputs()
        if (check === true) {
            let res = action === 'CREATE'
                ? await createNewUser({ ...userData, groupId: userData['group'], })
                : await updateCurrentUser({ ...userData, groupId: userData['group'], });

            // copy key của group và chuyển thành groupId cho giống trường trong database
            //console.log('>>>>>>>> check res create new user', res)
            if (res && res.EC === 0) {
                props.onHide()
                setUserData({
                    ...defaultUserData,
                    group: userGroups[0].id && userGroups.length > 0 ? userGroups[0].id : ''
                    // nếu phần tử đầu tiên userGroups có tồn tại và userGroups.length > 0
                    // thì lấy phần tử đầu tiên cho group, còn ko thì gán rỗng
                })
            }
            if (res && res.EC !== 0) {
                if (res.DT === 'email') {
                    setValidInput({ ...validInputsDefault, email: false })
                }
                if (res.DT === 'phone') {
                    setValidInput({ ...validInputsDefault, phone: false })
                }
                toast.error(res.EM)
            }
        }
    }

    const handleCloseModalUser = () => {
        props.onHide()
        setUserData(defaultUserData)
        setValidInput(validInputsDefault)
    }

    return (
        <>
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={props.show}
                className='modal-user'
                onHide={() => handleCloseModalUser()}
            >
                <Modal.Header closeButton >
                    <Modal.Title id="contained-modal-title-vcenter">
                        <span>{props.action === 'CREATE' ? 'Create new user' : 'Edit a user'}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='content-body row'>
                        <div className='col-12 col-sm-6 form-group mt-3'>
                            <input
                                disabled={action === 'CREATE' ? false : true}
                                className={validInputs.email ? 'form-control' : 'form-control is-invalid'}
                                type='text'
                                placeholder='Email'
                                value={userData.email}
                                onChange={(event) => handleonChangeInput(event.target.value, 'email')}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group mt-3'>
                            <input
                                disabled={action === 'CREATE' ? false : true}
                                className={validInputs.phone ? 'form-control' : 'form-control is-invalid'}
                                type='text'
                                placeholder='Phone'
                                value={userData.phone}
                                onChange={(event) => handleonChangeInput(event.target.value, 'phone')}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group mt-3'>
                            <input
                                className='form-control'
                                type='text'
                                placeholder='Username'
                                value={userData.username}
                                onChange={(event) => handleonChangeInput(event.target.value, 'username')}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group mt-3'>
                            <select
                                className="form-select" aria-label="Gender"
                                onChange={(event) => handleonChangeInput(event.target.value, 'sex')}
                                value={userData.sex}
                            >
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                        </div>

                        <div className='col-12 col-sm-6 form-group mt-3'>
                            {action === 'CREATE' &&
                                <input
                                    className={validInputs.password ? 'form-control' : 'form-control is-invalid'}
                                    type='password'
                                    placeholder='Password'
                                    value={userData.password}
                                    onChange={(event) => handleonChangeInput(event.target.value, 'password')}
                                />
                            }
                        </div>

                        <div className='col-12 col-sm-6 form-group mt-3'>
                            <select
                                className={validInputs.group ? 'form-select' : 'form-select is-invalid'}
                                aria-label="Group"
                                onChange={(event) => handleonChangeInput(event.target.value, 'group')}
                                value={userData.group}
                            >
                                {
                                    userGroups.length > 0 && userGroups.map((item, index) => {
                                        return (
                                            <option key={`group-${index}`} value={item.id}>{item.name}</option>
                                        )
                                    })
                                }

                            </select>
                        </div>
                        <div className='col-12 col-sm-12 form-group mt-3'>
                            <input
                                className='form-control'
                                type='text'
                                placeholder='Address'
                                value={userData.address}
                                onChange={(event) => handleonChangeInput(event.target.value, 'address')}
                            />
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseModalUser()}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleSaveUser()}>
                        {action === 'CREATE' ? 'Save' : 'Update'}
                    </Button>
                </Modal.Footer>

            </Modal>
        </>
    )
}
export default ModalUser
