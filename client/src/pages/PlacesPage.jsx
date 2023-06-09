import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import PlacesFormPage from "./PlacesFormPage";
import AccountNav from "../AccountNav";
import axios from "axios";
import PlaceImg from "./PlaceImg";

export default function PlacesPage() {
     const [places, setPlaces] = useState([]);

     useEffect(() => {
          axios.get("/user-places").then(({ data }) => {
               setPlaces(data);
          });
     }, []);
     return (
          <div>
               <AccountNav />

               <div className="text-center">
                    <Link
                         className="inline-flex gap-1   bg-primary text-white py-2 px-6 rounded-full"
                         to={"/account/places/new"}
                    >
                         <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-6 h-6"
                         >
                              <path
                                   fillRule="evenodd"
                                   d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                                   clipRule="evenodd"
                              />
                         </svg>
                         Add new place
                    </Link>
                    <div className="mt-4">
                         {places.length > 0 &&
                              places.map((place) => (
                                   <Link
                                        key={place._id}
                                        to={"/account/places/" + place._id}
                                        className="items-center flex cursor-pointer gap-4 bg-gray-200 p-4 rounded-2xl mb-3"
                                   >
                                        <div className=" flex w-48  bg-gray-300 rounded-2xl shrink-0 overflow-hidden">
                                             <PlaceImg place={place} />
                                        </div>
                                        <div className="grow-0 shrink">
                                             <h2 className="text-xl font-semibold">
                                                  {place.title}
                                             </h2>
                                             <h3 className="text-l">
                                                  {place.address}
                                             </h3>
                                             <p className="text-sm mt-1 text-left">
                                                  {place.description}
                                             </p>
                                        </div>
                                   </Link>
                              ))}
                    </div>
               </div>
          </div>
     );
}
