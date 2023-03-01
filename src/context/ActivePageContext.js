import React, { createContext, useState } from 'react';

const ActivePageContext = createContext();

const ActivePageProvider = ({ children }) => {
    const [activePage, setActivePage] = useState(
        localStorage.getItem('activePage') || 'Trang chủ'
    );

    return (
        <ActivePageContext.Provider value={{ activePage, setActivePage }}>
            {children}
        </ActivePageContext.Provider>
    );
};

export { ActivePageContext, ActivePageProvider } 
