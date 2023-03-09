import './Project.scss'
import React, { useEffect, useState, useContext } from 'react';
import { fetchAllPatient, deletePatient, searchPatient } from '../../../services/projectService'
import { toast } from 'react-toastify';
import noAvatar from '../../../assets/images/noAvatar.png';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import ModalDelete from './Modal/ModalDelete';
import { EditPatientContext } from '../../../context/EditPatientContext'
import { Image, Tabs, Modal, Button } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash'
import ReactPaginate from 'react-paginate';

const Project = (props) => {
    let history = useHistory()
    const [isLoading, setIsLoading] = useState(false);

    const [dataModalDelete, setDataModalDelete] = useState({}) // đây là data modal delete
    const [isShowModalDelete, setIsShowModalDelete] = useState(false) // hiển thị modal delete
    const [dataEditPatient, setDataEditPatient] = useContext(EditPatientContext)

    const [expandedRows, setExpandedRows] = useState([]);
    const [visible, setVisible] = useState(false);
    const [dataPatient, setDataPatient] = useState([])
    const [searchResults, setSearchResults] = useState([]);
    // Pagination Patient ------------------------------
    const [currentLitmit, setCurrentLimit] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    // Pagination Patient ------------------------------
    // Pagination Search ------------------------------
    const [currentSearchLitmit, setCurrentSearchLimit] = useState(10)
    const [currentSearchPage, setCurrentSearchPage] = useState(1)
    const [totalSearchPages, setTotalSearchPages] = useState(0)
    // Pagination Search ------------------------------

    const toggleExpandRow = (rowId) => {
        if (expandedRows.includes(rowId)) {
            setExpandedRows(expandedRows.filter((id) => id !== rowId));
        } else {
            setExpandedRows([...expandedRows, rowId]);
        }
    }

    // -------------Start tìm kiếm
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [listInputs, setListInputs] = useState({
        inputSearch: {
            typeInputSearch: '', inputSearchValue: '', isValidInput: true, isValidType: true
        },
    })

    const handleOnChangeInput = (name, value, key) => {
        let _listInputs = _.cloneDeep(listInputs)
        _listInputs[key][name] = value
        if (value && name === 'inputSearchValue') {
            _listInputs[key]['isValidInput'] = true
        }
        setListInputs(_listInputs)
    }

    const handleAddNewInputSearch = () => {
        let _listInputs = _.cloneDeep(listInputs)
        // input-id : { inputSearchValue: '', isValidInput: true }
        _listInputs[`input-${uuidv4()}`] = {
            typeInputSearch: '', inputSearchValue: '', isValidInput: true, isValidType: true
        }
        setListInputs(_listInputs)
    }

    const handleRemoveInputSearch = (key) => {
        let _listInputs = _.cloneDeep(listInputs)
        console.log(_listInputs[key])
        delete _listInputs[key]
        setListInputs(_listInputs)
    }

    const showModal = () => {
        console.log('>>> isValidInput >> ', listInputs)
        setCurrentPage(1)
        setCurrentSearchPage(1)
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleChangeTypeInputSearch = (name, value, key) => {
        let _listInputs = _.cloneDeep(listInputs)
        _listInputs[key][name] = value
        if (value && name === 'typeInputSearch') {
            _listInputs[key]['isValidType'] = true
        }
        setListInputs(_listInputs)
    };

    const buildDataToSearch = () => {
        let _listInputs = _.cloneDeep(listInputs)
        let result = []
        Object.entries(_listInputs).map(([key, input], index) => {
            result.push({
                typeInputSearch: input.typeInputSearch,
                inputSearchValue: input.inputSearchValue
            })
        })
        return result
    }

    const handleSearch = async () => {
        let inValidTypeInputSearch = Object.entries(listInputs).find(([key, input], index) => {
            return input && !input.typeInputSearch
        })

        let inValidSearchValue = Object.entries(listInputs).find(([key, input], index) => {
            return input && !input.inputSearchValue
        })

        if (inValidTypeInputSearch) {
            toast.error('Vui lòng chọn cột tìm kiếm !')
            let _listInputs = _.cloneDeep(listInputs)
            const key = inValidTypeInputSearch[0]
            _listInputs[key]['isValidType'] = false
            setListInputs(_listInputs)
        } else if (inValidSearchValue) {
            toast.error('Vui lòng nhập dữ liệu tìm kiếm !')
            let _listInputs = _.cloneDeep(listInputs)
            const key = inValidSearchValue[0]
            _listInputs[key]['isValidInput'] = false
            setListInputs(_listInputs)
        }
        else {
            setIsLoading(true)
            let dataSearch = buildDataToSearch()
            let searchName = ''
            let searchPhone = ''
            let searchNamsinh = ''
            let searchDiachi = ''
            let searchLoaibenh = ''
            let searchNgaykham = ''

            console.log('>>>>>> dataSearch ', dataSearch)

            dataSearch.map((input) => {
                if (input.typeInputSearch === 'searchName') {
                    searchName = input.inputSearchValue
                }
                if (input.typeInputSearch === 'searchDienthoai') {
                    searchPhone = input.inputSearchValue
                }
                if (input.typeInputSearch === 'searchNamsinh') {
                    searchNamsinh = input.inputSearchValue
                }
                if (input.typeInputSearch === 'searchDiachi') {
                    searchDiachi = input.inputSearchValue
                }
                if (input.typeInputSearch === 'searchLoaibenh') {
                    searchLoaibenh = input.inputSearchValue
                }
                if (input.typeInputSearch === 'searchNgaykham') {
                    searchNgaykham = input.inputSearchValue
                }
            })

            //------------------------------------

            let response = await searchPatient(
                searchName, searchPhone,
                searchNamsinh, searchDiachi,
                searchLoaibenh, searchNgaykham,
                currentSearchPage, currentSearchLitmit
            )
            if (response && response.EC === 0) {
                setTotalSearchPages(response.DT.totalPages)
                if (response.DT.totalPages > 0 && response.DT.patients.length === 0) {
                    setCurrentSearchPage(response.DT.totalPages)
                }
                if (response.DT.totalPages > 0 && response.DT.patients.length > 0) {
                    setSearchResults(response.DT.patients)
                    console.log('du liệu tìm kiếm nhận được', response.DT.patients)
                    setIsLoading(false)
                } else {
                    toast.error('Thông tin không tồn tại !')
                    setIsLoading(false)
                }
            } else {
                toast.error(response.EM)
            }
        }
    };

    // ------------- End tìm kiếm

    useEffect(() => {

        if (searchResults.length > 0) {
            handleSearch()
        } else {
            getAllPatient() // eslint-disable-next-line react-hooks/exhaustive-deps
        }

    }, [searchResults.length > 0 ? currentSearchPage : currentPage])

    const getAllPatient = async () => {
        let response = await fetchAllPatient(currentPage, currentLitmit)
        if (response && response.EC === 0) {
            setTotalPages(response.DT.totalPages)
            if (response.DT.totalPages > 0 && response.DT.patients.length === 0) {
                setCurrentPage(response.DT.totalPages)
            }
            if (response.DT.totalPages > 0 && response.DT.patients.length > 0) {
                setDataPatient(response.DT.patients)
            }
        }
    }

    const handleRefresh = async () => {
        setCurrentPage(1)
        setSearchResults([]);
        setListInputs({
            inputSearch: { typeInputSearch: '', inputSearchValue: '', isValidInput: true, isValidType: true },
        })
    }

    const handlePageClick = async (page) => {
        setCurrentPage(page.selected + 1)
        setCurrentSearchPage(page.selected + 1)
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

    const handleKeyPressSearch = (event) => {
        console.log(event.code)
        if (event.code === "Enter") {
            handleSearch()
        }
    }

    const handleEditPatient = (patient) => {
        setDataEditPatient(patient)
        history.push(`/editpatient`)
    }

    const dataTable = searchResults.length > 0 ? searchResults : dataPatient;
    const totalDataTable = searchResults.length > 0 ? totalSearchPages : totalPages
    const currentDataTablePage = searchResults.length > 0 ? currentSearchPage : currentPage

    return (
        <>
            <div className='container-fluid mb-5'>
                <div className='tittle pt-2'>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/home">Trang chủ</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Danh sách bệnh nhân</li>
                        </ol>
                    </nav>
                </div>
                <div className='search-content d-flex justify-content-between'>

                    <div className='button-search'>
                        <button className='btn btn-primary'
                            onClick={showModal}
                        ><i className="fa fa-search" /> Tìm kiếm</button>
                    </div>

                    <Modal className='modal-search'
                        title="Tìm kiếm"
                        open={isModalOpen}
                        onOk={handleSearch}
                        onCancel={handleCancel}
                        footer={[
                            <Button key="back" onClick={handleCancel}>
                                Đóng
                            </Button>,
                            <Button
                                key='link'
                                shape="circle"
                                type="primary"
                                onClick={handleSearch}
                                loading={isLoading}
                                icon={<i className="fa fa-search" />}
                            />

                        ]}
                    >
                        {
                            Object.entries(listInputs).map(([key, input], index) => {
                                return (
                                    <div className='searchContent d-flex col-12 my-1' key={`child-${key}`}>
                                        <div className='mx-2'>
                                            <select
                                                className={input.isValidType ? 'form-select col-4' : 'form-select col-4 is-invalid'}
                                                value={input.typeInputSearch}
                                                onChange={(event) => { handleChangeTypeInputSearch('typeInputSearch', event.target.value, key) }}
                                            >
                                                <option defaultValue>Chọn cột</option>
                                                <option value='searchName'>Họ tên</option>
                                                <option value="searchNamsinh">Năm sinh</option>
                                                <option value="searchDiachi">Địa chỉ</option>
                                                <option value="searchDienthoai">Điện thoại</option>
                                                <option value="searchLoaibenh">Loại bệnh</option>
                                                <option value="searchNgaykham">Ngày khám</option>
                                            </select>
                                        </div>
                                        <div className='input-search col-6'>
                                            <input type='type'
                                                className={input.isValidInput ? 'form-control' : 'form-control is-invalid'}
                                                value={input.inputSearchValue}
                                                onChange={(event) => handleOnChangeInput('inputSearchValue', event.target.value, key)}
                                            />
                                        </div>
                                        <div className='d-flex'>
                                            {index <= 8 &&
                                                <i
                                                    style={{ paddingTop: '7px', fontSize: '25px', paddingLeft: '10px', cursor: 'pointer' }}
                                                    className="addBT fa fa-plus-circle add"
                                                    onClick={() => handleAddNewInputSearch()}
                                                />
                                            }
                                            {index >= 1 &&
                                                <i className="fa fa-minus-circle remove"
                                                    style={{ paddingTop: '7px', fontSize: '25px', paddingLeft: '10px', cursor: 'pointer' }}
                                                    onClick={() => handleRemoveInputSearch(key)}
                                                />
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }

                    </Modal>
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

                        {dataTable.map(
                            (item, index) => (
                                <React.Fragment key={item.id}>
                                    <tr className='tr-table'>
                                        <td className='text-center align-middle'>
                                            {(currentPage - 1) * currentLitmit + index + 1}
                                        </td>
                                        <td className='text-center align-middle'>
                                            <div className='avatar-benhnhan'>
                                                <Image
                                                    className='avatar-benhnhan'
                                                    height={70}
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
                                        <td className='actions-container'>
                                            <div className='item-container'>
                                                <div className='item'>
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
                                                <div className='item'>
                                                    <i className="fa fa-trash-o"
                                                        onClick={() => handleDeletePatient(item)} />
                                                </div>
                                                <div className='item'>
                                                    <i className="fa fa-pencil"
                                                        onClick={() => handleEditPatient(item)}
                                                    />
                                                </div>
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
                                                    <div className="tab-content col-12">
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
                                                                            style={{ fontSize: '20px', fontWeight: 'bold' }}
                                                                            disabled
                                                                            className="textarea form-control"
                                                                            id="exampleFormControlTextarea1"
                                                                            value={item.chandoan || ''}
                                                                            rows="12"></textarea>,
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
                                                                            style={{ fontSize: '20px', fontWeight: 'bold' }}
                                                                            disabled
                                                                            className="textarea form-control"
                                                                            id="exampleFormControlTextarea1"
                                                                            value={item.ketqua || ''}
                                                                            rows="12"></textarea>,
                                                                    },
                                                                    {
                                                                        key: '5',
                                                                        label: `Thư viện ảnh`,
                                                                        children:
                                                                            <div className='d-flex justify-content-center'>
                                                                                <div className="carousel-wrapper">
                                                                                    <>
                                                                                        {item.Project_Imgs.map((image) => (
                                                                                            <Image
                                                                                                key={image.id}
                                                                                                height={100}
                                                                                                src={image.img_url}
                                                                                                onClick={() => setVisible(true)}
                                                                                            />
                                                                                        ))}
                                                                                    </>
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

                {totalPages > 0 &&
                    <div className='d-flex justify-content-center'>
                        <div>
                            <ReactPaginate
                                nextLabel=">"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={4}
                                marginPagesDisplayed={4}
                                pageCount={totalDataTable}
                                previousLabel="<"
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
                                forcePage={+currentDataTablePage - 1}
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