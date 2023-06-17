import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import Icon from "./assets/icon.jsx";

export default function Header() {
     const { user } = useContext(UserContext);
     return (
          <header className=" flex lg:justify-between sm:items-start sm:gap-4">
               <Link to={"/"} className="flex items-center gap-1">
                    <Icon />
                    <span className="font-bold text-xl">wavebnb</span>
               </Link>
               <div className="invisible lg:visible md:visible">
                    <div className="flex gap-2 border border-gray-300 rounded-full py-1 px-4 shadow-md shadow-gray-300 items-center ">
                         <div>Anywhere</div>
                         <div className="border border-l border-gray-300 h-full mx-2"></div>
                         <div>Any week</div>
                         <div className="border border-l border-gray-300 h-full mx-2"></div>
                         <div>Add guests</div>
                         <button className="shadow bg-primary text-white p-1.5 rounded-full ">
                              <svg
                                   xmlns="http://www.w3.org/2000/svg"
                                   fill="none"
                                   viewBox="0 0 24 24"
                                   strokeWidth={1.5}
                                   stroke="currentColor"
                                   className="w-5 h-5"
                              >
                                   <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                   />
                              </svg>
                         </button>
                    </div>
               </div>
               {/*User Login Button*/}
               <div>
                    <Link
                         to={user ? "/account" : "/login"}
                         className="flex gap-2 border border-gray-300 rounded-full py-2 px-4 items-center "
                    >
                         <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                         >
                              <path
                                   strokeLinecap="round"
                                   strokeLinejoin="round"
                                   d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                              />
                         </svg>
                         <div>
                              <svg
                                   xmlns="http://www.w3.org/2000/svg"
                                   fill="none"
                                   viewBox="0 0 24 24"
                                   strokeWidth={1.5}
                                   stroke="currentColor"
                                   className="w-6 h-6"
                              >
                                   <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                                   />
                              </svg>
                         </div>
                         {!!user && <div>{user.name}</div>}
                    </Link>
               </div>
          </header>
     );
}
