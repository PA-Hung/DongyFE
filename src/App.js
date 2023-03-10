import SideBar from "./components/Navigation/SideBar";
import AppRoutes from "./routers/AppRoutes";
import React, { useState } from "react";
import './App.scss';
import { BrowserRouter as Router, } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bars } from 'react-loader-spinner'
import { UserContext } from "./context/UserContext";
import NaviBar from "./components/Navigation/NaviBar";

function App() {
  const { user } = React.useContext(UserContext)
  const [isHideAllBar, setIsHideAllBar] = useState(false)
  const handleKeyDown = (event) => {
    if (event.key === "F11") {
      setIsHideAllBar(true)
    }
    if (event.key === "Enter") {
      setIsHideAllBar(false)
    }
  };
  document.addEventListener("keydown", handleKeyDown);

  return (
    <>
      <Router>
        {user && user.isLoading ?
          <div className="loading-container">
            <Bars
              height="80"
              width="80"
              color="#4fa94d"
              ariaLabel="bars-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
            <div className="loading-text">Loading ...</div>
          </div>
          :
          <>
            <div className="main-app" >
              {isHideAllBar ? <div className="d-none sidebar"><SideBar /></div>
                : <div className="sidebar"><SideBar /></div>}
              <div className="right-container">
                {isHideAllBar ? <div className="d-none navibar"><NaviBar /></div>
                  : <div className="navibar"><NaviBar /></div>}
                <div className="app-container" ><AppRoutes /></div>
              </div>
            </div>

          </>
        }
      </Router>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
    </>
  );
}

export default App;
