import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
export default function LoginPage() {
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [redirect, setRedirect] = useState(null);
     const { setUser } = useContext(UserContext);
     const [reqOTP, setReqOTP] = useState(false);
     async function handleLoginSubmit(ev) {
          ev.preventDefault();
          try {
               const { data } = await axios.post("/login", { email, password });
               setUser(data);
               setReqOTP(true);
          } catch (error) {
               alert("Wrong Credentials, Please check Login info");
          }
     }
     const type = "verify";
     const [OTP, setOTP] = useState();
     const [modalVisible, setModalVisible] = useState(true);
     async function genOTP() {
          const type = "gen";
          const OTP = 0;
          const mailId = email;
          try {
               const { data } = await axios.post("/login/auth", {
                    mailId,
                    type,
                    OTP,
               });
               console.log(data);
          } catch (error) {
               throw error;
          }
     }
     async function checkValidity(ev) {
          ev.preventDefault();
          try {
               const { data } = await axios.post("/login/auth", { type, OTP });
               if (data === "goodCode") {
                    setRedirect("/");
                    alert("Login successful");
                    setReqOTP(false);
               } else {
                    alert("Invalid Code! Please try again");
               }
          } catch (error) {
               throw error;
          }
     }
     const closeModal = () => {
          console.log("reset");
          // Reset necessary state values
          setReqOTP(false);
          setOTP("");
          // Show the modal again
          setModalVisible(true);
          // Generate new OTP
     };

     useEffect(() => {
          if (reqOTP) {
               genOTP();
          }
     }, [reqOTP]);
     const handleResendOTP = () => {
          genOTP();
     };
     console.log(reqOTP);
     if (reqOTP === true) {
          return (
               <div className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full h-screen p-4 overflow-x-hidden overflow-y-auto md:inset-0">
                    <div className="relative w-full max-w-md max-h-full">
                         <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                              <button
                                   onClick={closeModal}
                                   type="button"
                                   className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                                   data-modal-hide="authentication-modal"
                              >
                                   <svg
                                        aria-hidden="true"
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                   >
                                        <path
                                             fillRule="evenodd"
                                             d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                             clipRule="evenodd"
                                        ></path>
                                   </svg>
                                   <span className="sr-only">Close modal</span>
                              </button>
                              <div className="items-center  px-6 py-6 lg:px-8">
                                   <div className="justify-center">
                                        <h3 className="text-center mb-1 text-xl font-medium text-gray-900 dark:text-white">
                                             Enter OTP sent at :
                                        </h3>

                                        <h3 className="text-center mb-3 text-gray-500 font-semibold">
                                             {email}
                                        </h3>
                                   </div>

                                   <form
                                        onSubmit={checkValidity}
                                        className="space-y-6"
                                        action="#"
                                   >
                                        <div>
                                             <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                  6-digit OneTimePassword :
                                             </label>
                                             <input
                                                  type="tel"
                                                  name="otp"
                                                  id="otp"
                                                  placeholder="XXXXXX"
                                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                  required
                                                  maxLength="6"
                                                  onChange={(ev) =>
                                                       setOTP(ev.target.value)
                                                  }
                                             />
                                        </div>
                                        <button
                                             type="submit"
                                             className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                             Verify OTP
                                        </button>
                                        <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                                             Not received?{" "}
                                             <a
                                                  href="#"
                                                  onClick={handleResendOTP}
                                                  className="text-blue-700 hover:underline dark:text-blue-500"
                                             >
                                                  Resend OTP
                                             </a>
                                        </div>
                                   </form>
                              </div>
                         </div>
                    </div>
               </div>
          );
     }
     if (redirect) {
          return <Navigate to={redirect} />;
     }

     return (
          <div className="mt-4 grow flex items-center justify-around">
               <div className="mb-64">
                    <h1 className="text-4xl text-center mb-4">Login</h1>
                    <form
                         action=""
                         className="max-w-md mx-auto "
                         onSubmit={handleLoginSubmit}
                    >
                         <input
                              type="email"
                              placeholder="your@email.com"
                              value={email}
                              required
                              onChange={(ev) => setEmail(ev.target.value)}
                         />
                         <input
                              type="password"
                              placeholder="password"
                              value={password}
                              required
                              onChange={(ev) => setPassword(ev.target.value)}
                         />
                         <button className="primary font-bold">Login</button>
                         <div className="text-center py-2 text-gray-500">
                              Don't have an account?{" "}
                              <Link to={"/register"} className="underline text">
                                   Register now!
                              </Link>
                         </div>
                    </form>
               </div>
          </div>
     );
}
