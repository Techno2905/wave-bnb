import Perks from "../Perks";
import { useEffect, useState } from "react";
import PhotosUploader from "../PhotosUploader";
import axios from "axios";
import AccountNav from "../AccountNav";
import { Navigate, useParams, useNavigate } from "react-router-dom";


export default function PlacesFormPage(){
    const{id} = useParams();
    const navigate = useNavigate();

    const [title,setTitle] = useState('');
    const [address,setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [description,setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extraInfo,setExtraInfo] = useState('');
    const [checkIn,setCheckIn] = useState('');
    const [checkOut,setCheckOut] = useState('');
    const [maxGuests,setMaxGuests] = useState(1);
    const [price,setPrice] = useState(100);
    const [redirect,setRedirect] = useState(null); 

    useEffect(()=>{
    if(!id){
        return;
    }
    axios.get('/places/'+id).then(response =>{
        const {data}=response;
        console.log({data});
        setTitle(data.title);
        setAddress(data.address);
        setAddedPhotos(data.addedPhotos);
        setDescription(data.description);
        setPerks(data.perks);
        setExtraInfo(data.extraInfo);
        setCheckIn(data.checkIn);
        setCheckOut(data.checkOut);
        setMaxGuests(data.maxGuests);
        setPrice(data.price);
    });

    },[id]);

    function inputHeader(text){
        return(
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }
    function inputDescription(text){
        return(
            <h2 className="text-gray-500 text-sm">{text}</h2>
        );
    }
    function preInput(header,description){
        return(
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        )
    }
    async function savePlace(ev){
        ev.preventDefault();
        const placeVar={
            title, address, 
            addedPhotos, 
            description, perks, 
            extraInfo, checkIn, 
            checkOut, maxGuests, price
        };
        if(id){
            console.log({placeVar});
            await axios.put('/places',{
                id, ...placeVar
            });
            setRedirect('/account/places');  
            console.log('redirect');
            
        }
        else {
            await axios.post('/places', placeVar);
            setRedirect('/account/places'); 
            console.log('redirect');
             
        }  
        navigate("/account/places");
    }
    console.log(redirect);
    if(redirect){
        return <Navigate to={redirect}/>
    }

    return(
        
        <>
            <div>
                    <AccountNav/>
                    <form onSubmit={savePlace}>
                        {preInput('Title','Title for your accomodation. Should be short and catchy')}
                        <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="Title of your Accomoadation " />
                        {preInput('Address','Address of your accomodation')}
                        <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="Address"/>
                        {preInput('Photos','More photos the better!')}
                        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>
                        {preInput('Description','Description of your accomodation')}
                        <textarea value={description} onChange={ev => setDescription(ev.target.value)}/>
                        {preInput('Perks','Select perks of your accomodation')}
                        <div className='grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6'>
                            <Perks selected={perks} on onChange={setPerks}/>    
                        </div>
                        {preInput('Extra info','Include info like house rules, nearby location, etc. here')}
                        <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)}/>
                        {preInput('Check-in and Check-out times','Add check in and check-out times (remember to have some time window for cleaning between guests)')}
                        <div className="grid gap-2 sm:grid-cols-3">
                            <div>
                                <h3 className="mt-2 -mb-1">Check-in time</h3>
                                <input type="text" value={checkIn} onChange={ev => setCheckIn(ev.target.value)} placeholder="12:00"/>
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1">Check-out time</h3>
                                <input type="text" value={checkOut} onChange={ev => setCheckOut(ev.target.value)} placeholder="10:00"/>
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1">Max number of guests</h3>
                                <input type="number" value={maxGuests} onChange={ev => setMaxGuests(ev.target.value)}/>
                            </div>
                            
                        </div>
                        {preInput('Price per night ','in ₹ Rupee ')}
                        <div>
                                <input type="number" value={price} onChange={ev => setPrice(ev.target.value)}/>
                        </div>
                        <div>
                            <button className="primary my-4">Save</button>
                        </div>
                    </form> 
                </div>
        </>
    );
}