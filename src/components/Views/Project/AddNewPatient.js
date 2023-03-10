import React from 'react'
import './AddNewPatient.scss'
import { createNewPatient } from '../../../services/projectService'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { ConfigProvider } from 'antd';
import vi_VN from 'antd/locale/vi_VN';
import uploadImage from '../../../services/imageService'
import { Oval } from 'react-loader-spinner'
import { useHistory } from 'react-router-dom'

dayjs.extend(customParseFormat);

// const yearFormatList = ['YYYY', 'YY'];
const dateFormatList = ['DD/MM/YYYY'];


const AddNewPatient = () => {
    let history = useHistory()
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState('');

    // const currentYear = dayjs().year((new Date()).toISOString().substring(0, 4))
    // const currentDate = dayjs().date((new Date().toLocaleDateString()).split("/")[0])
    // const yearDemo = dayjs(new Date()).toISOString().substring(0, 4);
    // const dateDemo = dayjs(ngaykham).toISOString().substring(0, 10).split("-").reverse().join("/")

    const [namsinh, setNamsinh] = useState(dayjs().year())

    const [phanloaibenh, setPhanloaibenh] = useState('')
    const [name, setName] = useState('')
    const [tuoi, setTuoi] = useState('')
    const [ngaykham, setNgaykham] = useState(dayjs());
    const [dienthoai, setDienthoai] = useState('')
    const [diachi, setDiachi] = useState('')
    const [ghichu, setGhichu] = useState('')
    const [chandoan, setChandoan] = useState('')
    const [dieutri, setDieutri] = useState('')
    const [ketqua, setKetqua] = useState('')
    const [hinhanh, setHinhanh] = useState();

    const defaultPatientData = {
        phanloaibenh, name, tuoi, ngaykham, dienthoai, diachi,
        ghichu, chandoan, dieutri, ketqua, hinhanh
    }

    const defaultValidInput = {
        isValidPhanloaibenh: true,
        isValidXeploai: true,
        isValidName: true,
        isValidPhone: true,
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
        if (!name) {
            toast.error('B???n ph???i nh???p h??? t??n !')
            setOjbCheckInput({ ...defaultValidInput, isValidName: false })
            return false
        }
        // if (!dienthoai) {
        //     toast.error('B???n ph???i nh???p s??? ??i???n tho???i !')
        //     setOjbCheckInput({ ...defaultValidInput, isValidPhone: false })
        //     return false
        // }
        // let phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        // if (!phoneno.test(dienthoai)) {
        //     toast.error('S??? ??i???n tho???i kh??ng ????ng !')
        //     setOjbCheckInput({ ...defaultValidInput, isValidPhone: false })
        //     return false
        // }
        if (!ngaykham) {
            toast.error('B???n ph???i nh???p ng??y kh??m !')
            setOjbCheckInput({ ...defaultValidInput, isValidNgaykham: false })
            return false
        }
        return true
    }

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    }

    const handleChangeYear = (date) => {
        if (date) {
            setNamsinh(date.year());
        }
    }

    const handleAddNewPatient = async () => {
        // console.log('n??m sinh : ', namsinh)
        // console.log('n??m sinh : ', dayjs(`${namsinh}-01-01`))
        // console.log('ng??y hi???n t???i ???? convert : ', dayjs().get('date'))
        // console.log('n??m hi???n t???i ???? convert : ', dayjs().get('year'))
        // console.log('n??m sinh ?????u ra : ', dayjs().year(namsinh))
        // let currentYearToNumber = dayjs().get('year') // n??m hi???n t???i ???? chuy???n th??nh s???
        // let yearold = (currentYearToNumber - namsinh)
        // console.log('ng??y kh??m ?????u v??o : ', ngaykham)
        // console.log('ng??y hi???n t???i ???? chuy???n th??nh s??? : ', dayjs().get('date'))
        // console.log('ng??y kh??m ?????u v??o ???? convert chu???n hi???n th??? : ', dayjs().date(1))
        // console.log('ng??y kh??m ?????u v??o : ', (new Date().toLocaleDateString()).split("/")[0])

        let check = isValidInputs()
        if (check === true) {
            let currentYear = dayjs().get('year') // n??m hi???n t???i ???? chuy???n th??nh s???
            let yearOld = (currentYear - namsinh)
            if (yearOld === 0) {
                toast.error('N??m sinh ph???i nh??? h??n n??m hi???n t???i !')
            } else {
                setLoading(true);
                if (selectedFile) {
                    const reader = new FileReader();
                    reader.readAsDataURL(selectedFile);
                    reader.onloadend = async () => {
                        let res = await uploadImage(reader.result);
                        let data = await createNewPatient({ ...defaultPatientData, tuoi: namsinh, hinhanh: res.DT })
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
                    let data = await createNewPatient({ ...defaultPatientData, tuoi: yearOld, hinhanh: '' })
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
                    <div className="loading-text">??ang th??m b???nh nh??n m???i vui l??ng ch??? ...</div>
                </div> :
                <div className='container-fluid'>
                    <div className='tittle pt-2'>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="/home">Trang ch???</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Th??m m???i b???nh nh??n</li>
                            </ol>
                        </nav>
                    </div>
                    <div className='container-fluid pt-4 h-100'>
                        <div className="row justify-content-center align-items-center h-100">
                            <div className="col-12 col-lg-9 col-xl-7">
                                <div className="card shadow-2-strong card-registration">
                                    <div className="card-body p-3 p-md-5">
                                        <div><h3 className='text-center mb-2'>Th??m b???nh nh??n m???i</h3></div>

                                        <div className="row">
                                            <div className="col-md-12 mb-3">
                                                <div className="form-outline">
                                                    <label className="form-label">H??? & T??n</label>
                                                    <input type="text"
                                                        className={ojbCheckInput.isValidName ? 'form-control mt-1' : 'form-control mt-1 is-invalid'}
                                                        value={name} onChange={(event) => setName(event.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-3 d-flex align-items-center">
                                                <div className="form-outline datepicker w-100">
                                                    <label className="form-label">S??? ??i???n tho???i</label>
                                                    <input type="text"
                                                        className={ojbCheckInput.isValidPhone ? 'form-control' : 'form-control is-invalid'}
                                                        value={dienthoai} onChange={(event) => setDienthoai(event.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <div className="form-outline datepicker w-100">
                                                    <label htmlFor="birthdayDate" className="form-label">N??m sinh</label>
                                                    <DatePicker
                                                        className='form-control'
                                                        defaultValue={dayjs(`${namsinh}-01-01`)}
                                                        picker="year"
                                                        onChange={(date) => handleChangeYear(date)}
                                                    />
                                                </div>
                                            </div>


                                            <div className="col-md-6 mb-3">
                                                <div className="form-outline">
                                                    <label className="form-label">Ph??n lo???i b???nh</label>
                                                    <input type="text"
                                                        className='form-control'
                                                        value={phanloaibenh} onChange={(event) => setPhanloaibenh(event.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <div className="form-outline datepicker w-100">
                                                    <label className="form-label">Ng??y kh??m</label>
                                                    <DatePicker
                                                        className={ojbCheckInput.isValidNgaykham ? 'form-control' : 'form-control is-invalid'}
                                                        defaultValue={ngaykham}
                                                        format={dateFormatList}
                                                        onChange={(date) => setNgaykham(date)}
                                                    />
                                                </div>
                                            </div>

                                        </div>

                                        <div className="row">
                                            <div className="col-md-12 mb-3">
                                                <div className="form-outline">
                                                    <label className="form-label">?????a ch???</label>
                                                    <input type="text"
                                                        className="form-control"
                                                        value={diachi} onChange={(event) => setDiachi(event.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-12 mb-3">
                                                <label className="form-label">Ghi ch??</label>
                                                <div className="form-floating">
                                                    <textarea
                                                        className="form-control"
                                                        value={ghichu} onChange={(event) => setGhichu(event.target.value)}
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 mb-3">
                                                <label className="form-label">Ch???n ??o??n</label>
                                                <div className="form-floating">
                                                    <textarea
                                                        className="form-control"
                                                        value={chandoan} onChange={(event) => setChandoan(event.target.value)}
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 mb-3">
                                                <label className="form-label">??i???u tr???</label>
                                                <div className="form-floating">
                                                    <textarea
                                                        className="form-control"
                                                        value={dieutri} onChange={(event) => setDieutri(event.target.value)}
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-12 mb-3">
                                                <label className="form-label">K???t qu???</label>
                                                <div className="form-floating">
                                                    <textarea
                                                        className="form-control"
                                                        value={ketqua} onChange={(event) => setKetqua(event.target.value)}
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-12">
                                                <label className="form-label" htmlFor="customFile">???nh ?????i di???n</label>
                                                <input type="file"
                                                    className="form-control"
                                                    id="customFile"
                                                    onChange={(event) => handleFileInputChange(event)}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-2 d-flex justify-content-end">
                                            <button
                                                onClick={() => handleAddNewPatient()}

                                                className="btn btn-primary"
                                                type="submit">
                                                <i className="fa fa-floppy-o" /> L??u
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

export default AddNewPatient