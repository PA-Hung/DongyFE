import './Project.scss'
import React, { useEffect, useState, useContext } from 'react';
import { fetchAllPatient, deletePatient, searchPatient } from '../../../services/projectService'
import { toast } from 'react-toastify';
import noAvatar from '../../../assets/images/noAvatar.png';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import ModalDelete from './Modal/ModalDelete';
import { EditPatientContext } from '../../../context/EditPatientContext'
import { Image, Tabs, Pagination } from 'antd';



const Project = (props) => {
    let history = useHistory()

    const [dataModalDelete, setDataModalDelete] = useState({}) // đây là data modal delete
    const [isShowModalDelete, setIsShowModalDelete] = useState(false) // hiển thị modal delete

    const [dataEditPatient, setDataEditPatient] = useContext(EditPatientContext)

    const [searchValue, setSearchValue] = useState("")
    const [expandedRows, setExpandedRows] = useState([]);

    const [dataPatient, setDataPatient] = useState([])

    // Pagination ------------------------------
    const [currentLitmit, setCurrentLimit] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    // Pagination ------------------------------

    const toggleExpandRow = (rowId) => {
        console.log(rowId)
        if (expandedRows.includes(rowId)) {
            setExpandedRows(expandedRows.filter((id) => id !== rowId));
        } else {
            setExpandedRows([...expandedRows, rowId]);
        }
    }

    useEffect(() => {
        // if (searchValue) {
        //     handleSearch()
        // } else {
        getAllPatient() // eslint-disable-next-line react-hooks/exhaustive-deps
        console.log('>>>>>>>>>>> khi load ', totalPages)
        // }
    }, [currentLitmit, currentPage])

    const getAllPatient = async () => {
        let response = await fetchAllPatient(currentPage, currentLitmit)
        if (response && response.EC === 0) {
            setTotalPages(response.DT.totalPages)
            console.log('>>>>>>>>>>> tổng số trang khi nhận về :', response.DT.totalPages)
            if (response.DT.totalPages > 0 && response.DT.patients.length === 0) {
                setCurrentPage(response.DT.totalPages)
            }
            if (response.DT.totalPages > 0 && response.DT.patients.length > 0) {
                setDataPatient(response.DT.patients)
                console.log('Check data ', response.DT.patients)
            }
        }
    }

    const handleRefresh = async () => {
        setCurrentPage(1)
        setSearchValue('')
        await getAllPatient()
    }

    const handlePageClick = async (page) => {
        //console.log('>>>>>>>>>>>>>>>> thay đổi trang: ', page)
        setCurrentPage(page)
    };

    const onShowSizeChange = (current, pageSize) => {
        console.log(current, pageSize);
        setCurrentPage(current)
        setCurrentLimit(pageSize)
    };

    const handleDeletePatient = async (patient) => {
        setDataModalDelete(patient)
        setIsShowModalDelete(true)
    }

    const confirmModalDelete = async () => {
        let response = await deletePatient(dataModalDelete)
        if (response && response.EC === 0) {
            setIsShowModalDelete(false)
            toast.success(response.EM)
            await getAllPatient()
        } else {
            toast.success(response.EM)
        }
    }

    const handleClose = () => {
        setIsShowModalDelete(false)
        setDataModalDelete({})
    };

    const handleSearch = async () => {
        //console.log('currentPage', currentPage)
        let response = await searchPatient(searchValue, currentPage, currentLitmit)
        //console.log('currentPage', currentPage)
        if (response && response.EC === 0) {
            setTotalPages(response.DT.totalPages)
            if (response.DT.totalPages > 0 && response.DT.patients.length === 0) {
                setCurrentPage(response.DT.totalPages)
            }
            if (response.DT.totalPages > 0 && response.DT.patients.length > 0) {
                setDataPatient(response.DT.patients)

            }
        } else {
            toast.error(response.EM)
        }
    }

    const handleKeyPressSearch = (event) => {
        console.log(event.code)
        if (event.code === "Enter") {
            handleSearch()
        }
    }

    const handleEditPatient = (patient) => {
        //console.log('check dữ liệu nam sinh send to edit page : ', patient.tuoi)
        setDataEditPatient(patient)
        history.push(`/editpatient`)
    }


    return (
        <>
            <div className='container-fluid'>
                <div className='tittle pt-2'>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/home">Trang chủ</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Danh sách bệnh nhân</li>
                        </ol>
                    </nav>
                </div>
                <div className='search-content d-flex justify-content-between'>
                    <div className='d-flex'>
                        <div className='input-search'>
                            <input type='text' className='form-control'
                                value={searchValue}
                                onKeyPress={(event) => handleKeyPressSearch(event)}
                                onChange={(event) => setSearchValue(event.target.value, setCurrentPage(1))} />
                        </div>
                        <div className='button-search'>
                            <button className='btn btn-primary'
                                onClick={() => handleSearch()}
                            ><i className="fa fa-search" /></button>
                        </div>
                    </div>
                    <div className='d-xl-none d-block'>
                        <button
                            className='btn btn-success mx-2'
                            onClick={() => handleRefresh()}
                        ><i className="fa fa-refresh" /></button>
                        <button
                            className='btn btn-primary'
                            onClick={() => { history.push('/addnewpatient') }}
                        ><i className="fa fa-plus-circle" /></button>
                    </div>
                    <div className='d-xl-block d-none'>
                        <button
                            className='btn btn-success mx-2'
                            onClick={() => handleRefresh()}
                        ><i className="fa fa-refresh" /> Tải lại trang</button>
                        <button
                            className='btn btn-primary'
                            onClick={() => { history.push('/addnewpatient') }}
                        ><i className="fa fa-plus-circle" /> Thêm bệnh nhân
                        </button>
                    </div>
                </div>

                <div><hr /></div>
                <table className="table table-hover table-bordered">
                    <thead>
                        <tr className='table-primary'>
                            <th className='text-center align-middle'>ID</th>
                            <th className='text-center align-middle'>Hình ảnh</th>
                            <th className='text-center align-middle'>Họ & Tên</th>
                            <th className='text-center align-middle'>Năm sinh</th>
                            <th className='text-center align-middle'>Địa chỉ</th>
                            <th className='text-center align-middle'>Điện thoại</th>
                            <th className='text-center align-middle'>Loại bệnh</th>
                            <th className='text-center align-middle'>Ngày khám</th>
                            <th className='text-center align-middle'>Hành động</th>
                        </tr>
                    </thead>
                    <tbody className='table-striped'>
                        {/* Loop through your data and render each row */}
                        {
                            dataPatient.length > 0 && dataPatient.map(
                                (item, index) => (
                                    <React.Fragment key={item.id}>
                                        <tr>
                                            <td className='text-center align-middle'>
                                                {(currentPage - 1) * currentLitmit + index + 1}
                                            </td>
                                            <td className='text-center align-middle'>
                                                <div className='avatar-benhnhan'>
                                                    <Image
                                                        className='avatar-benhnhan'
                                                        width={80}
                                                        src={item.hinhanh ? item.hinhanh : noAvatar}
                                                    />
                                                </div>
                                            </td>
                                            <td className='align-middle'>
                                                <button
                                                    className='link-name'
                                                    onClick={() => toggleExpandRow(item.id)}>
                                                    {item.name}
                                                </button>
                                            </td>
                                            <td className='text-center align-middle'>
                                                {item.tuoi}
                                            </td>
                                            <td className='align-middle'>
                                                {item.diachi}
                                            </td>
                                            <td className='text-center align-middle'>
                                                {item.dienthoai}
                                            </td>
                                            <td className='align-middle'>
                                                {item.phanloaibenh}
                                            </td>
                                            <td className='align-middle text-center'>
                                                {item.ngaykham ? dayjs(item.ngaykham).toISOString().substring(0, 10).split("-").reverse().join("/") : 'chưa nhập'}

                                            </td>
                                            <td className='actions d-flex justify-content-center'>
                                                <div>
                                                    {expandedRows.includes(item.id) ?
                                                        <i className="fa fa-minus-circle remove"
                                                            onClick={() => toggleExpandRow(item.id)}
                                                        />
                                                        :
                                                        <i className="fa fa-plus-circle add"
                                                            onClick={() => toggleExpandRow(item.id)}
                                                        />
                                                    }
                                                </div>
                                                <div className='mx-3'>
                                                    <i className="fa fa-trash-o"
                                                        onClick={() => handleDeletePatient(item)} />
                                                </div>
                                                <div>
                                                    <i className="fa fa-pencil"
                                                        onClick={() => handleEditPatient(item)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        {/* Render the expanded content for the row */}
                                        < tr className={`collapse ${expandedRows.includes(
                                            item.id
                                        ) ? 'show' : ''}`}>
                                            <td colSpan="9">
                                                <div className='expandContent d-flex'>

                                                    <div className='expandContentDetail'>
                                                        <div className="tab-content border border border-light col-12">
                                                            <Tabs
                                                                defaultActiveKey="1"
                                                                centered
                                                                items={
                                                                    [
                                                                        {
                                                                            key: '1',
                                                                            label: `Ghi chú`,
                                                                            children: <textarea
                                                                                disabled
                                                                                className="textarea form-control"
                                                                                id="exampleFormControlTextarea1"
                                                                                value={item.ghichu || ''}
                                                                                rows="6"></textarea>,
                                                                        },
                                                                        {
                                                                            key: '2',
                                                                            label: `Chẩn đoán`,
                                                                            children: <textarea
                                                                                disabled
                                                                                className="textarea form-control"
                                                                                id="exampleFormControlTextarea1"
                                                                                value={item.chandoan || ''}
                                                                                rows="6"></textarea>,
                                                                        },
                                                                        {
                                                                            key: '3',
                                                                            label: `Điều trị`,
                                                                            children: <textarea
                                                                                disabled
                                                                                className="textarea form-control"
                                                                                id="exampleFormControlTextarea1"
                                                                                value={item.dieutri || ''}
                                                                                rows="6"></textarea>,
                                                                        },
                                                                        {
                                                                            key: '4',
                                                                            label: `Kết quả`,
                                                                            children: <textarea
                                                                                disabled
                                                                                className="textarea form-control"
                                                                                id="exampleFormControlTextarea1"
                                                                                value={item.ketqua || ''}
                                                                                rows="6"></textarea>,
                                                                        },
                                                                        {
                                                                            key: '5',
                                                                            label: `Thư viện ảnh`,
                                                                            children:
                                                                                <div className='d-flex justify-content-center'>
                                                                                    <div className="carousel-wrapper">

                                                                                    </div>

                                                                                </div>
                                                                        },
                                                                    ]
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))
                        }
                    </tbody>
                </table>
                {
                    totalPages > 0 &&
                    <div className='d-flex justify-content-center'>
                        <div>
                            {console.log('>>>><><>', totalPages)}
                            <Pagination
                                defaultCurrent={currentPage}
                                total={totalPages * 10}
                                onChange={handlePageClick}
                                responsive={true}
                                onShowSizeChange={onShowSizeChange}
                                pageSizeOptions={[5, 10, 15]}
                            />
                        </div>
                    </div>
                }
                <div>
                    <ModalDelete
                        show={isShowModalDelete}
                        handleClose={handleClose}
                        confirmModalDelete={confirmModalDelete}
                        dataModal={dataModalDelete}
                    />
                </div>

            </div >
        </>
    )
}

export default Project