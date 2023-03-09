import React from 'react'
import { updatePatient } from '../../../services/projectService'
import { useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { ConfigProvider } from 'antd';
import vi_VN from 'antd/locale/vi_VN';
import uploadImage from '../../../services/imageService'
import { Oval } from 'react-loader-spinner'
import { useHistory } from 'react-router-dom'
import { useEffect } from 'react'
import { EditPatientContext } from '../../../context/EditPatientContext'
import _ from 'lodash'

dayjs.extend(customParseFormat);
//const yearFormatList = ['YYYY'];
const dateFormatList = ['DD/MM/YYYY'];
const currentYear = dayjs().get('year')
const currentDay = dayjs().get('date')

const EditPatient = (props) => {
    const [dataEditPatient, SetDataEditPatient] = useContext(EditPatientContext)
    let history = useHistory()
    const [namsinh, setNamsinh] = useState(dataEditPatient.tuoi)
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState('');

    const defaultValidInput = {
        isValidPhanloaibenh: true,
        isValidXeploai: true,
        isValidName: true,
        isValidPhone: true,
        isValidNamsinh: true,
        isValidNgaykham: true,
        isValidDiachi: true,
        isValidGhichu: true,
        isValidChandoan: true,
        isValidDieutri: true,
        isValidKetqua: true
    }

    const [ojbCheckInput, setOjbCheckInput] = useState(defaultValidInput)

    const isValidInputs = () => {
        setOjbCheckInput(defaultValidInput);
        if (!dataEditPatient.name) {
            toast.error('Bạn phải nhập họ tên !')
            setOjbCheckInput({ ...defaultValidInput, isValidName: false })
            return false
        }
        // if (!dataEditPatient.dienthoai) {
        //     toast.error('Bạn phải nhập số điện thoại !')
        //     setOjbCheckInput({ ...defaultValidInput, isValidPhone: false })
        //     return false
        // }
        // let phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        // if (!phoneno.test(dataEditPatient.dienthoai)) {
        //     toast.error('Số điện thoại không đúng !')
        //     setOjbCheckInput({ ...defaultValidInput, isValidPhone: false })
        //     return false
        // }
        if (!dataEditPatient.ngaykham) {
            toast.error('Bạn phải nhập ngày khám !')
            setOjbCheckInput({ ...defaultValidInput, isValidNgaykham: false })
            return false
        }
        return true
    }

    useEffect(() => {
        if (!dataEditPatient && dataEditPatient.length === 0) {
            history.push('/project')
        }
    }, [dataEditPatient])

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    }

    const handleChangeYear = (date) => {
        if (date) {
            console.log('date', date)
            console.log('date.year()', date.year())
            setNamsinh(date.year());

        }
    }

    const handleonChangeInput = (value, name) => {
        let _patientData = _.cloneDeep(dataEditPatient)
        _patientData[name] = value
        SetDataEditPatient(_patientData)
    }

    const handleUpdate = async () => {
        // console.log('>>>>>>>>>>>> currentYear:', currentYear)
        //console.log('>>>>>>>>>>>> nam sinh :', namsinh)
        // console.log('>>>>>>>>>>>> Tuổi :', yearOld)
        // console.log('>>>>>>>>>>>> check data luu vao db :', dataEditPatient)
        let check = isValidInputs()
        if (check === true) {
            let yearOld = (currentYear - namsinh)
            if (yearOld === 0) {
                toast.error('Năm sinh phải nhỏ hơn năm hiện tại !')
                setOjbCheckInput(ojbCheckInput.isValidNamsinh = false)
            } else {
                setLoading(true);
                if (selectedFile) {
                    const reader = new FileReader();
                    reader.readAsDataURL(selectedFile);
                    reader.onloadend = async () => {
                        let res = await uploadImage(reader.result);
                        let data = await updatePatient({ ...dataEditPatient, tuoi: namsinh, hinhanh: res.DT })
                        if (res.EC === 0 && +data.EC === 0) {
                            setLoading(false);
                            history.push("/project");
                            toast.success(data.EM);
                        } else {
                            setLoading(false);
                            if (data.DT === 'phone') {
                                setOjbCheckInput({ ...defaultValidInput, isValidPhone: false })
                            }
                            toast.error(data.EM)
                        }
                    };
                    reader.onerror = () => {
                        console.error('Error reader image !');
                    };
                } else {
                    let data = await updatePatient({ ...dataEditPatient, tuoi: namsinh, hinhanh: null })
                    if (+data.EC === 0) {
                        setLoading(false);
                        history.push("/project");
                        toast.success(data.EM);
                    } else {
                        setLoading(false);
                        if (data.DT === 'phone') {
                            setOjbCheckInput({ ...defaultValidInput, isValidPhone: false })
                        }
                        toast.error(data.EM)
                    }
                }
            }
        }

    }

    return (
        <ConfigProvider locale={vi_VN}>
            {loading ?
                <div className="loading-container">
                    <Oval
                        height={80}
                        width={80}
                        color="#4fa94d"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                        ariaLabel='oval-loading'
                        secondaryColor="#4fa94d"
                        strokeWidth={2}
                        strokeWidthSecondary={2}
                    />
                    <div className="loading-text">Đang cập nhật thông tin bệnh nhân vui lòng chờ ...</div>
                </div> :
                <div className='container-fluid'>
                    <div className='tittle pt-2'>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="/home">Trang chủ</a></li>
                                <li className="breadcrumb-item"><a href="/project">Danh sách bệnh nhân</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Thông tin bệnh nhân</li>
                            </ol>
                        </nav>
                    </div>
                    <div className='container-fluid pt-4 h-100'>
                        <div className="row justify-content-center align-items-center h-100">
                            <div className="col-12 col-lg-9 col-xl-7">
                                <div className="card shadow-2-strong card-registration">
                                    <div className="card-body p-3 p-md-5">
                                        <div><h3 className='text-center mb-2'>Thông tin bệnh nhân</h3></div>

                                        <div className="row">
                                            <div className="col-md-12 mb-3">
                                                <div className="form-outline">
                                                    <label className="form-label">Họ & Tên</label>
                                                    <input type="text"
                                                        className={ojbCheckInput.isValidName ? 'form-control mt-1' : 'form-control mt-1 is-invalid'}
                                                        value={dataEditPatient.name || ''} onChange={(event) => handleonChangeInput(event.target.value, 'name')}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-3 d-flex align-items-center">
                                                <div className="form-outline datepicker w-100">
                                                    <label className="form-label">Số điện thoại</label>
                                                    <input type="text"
                                                        className={ojbCheckInput.isValidPhone ? 'form-control' : 'form-control is-invalid'}
                                                        value={dataEditPatient.dienthoai || ''} onChange={(event) => handleonChangeInput(event.target.value, 'dienthoai')}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <div className="form-outline datepicker w-100">
                                                    <label htmlFor="birthdayDate" className="form-label">Năm sinh</label>
                                                    <DatePicker
                                                        className='form-control'
                                                        defaultValue={dayjs(`${+dataEditPatient.tuoi}-01-01`)}
                                                        picker="year"
                                                        onChange={(date) => handleChangeYear(date)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <div className="form-outline">
                                                    <label className="form-label">Phân loại bệnh</label>
                                                    <input type="text"
                                                        className='form-control'
                                                        value={dataEditPatient.phanloaibenh || ''} onChange={(event) => handleonChangeInput(event.target.value, 'phanloaibenh')}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <div className="form-outline datepicker w-100">
                                                    <label className="form-label">Ngày khám</label>
                                                    <DatePicker
                                                        className={ojbCheckInput.isValidNgaykham ? 'form-control' : 'form-control is-invalid'}
                                                        defaultValue={dataEditPatient.ngaykham ? dayjs(dataEditPatient.ngaykham) : ''}
                                                        format={dateFormatList}
                                                        onChange={(date) => handleonChangeInput(date, 'ngaykham')}
                                                    />
                                                </div>
                                            </div>

                                        </div>

                                        <div className="row">
                                            <div className="col-md-12 mb-3">
                                                <div className="form-outline">
                                                    <label className="form-label">Địa chỉ</label>
                                                    <input type="text"
                                                        className="form-control"
                                                        value={dataEditPatient.diachi || ''} onChange={(event) => handleonChangeInput(event.target.value, 'diachi')}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-12 mb-3">
                                                <label className="form-label">Ghi chú</label>
                                                <div className="form-floating">
                                                    <textarea
                                                        className="form-control"
                                                        value={dataEditPatient.ghichu || ''} onChange={(event) => handleonChangeInput(event.target.value, 'ghichu')}
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 mb-3">
                                                <label className="form-label">Chẩn đoán</label>
                                                <div className="form-floating">
                                                    <textarea
                                                        className="form-control"
                                                        value={dataEditPatient.chandoan || ''} onChange={(event) => handleonChangeInput(event.target.value, 'chandoan')}
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 mb-3">
                                                <label className="form-label">Điều trị</label>
                                                <div className="form-floating">
                                                    <textarea
                                                        className="form-control"
                                                        value={dataEditPatient.dieutri || ''} onChange={(event) => handleonChangeInput(event.target.value, 'dieutri')}
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-12 mb-3">
                                                <label className="form-label">Kết quả</label>
                                                <div className="form-floating">
                                                    <textarea
                                                        className="form-control"
                                                        value={dataEditPatient.ketqua || ''} onChange={(event) => handleonChangeInput(event.target.value, 'ketqua')}
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-12">
                                                <label className="form-label" htmlFor="customFile">Ảnh đại diện</label>
                                                <input type="file"
                                                    className="form-control"
                                                    id="customFile"
                                                    onChange={(event) => handleFileInputChange(event)}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-2 d-flex justify-content-end">
                                            <button
                                                onClick={() => handleUpdate()}
                                                className="btn btn-primary"
                                                type="submit">
                                                <i className="fa fa-floppy-o" /> Cập nhật
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </ConfigProvider>
    )
}

export default EditPatient