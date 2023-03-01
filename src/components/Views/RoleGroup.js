import './RoleGroup.scss'
import { useEffect, useState } from 'react'
import { fetchGroup } from '../../services/apiService';
import { fetchAllRoles, fetchRolesByGroup, assignRolesToGroup } from '../../services/roleService'
import { toast } from 'react-toastify';
import _ from 'lodash'

const RoleGroup = () => {
    const [userGroups, setUserGroups] = useState([])
    const [listRoles, setListRoles] = useState([])
    const [selectGroup, setSelectGroup] = useState('')
    const [assignRolesByGroup, setAssignRolesByGroup] = useState([])

    useEffect(() => {
        getGroup() // eslint-disable-next-line react-hooks/exhaustive-deps
        getAllRoles() // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getGroup = async () => {
        let res = await fetchGroup()
        if (res && res.EC === 0) {
            setUserGroups(res.DT)
        } else {
            toast.error(res.EM)
        }
    }

    const getAllRoles = async () => {
        let data = await fetchAllRoles()
        if (data && +data.EC === 0) {
            setListRoles(data.DT)
            console.log('>>>>>>>> check list role', listRoles)
        } else {
            toast.error(data.EM)
        }
    }

    const handleOnChangeGroup = async (value) => {
        setSelectGroup(value)
        if (value) {
            let data = await fetchRolesByGroup(value)
            if (data && +data.EC === 0) {
                let result = buildDataRolesByGroup(data.DT.Roles, listRoles)
                setAssignRolesByGroup(result)
                // console.log('data >>>>>>>>>>>>', data.DT.Roles)
                // console.log('listRoles >>>>>>>>>>>>', listRoles)
                // console.log('result >>>>>>>>>>>>', result)
            } else {
                toast.error(data.EM)
            }
        }

    }

    const buildDataRolesByGroup = (groupRoles, allRoles) => {
        let result = []
        if (allRoles && allRoles.length > 0) {
            allRoles.map(role => {
                let object = {}
                object.url = role.url
                object.id = role.id
                object.description = role.description
                object.isAssigned = false
                if (groupRoles && groupRoles.length > 0) {
                    object.isAssigned = groupRoles.some(item => item.url === object.url)
                    // hàm some so sánh 2 giá trị item.url và object.url nếu giống nhau trả ra true
                    // không giống trả ra false
                }
                return result.push(object)
            })
        }
        return result
    }

    const handleOnChangeCheckbox = (event) => {
        const _assignRolesByGroup = _.cloneDeep(assignRolesByGroup)
        let foundindex = _assignRolesByGroup.findIndex(item => +item.id === +event)
        if (foundindex > -1) {
            _assignRolesByGroup[foundindex].isAssigned = !_assignRolesByGroup[foundindex].isAssigned
        }
        setAssignRolesByGroup(_assignRolesByGroup)
    }

    const buildDataToSave = () => {
        // data = {groupId: 4, groupRoles:[{},{}]}
        let result = {}

        const _assignRolesByGroup = _.cloneDeep(assignRolesByGroup)
        let groupRolesFilter = _assignRolesByGroup.filter(item => item.isAssigned === true)
        result.groupId = selectGroup;
        // tìm những phần tử trong _assignRolesByGroup với điều kiện có các phần tử isAssigned bằng true
        let finalGroupRoles = groupRolesFilter.map(item => {
            let data = { groupId: +selectGroup, roleId: +item.id }

            return data
        })
        console.log('>>>>>>>>>>>>>>>>>> groupRoles:', finalGroupRoles)
        result.groupRoles = finalGroupRoles

        return result
    }

    const handleSave = async () => {
        let data = buildDataToSave()
        console.log('>>>>>>>>>>>>>>>>>> final data:', data)
        let res = await assignRolesToGroup(data)
        if (res && res.EC === 0) {
            toast.success(res.EM)
        } else {
            toast.error(res.EM)
        }
    }

    return (
        <>
            <div className='container'>

                <div className='mt-3'><h4>Nhóm quyền :</h4></div>
                <div className='col-12 col-sm-6 form-group mt-3'>
                    <select
                        className='form-select'
                        aria-label="Group"
                        onChange={(event) => handleOnChangeGroup(event.target.value)}
                    >
                        <option defaultValue=''>Select your group</option>
                        {
                            userGroups.length > 0 && userGroups.map((item, index) => {
                                return (
                                    <option key={`group-${index}`} value={item.id}>{item.name}</option>
                                )
                            })
                        }
                    </select>
                </div>

                <hr />
                {selectGroup &&
                    <div>
                        <h4>Assign Roles :</h4>
                        {assignRolesByGroup && assignRolesByGroup.length > 0
                            && assignRolesByGroup.map((item, index) => {
                                return (
                                    <div className="form-check" key={`list-role-${index}`}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            value={item.id}
                                            id={`list-role-${index}`}
                                            checked={item.isAssigned}
                                            onChange={(event) => handleOnChangeCheckbox(event.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor={`list-role-${index}`}>
                                            {item.url}
                                        </label>
                                    </div>
                                )
                            })}
                        <button className='btn btn-success mt-3'
                            onClick={() => handleSave()}
                        >Save</button>
                    </div>
                }
            </div>
        </>
    )
}

export default RoleGroup