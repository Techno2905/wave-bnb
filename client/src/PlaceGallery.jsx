import Image from "./Image";
import More from "./assets/more";
import { useState } from "react";

export default function PlaceGallery({ place }) {
     const [showAllPhotos, setshowAllPhotos] = useState(false);
     if (showAllPhotos) {
          return (
               <div className="absolute inset-0 bg-black text-white  min-h-screen">
                    <div className="bg-black p-8 grid gap-4">
                         <div className="flex grid grid-cols-[2fr_1fr]">
                              <h2 className="text-3xl =">
                                   Photos of {place.title}
                              </h2>
                              <button
                                   onClick={() => setshowAllPhotos(false)}
                                   className="item-center fixed right-12 top-8 flex gap-2 py-2 px-4 rounded-2xl shadow shadow-black bg-white text-black font-semibold"
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
                                             d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                                        />
                                   </svg>
                                   Back
                              </button>
                         </div>

                         {place?.addedPhotos?.length > 0 &&
                              place.addedPhotos.map((photo) => (
                                   <div>
                                        <Image src={photo} alt="" />
                                   </div>
                              ))}
                    </div>
               </div>
          );
     }
     return (
          <div className="relative">
               <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-2xl overflow-hidden">
                    <div>
                         {place.addedPhotos?.[0] && (
                              <div>
                                   <Image
                                        onClick={() => setshowAllPhotos(true)}
                                        className="cursor-pointer aspect-square object-cover"
                                        src={place.addedPhotos[0]}
                                        alt=""
                                   />
                              </div>
                         )}
                    </div>
                    <div className="grid">
                         <div>
                              {place.addedPhotos?.[1] && (
                                   <Image
                                        onClick={() => setshowAllPhotos(true)}
                                        className="cursor-pointer aspect-square object-cover"
                                        src={place.addedPhotos[1]}
                                        alt=""
                                   />
                              )}
                         </div>
                         <div>
                              <div className=" overflow-hidden">
                                   {place.addedPhotos?.[2] && (
                                        <Image
                                             onClick={() =>
                                                  setshowAllPhotos(true)
                                             }
                                             className="cursor-pointer aspect-square object-cover relative top-2"
                                             src={place.addedPhotos[2]}
                                             alt="s"
                                        />
                                   )}
                              </div>
                         </div>
                    </div>
               </div>

               <button
                    onClick={() => setshowAllPhotos(true)}
                    className="cursor-pointer flex items-center gap-1 absolute bottom-2 right-2 py-1.5 px-2 bg-white rounded-xl shadow shadow-md shadow-gray-500 bg-opacity-70"
               >
                    <More />
                    <span className="font-semibold">Show all photos</span>
               </button>
          </div>
     );
}
