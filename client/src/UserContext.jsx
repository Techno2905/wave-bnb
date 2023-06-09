import axios from "axios";
import {data} from "autoprefixer";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      axios
        .get('/profile')
        .then(({ data }) => {
          setUser(data);
          setReady(true);
        })
        .catch((error) => {
          setError(error);
          setReady(true);
        });
    }
  }, []);

  if (error) {
    console.error("Error fetching user data:", error);
    // Handle the error here, such as displaying an error message or redirecting to an error page
  }

  return (
    <UserContext.Provider value={{ user, setUser, ready}}>
      {children}
    </UserContext.Provider>
  );
}
