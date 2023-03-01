import './TableRoles.scss'
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { toast } from 'react-toastify';
import { fetchAllRoles, deleteRole } from '../../services/roleService'

const TableRoles = forwardRef((props, ref) => {
    const [listRoles, setListRoles] = useState([])
    const [expandedRows, setExpandedRows] = useState([]);

    const toggleExpandRow = (rowId) => {
        if (expandedRows.includes(rowId)) {
            setExpandedRows(expandedRows.filter((id) => id !== rowId));
        } else {
            setExpandedRows([...expandedRows, rowId]);
        }
    }

    useEffect(() => {
        getAllRoles()
    }, [])

    useImperativeHandle(ref, () => ({
        fetchListRolesAgain() {
            getAllRoles()
        }
    }))

    const getAllRoles = async () => {
        let res = await fetchAllRoles()
        if (res && +res.EC === 0) {
            setListRoles(res.DT)
            //console.log('>>>>>>>> check list role', listRoles)
        } else {
            toast.error(res.EM)
        }
    }

    const handleDeleteRole = async (role) => {
        let response = await deleteRole(role)
        if (response && response.EC === 0) {
            toast.success(response.EM)
            await getAllRoles()
        } else {
            toast.success(response.EM)
        }
    }

    return (
        <table className="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>URL</th>
                    <th>Description</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {/* Loop through your data and render each row */}
                {listRoles.length > 0 && listRoles.map((item, index) => (
                    <React.Fragment key={item.id}>
                        <tr>
                            <td className='align-middle'>{index + 1}</td>
                            <td className='align-middle'>{item.url}</td>
                            <td className='align-middle'>{item.description}</td>
                            <td className='actions align-middle'>
                                {expandedRows.includes(item.id) ?
                                    <i className="fa fa-minus-circle remove"
                                        onClick={() => toggleExpandRow(item.id)}
                                    />
                                    :
                                    <i className="fa fa-plus-circle add"
                                        onClick={() => toggleExpandRow(item.id)}
                                    />
                                }

                                <i className="fa fa-trash-o" onClick={() => handleDeleteRole(item)} />


                            </td>
                        </tr>
                        {/* Render the expanded content for the row */}
                        <tr className={`collapse ${expandedRows.includes(item.id) ? 'show' : ''}`}>
                            <td colSpan="4">
                                Your expanded content goes here
                            </td>
                        </tr>
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
})

export default TableRoles
