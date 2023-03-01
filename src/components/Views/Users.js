import { useEffect, useState } from 'react'
import './Users.scss'
import { fetchAllUser, deleteUser } from '../../services/apiService'
// import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import ModalComfirm from '../Modal/ModalComfirm';
import ModalUser from '../Modal/ModalUser';


const Users = (props) => {
    const [listUsers, setListUsers] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [currentLitmit, setCurrentLimit] = useState(10)
    const [totalPages, setTotalPages] = useState(0)

    const [isShowModalComfirm, setIsShowModalComfirm] = useState(false)

    const [dataModal, setDataModal] = useState({}) // đây là data modal delete
    const [isShowModalUser, setIsShowModalUser] = useState(false)
    const [actionModalUser, setActionModalUser] = useState('CREATE')
    const [dataModalUser, setDataModalUser] = useState({}) // đây là data modal update , create user

    useEffect(() => {
        fetchUsers() // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage])

    const fetchUsers = async () => {
        let response = await fetchAllUser(currentPage, currentLitmit)
        if (response && response.EC === 0) {
            setTotalPages(response.DT.totalPages)
            if (response.DT.totalPages > 0 && response.DT.users.length === 0) {
                setCurrentPage(response.DT.totalPages)
                //await fetchAllUser(response.DT.totalPages, currentLitmit)
            }
            if (response.DT.totalPages > 0 && response.DT.users.length > 0) {
                setListUsers(response.DT.users)
            }
        }
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1)
        await fetchUsers()
    };

    const handleDeleteUser = async (user) => {
        //console.log('>>>>>>>>>> check data')
        setDataModal(user)
        setIsShowModalComfirm(true)
    }

    const handleClose = () => {
        setIsShowModalComfirm(false)
        setDataModal({})
    };

    const confirmDeleteUser = async () => {
        let response = await deleteUser(dataModal)
        //console.log('check user delete >>>>>>>', response)
        if (response && response.EC === 0) {
            toast.success(response.EM)
            await fetchUsers()
            setIsShowModalComfirm(false)
        } else {
            toast.success(response.EM)
        }
    }

    const onHideModelUser = async () => {
        setIsShowModalUser(false)
        setDataModalUser({})
        await fetchUsers()
    }

    const handleEditUser = (user) => {
        setActionModalUser('UPDATE')
        setIsShowModalUser(true)
        setDataModalUser(user)
    }

    return (
        <>
            <div className='container'>
                <div className='user-info-container'>
                    <div className='user-header '>
                        <div className='title-table pt-4'><h4>Quản lý bác sĩ</h4></div>
                        <div className='action d-flex justify-content-end'>

                            <button className='btn btn-primary'
                                onClick={() => {
                                    setIsShowModalUser(true);
                                    setActionModalUser('CREATE')
                                }}><i className="fa fa-plus-circle" /> Thêm bác sĩ mới</button>

                        </div>
                    </div>
                    <div><hr /></div>
                    <div className='user-body'>
                        <table className='table table-striped table-hover table-bordered'>
                            <thead>
                                <tr className='table-primary'>
                                    <th scope="col" className='text-center align-middle'>#</th>
                                    {/* <th scope="col">ID</th> */}
                                    <th scope="col">Email</th>
                                    <th scope="col">Họ tên</th>
                                    <th scope="col">Điện thoại</th>
                                    <th scope="col">Giới tính</th>
                                    <th scope="col">Quyền</th>
                                    <th scope="col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listUsers && listUsers.length > 0 ?
                                    <>
                                        {listUsers.map((item, index) => {
                                            return (
                                                <tr key={`row-${index}`}>
                                                    <th scope="row" className='text-center align-middle'>
                                                        {(currentPage - 1) * currentLitmit + index + 1}
                                                    </th>
                                                    <td className='d-none'>{item.id}</td>
                                                    <td className='align-middle'>{item.email}</td>
                                                    <td className='align-middle'>{item.username}</td>
                                                    <td className='align-middle'>{item.phone}</td>
                                                    <td className='align-middle'>{item.sex}</td>
                                                    <td className='align-middle'>{item.Group ? item.Group.name : ''}</td>

                                                    <td>
                                                        <div className='d-flex justify-content-center'>
                                                            <button
                                                                className='btn btn-warning mx-1'
                                                                onClick={() => handleEditUser(item)}
                                                            ><i className="fa fa-pencil-square-o" />
                                                                <span className='d-none d-sm-inline'> Sửa</span>
                                                            </button>
                                                            <button
                                                                className='btn btn-danger mx-1'
                                                                onClick={() => handleDeleteUser(item)}
                                                            ><i className="fa fa-trash-o" />
                                                                <span className='d-none d-sm-inline'> Xóa</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </>
                                    :
                                    <>
                                        <tr>
                                            <td colSpan={7}>Not found users</td>
                                        </tr>
                                    </>
                                }

                            </tbody>
                        </table>
                    </div>
                    {totalPages > 0 &&
                        <div className='user-footer d-flex justify-content-center'>
                            {/* <ReactPaginate
                                nextLabel="Tiếp >"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={3}
                                pageCount={totalPages}
                                previousLabel="< Trước"
                                pageClassName="page-item"
                                pageLinkClassName="page-link"
                                previousClassName="page-item"
                                previousLinkClassName="page-link"
                                nextClassName="page-item"
                                nextLinkClassName="page-link"
                                breakLabel="..."
                                breakClassName="page-item"
                                breakLinkClassName="page-link"
                                containerClassName="pagination"
                                activeClassName="active"
                                renderOnZeroPageCount={null}
                                forcePage={+currentPage - 1}
                            /> */}
                        </div>
                    }
                </div>
            </div>
            <div>
                <ModalComfirm
                    show={isShowModalComfirm}
                    handleClose={handleClose}
                    confirmDeleteUser={confirmDeleteUser}
                    dataModal={dataModal}
                />
                <ModalUser
                    show={isShowModalUser}
                    onHide={onHideModelUser}
                    action={actionModalUser}
                    dataModalUser={dataModalUser}
                />
            </div>
        </>
    )
}

export default Users