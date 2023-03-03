import './Role.scss'
import { useRef, useState } from 'react'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { createRoles } from '../../services/roleService';
import TableRoles from './TableRoles';

const Role = (props) => {
    const childRef = useRef()
    const dataInputDefault = { url: '', description: '', isValidURL: true }
    const [listChilds, setListChilds] = useState({
        child1: dataInputDefault
    })

    const handleOnChangeInput = (name, value, key) => {
        let _listChilds = _.cloneDeep(listChilds)
        _listChilds[key][name] = value
        if (value && name === 'url') {
            _listChilds[key]['isValidURL'] = true
        }
        setListChilds(_listChilds)
    }

    const handleAddNewURL = () => {
        let _listChilds = _.cloneDeep(listChilds)
        _listChilds[`child-${uuidv4()}`] = dataInputDefault
        setListChilds(_listChilds)
    }

    const handleRemoveURL = (key) => {
        let _listChilds = _.cloneDeep(listChilds)
        console.log(_listChilds[key])
        delete _listChilds[key]
        setListChilds(_listChilds)
    }

    const buildDataToPersist = () => {
        let _listChilds = _.cloneDeep(listChilds)
        let result = []
        Object.entries(_listChilds).map(([key, child], index) => {
            result.push({
                url: child.url,
                description: child.description
            })
        })
        return result
    }

    const handleSave = async () => {
        let inValidOJB = Object.entries(listChilds).find(([key, child], index) => {
            return child && !child.url
        })
        if (!inValidOJB) {
            let data = buildDataToPersist()
            let res = await createRoles(data)
            if (res && res.EC === 0) {
                toast.success(res.EM)
                console.log(childRef)
                console.log(childRef.current)
                childRef.current.fetchListRolesAgain()
            }
        } else {
            toast.error('Input URL must not be empty !')
            let _listChilds = _.cloneDeep(listChilds)
            const key = inValidOJB[0]
            _listChilds[key]['isValidURL'] = false
            setListChilds(_listChilds)
        }
    }

    //console.log(listChilds)

    return (
        <>
            <div className='role-container'>
                <div className='container'>
                    <div className='mt-3'>
                        <div className='title'><h4>Thêm quyền</h4></div>
                        <div className='role-parent'>
                            {
                                Object.entries(listChilds).map(([key, child], index) => {
                                    return (
                                        <div className='role-child row' key={`child-${key}`}>
                                            <div className={`col-5 form-group ${key}`}>
                                                <label>URL : /user/read (demo)</label>
                                                <input type='type'
                                                    className={child.isValidURL ? 'form-control' : 'form-control is-invalid'}
                                                    value={child.url}
                                                    onChange={(event) => handleOnChangeInput('url', event.target.value, key)}
                                                />
                                            </div>
                                            <div className='col-5 form-group'>
                                                <label>Description:</label>
                                                <input type='type'
                                                    className='form-control'
                                                    value={child.description}
                                                    onChange={(event) => handleOnChangeInput('description', event.target.value, key)}
                                                />
                                            </div>
                                            <div className='col-2 mt-4 actions'>
                                                <i className="fa fa-plus-circle add"
                                                    onClick={() => handleAddNewURL()}
                                                />
                                                {index >= 1 &&
                                                    <i className="fa fa-minus-circle remove"
                                                        onClick={() => handleRemoveURL(key)}
                                                    />
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <div>
                                <button className='btn btn-primary mt-3'
                                    onClick={() => handleSave()}
                                >Save</button>
                            </div>
                        </div>
                    </div>
                    <div className='table-roles mt-3'>
                        <TableRoles ref={childRef} />
                    </div>
                </div>
            </div>
        </>
    )
}
export default Role