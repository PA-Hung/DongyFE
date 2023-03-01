import React, { useState, createContext } from 'react';

const EditPatientContext = createContext(null);

const EditPatientProvider = ({ children }) => {

    const [dataEditPatient, SetDataEditPatient] = useState('')

    return (
        <EditPatientContext.Provider value={[dataEditPatient, SetDataEditPatient]}>
            {children}
        </EditPatientContext.Provider>
    );
}

export { EditPatientContext, EditPatientProvider } 
