import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { UserProvider } from './context/UserContext';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { EditPatientProvider } from './context/EditPatientContext'
import { ActivePageProvider } from './context/ActivePageContext';

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <ActivePageProvider>
        <EditPatientProvider>
          <ProSidebarProvider>
            <App />
          </ProSidebarProvider>
        </EditPatientProvider>
      </ActivePageProvider>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

