import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
export default function RegisterPage() {
     const [name, setName] = useState("");
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [alertS, setAlertS] = useState(false);
     async function registerUser(ev) {
          ev.preventDefault();

          try {
               await axios.post("/register", {
                    name,
                    email,
                    password,
               });
               setAlertS(true);
          } catch (e) {
               setAlertS(false);
          }
     }
     function regAlert() {
          if (!alertS) {
               return (
                    <div
                         class="mb-3 inline-flex w-full items-center justify-center rounded-lg bg-primary-100 px-6 py-5 text-base text-primary-700"
                         role="alert"
                    >
                         <span class="mr-2">
                              <svg
                                   xmlns="http://www.w3.org/2000/svg"
                                   viewBox="0 0 24 24"
                                   fill="currentColor"
                                   class="h-5 w-5"
                              >
                                   <path
                                        fill-rule="evenodd"
                                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                        clip-rule="evenodd"
                                   />
                              </svg>
                         </span>
                         <span>
                              Already a member?{" "}
                              <Link
                                   to={"/login"}
                                   className="underline text font-bold"
                              >
                                   Login here!
                              </Link>
                         </span>
                    </div>
               );
          } else {
               return (
                    <div
                         className="mb-3 inline-flex w-full items-center justify-center rounded-lg bg-success-100 px-6 py-5 text-base text-success-700"
                         role="alert"
                    >
                         <span className="mr-2">
                              <svg
                                   xmlns="http://www.w3.org/2000/svg"
                                   viewBox="0 0 24 24"
                                   fill="currentColor"
                                   class="h-5 w-5"
                              >
                                   <path
                                        fillRule="evenodd"
                                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                        clipRule="evenodd"
                                   />
                              </svg>
                         </span>
                         <span>
                              Registration Sucessful!{" "}
                              <Link
                                   to={"/login"}
                                   className="underline text font-bold"
                              >
                                   {" "}
                                   Login here!
                              </Link>
                         </span>
                    </div>
               );
          }
     }
     return (
          <div className="mt-4 grow flex items-center justify-around">
               <div className="mb-64">
                    <h1 className="text-4xl text-center mb-4">Register</h1>
                    <form
                         action=""
                         className="max-w-md mx-auto "
                         onSubmit={registerUser}
                    >
                         <input
                              type="text"
                              placeholder="John Wick"
                              value={name}
                              onChange={(ev) => setName(ev.target.value)}
                         />
                         <input
                              type="email"
                              placeholder="your@email.com"
                              value={email}
                              onChange={(ev) => setEmail(ev.target.value)}
                         />
                         <input
                              type="password"
                              placeholder="password"
                              value={password}
                              onChange={(ev) => setPassword(ev.target.value)}
                         />
                         <button className="primary font-bold">Register</button>
                    </form>
                    {regAlert()}
               </div>
          </div>
     );
}
