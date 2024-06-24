import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({icons}) => {

  const [isselected, setIsselected] = useState(0);

  return (
    <div className="h-screen bg-gray-100 fixed">
      <div className="h-full w-16 bg-white shadow-md flex flex-col items-center p-4">
            {icons.map( (item, index)=> (
              <Link to={item.to} onClick={()=>{
                setIsselected(index)
              }}>
                   <div className={`flex flex-col space-y-4 border-2 ${isselected === index ? "border-blue-500": "bg-gray-100"} my-4 h-12 w-12 rounded-md items-center justify-center`}>
                     <img src={item.icon} alt="Dashboard"/>
                  </div>
              </Link>
            ))}

        <div className='mt-auto'>
          <button className="bg-gray-100 rounded-md px-4 py-2 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
