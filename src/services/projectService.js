import axios from '../setup/axios'

// const fetchAllPatient = () => {
//     return axios.get(`/api/v1/project/read`)
// }

const fetchAllPatient = (page, limit) => {
    return axios.get(`/api/v1/project/read?page=${page}&limit=${limit}`)
}

const deletePatient = (patient) => {
    return axios.delete('/api/v1/project/delete', {
        data: { id: patient.id }
    })
}

const createNewPatient = (patientData) => {
    return axios.post('/api/v1/project/create', { ...patientData })
}

const updatePatient = (patientData) => {
    return axios.put('/api/v1/project/update', { ...patientData })
}

const searchPatient = (value, page, limit) => {
    console.log('check data gui BE >>>>>>>>>', value, page, limit)
    return axios.get(`api/v1/project/search?value=${value}&page=${page}&limit=${limit}`)
}

export {
    fetchAllPatient,
    deletePatient,
    createNewPatient,
    updatePatient,
    searchPatient
}