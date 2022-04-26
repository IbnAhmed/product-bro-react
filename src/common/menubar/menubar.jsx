import React from "react";
import { Link } from "react-router-dom";
import logo from "../../logo.svg";
const MenuBar = () => {
  const token = localStorage.getItem('token');
  const auth_user = JSON.parse(localStorage.getItem('auth_user'));
  function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('auth_user');
    window.location = '/';
  }
  return (
    <div className="relative bg-white">
      <div className="flex justify-between items-center border-b-2 border-gray-100 py-3 md:justify-start md:space-x-10">
        <div className="flex justify-start lg:w-0 lg:flex-1">
          <Link to="/">
            <span className="sr-only">Product Bro</span>
            <img className="h-8 w-auto sm:h-10" src={logo} alt="" />
          </Link>
        </div>
        <div className=" flex items-center justify-end flex-1 lg:w-0">
          {(() => {
              if(token){
                return <div className={`flex flex-wrap`}>
                  <span className={`text-purple-600 mr-2`}>Hi, {auth_user.first_name}</span>
                  <button
                    onClick={logout}
                    className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </div>
    
              } else {
                return <Link
                  to="/sign-in"
                  className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
                >
                  Sign in
                </Link>
    
              }               
            })()}
          {/* <Link
            to="/sign-up"
            className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Sign up
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
