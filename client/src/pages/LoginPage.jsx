import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
export default function LoginPage() {
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [redirect, setRedirect] = useState(null);
     const { setUser } = useContext(UserContext);

     async function handleLoginSubmit(ev) {
          ev.preventDefault();
          try {
               const { data } = await axios.post("/login", { email, password });
               console.log(data);
               if (data === "NotFound") {
                    setRedirect(null);
                    alert("Login failed");
               } else {
                    setUser(data);
                    setRedirect("/");
                    alert("Login successful");
               }
          } catch (error) {
               alert("Wrong Credentials, Please check Login info");
          }
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
