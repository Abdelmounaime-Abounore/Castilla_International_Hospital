import axios from 'axios';
import React from 'react';
import { useQuery } from 'react-query';

const fetchMedecins = async () => {
    const roleName = "medecin"
    const response = await axios.get(`http://localhost:3000/user/role/${roleName}`);
    return response.data;
};

const DoctorsList = () => {
    const { data, isLoading, isError } = useQuery('medecins', fetchMedecins);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching data</div>;
    return (
        <section className="">
            <div className="">
                <div className='flex justify-end' style={{width: "99%"}}>
                    <div className=' py-7 flex justify-between w-4/5'>
                        <div>
                            <form className="flex items-center max-w-sm mx-auto">
                                <label className="sr-only">Search</label>
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2" />
                                        </svg>
                                    </div>
                                    <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search a doctor" required />
                                </div>
                                <button type="submit" className="p-2.5 ms-2 text-sm font-medium text-white bg-purple-800 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                    <span className="sr-only">Search</span>
                                </button>
                            </form>
                        </div>
                        <button className="bg-purple-800 hover:bg-blue-800 text-white rounded-md px-4 py-2">
                            Ajouter une spécialisation
                        </button>
                    </div>
                </div>
            </div>
            <div className="">
                <div className="medecin-list-container flex justify-end" style={{width: "99%"}}>
                    <div className="py-7 w-4/5">
                        <div className="flex flex-wrap -mx-2">
                            {data && data.map((medecin) => (
                                <div key={medecin._id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 px-2 py-2">
                                    <div className="bg-white p-4 shadow-md">
                                        <img src={medecin.image} alt={medecin.name} className="w-full" />
                                        <div>
                                            <h3 className="text-xl font-semibold">{medecin.name}</h3>
                                            <p>Phone: {medecin.phoneNumber}</p>
                                            {/* <p>Speciality: {medecin.specialityId.name}</p> */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DoctorsList;