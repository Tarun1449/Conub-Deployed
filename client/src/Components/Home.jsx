import React, { useState, useEffect } from 'react';
import { SearchService, addfriendService, getFriendsService } from '../Utils/Services';
import { MdCancel } from "react-icons/md";
import { IoMdPersonAdd } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import Chat from './Chat';
import { Route, Link, Routes, useParams } from 'react-router-dom'; // Import necessary components from react-router-dom

const Home = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null); // State for the selected item
    const [friends, setFriends] = useState([]);
    const recepientId = useParams();
    const handleSearch = async (e) => {
        const inputValue = e.target.value; // Store the input value
        setQuery(inputValue); // Update the query state with the input value
        
        try {
            const response = await SearchService(inputValue); // Fetch data from backend    
            setResults(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    
    const handleRemove = () => {
        setResults([]); // Clear results array
        setQuery(''); // Clear query input
    };
    
    const handleAddFriend = async (item) => {
        try {
            const response = await addfriendService(item);
            if (response.status === 200) {
                toast.success(response.data.message);
                setSelectedItem(item); // Set the selected item for overlay
                handleFriends(); // Refresh friends list after adding a friend
            }
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
        }
    };
    
    const handleFriends = async () => {
        try {
            const response = await getFriendsService();
            setFriends(response.data.friends);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleFriends();
    }, []);
    
    return (
        <>
            <ToastContainer />
            <div style={{ borderRadius: "40px", backgroundColor: "lightblue", display: 'flex', height: "86%", marginTop: "10px", marginLeft: "5%", marginRight: "5%" }}>
                <div style={{ width: "30%", height: "100%" }}>
                    <div style={{ display: "flex", justifyContent: 'center' }}>
                        <div>
                            <input
                                value={query}
                                onChange={handleSearch}
                                style={{ width: "200px", marginTop: "10px", height: "40px", borderRadius: "20px", textAlign: "center" }}
                                type='text'
                                placeholder='Search Users'
                            />
                        </div>
                        <button onClick={handleRemove}>
                            <MdCancel style={{ marginTop: "10px", color: "#001F3F", fontSize: 40 }} />
                        </button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                        {/* Display search results */}
                        {results.length > 0 ? (
                            results.map(item => (
                                <div key={item.id} style={{ width: "200px", height: "40px", textAlign: "center", display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
                                    
                                    <p 
                                    >{item}
                                    </p> 
                                    <button onClick={() => handleAddFriend(item)}>
                                        <IoMdPersonAdd />
                                    </button>
                                </div>
                            ))
                        ) : null /* No icon shown when results.length === 0 */}
                    </div>
                    <div style={{marginTop:'10px',display:"flex",flexDirection:'column',width:"100% "}}>
                    {friends.map(item=>(
                        <div key={item} style={{
                            marginTop:"5%",
                            marginLeft:"5%",
                            marginRight:"5%",
                            borderRadius:"20px",
                            backgroundColor:"#FFC107",
                            width: "9   0%",
                            height: "40px",
                            display: 'flex',
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "20px"
                        }}>
                            <Link to={`/chat/${item}`}>
                            
                            {item}</Link> {/* Link to each friend's chat */}
                        </div>
                    ))}
                    </div>
                </div>
                <div style={{ backgroundColor: "darkblue", borderRadius: "0px 40px 40px 0px", width: "70%" }}>
                    <div className="chat"
                    style={{
                        width:"100%",
                        height:"100%"
                    }}>
                        <Routes>
                            <Route path="/chat/:recipientId" element={<Chat/>}>
                                
                            </Route>
                        </Routes>
                    </div>
                </div>
            </div>

            {/* Overlay div to show selected item */}
            {selectedItem && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    padding: '20px',
                    borderRadius: '10px',
                    zIndex: '1000', // Ensure it's above other content
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                }}>
                    <h2>Selected Item</h2>
                    <p>{selectedItem}</p>
                    <button onClick={() => setSelectedItem(null)}>Close</button>
                </div>
            )}
        </>
    );
};

export default Home;
