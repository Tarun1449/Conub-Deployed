import React, { useEffect, useState, useRef, CSSProperties } from 'react';
import { useParams } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import { IoMdSend } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { getMessagesService } from '../Utils/Services';
import { ToastContainer, toast } from 'react-toastify';
import { BarLoader } from 'react-spinners';
import { TiTick } from 'react-icons/ti';
import { baseUrl } from '../Utils/Apis';

const ENDPOINT = baseUrl;

const Chat = () => {
    const [loading, setLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false); // State to track loading more messages
    const [message, setMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const userId = useSelector((state) => state.email);
    const { recipientId } = useParams();
    const [chatMessages, setChatMessages] = useState([]);
    const [page, setPage] = useState(1); // Track current page of messages // Track if there are more messages to fetch
    const chatBoxRef = useRef(null);

    let [color, setColor] = useState('black');
    const override: CSSProperties = {
        display: 'block',
        margin: '0 auto',
        borderColor: 'red',
    };

    useEffect(() => {
        const newSocket = socketIOClient(ENDPOINT, {
            withCredentials: true, 
        });

        setSocket(newSocket);

        newSocket.emit('join', userId);

        newSocket.on('chat message', (message) => {
            console.log(message);
            console.log(recipientId)
            if(message.senderId == recipientId){
            setChatMessages((prevMessages) => [...prevMessages, message]);
            }
        });
        newSocket.on('Message-sent', (userMessage) => {
            setChatMessages((prevMessages) => [...prevMessages, userMessage]);
            setLoading(false);
        });
        newSocket.on('Message-delivered', (userMessage) => {
            setChatMessages((prevMessages) => [...prevMessages, userMessage]);
            setLoading(false);
        });
        newSocket.on('userConnected', async (userId) => {
            console.log('User Connected: ' + userId);
            fetchInitial();
        });

        return () => {
            newSocket.disconnect();
        };
    }, [userId,recipientId]);

    const fetchMessages = async (page) => {
        console.log("FetchMessage called");

        setLoading(true); // Set loading more to true
        try {
            const currentScrollPosition = chatBoxRef.current.scrollTop;
            const response = await getMessagesService(recipientId, page);
            const messageLength = response.data.messages.length;
            if(messageLength>0){
            const fetchedMessages = response.data.messages.reverse(); // Reverse array to show latest messages at the bottom
            setChatMessages((prevMessages) => [...fetchedMessages, ...prevMessages]);
            setPage(page + 1); // Increment page number
            }
            
        } catch (error) {
            toast.error('Something went wrong');
            console.error('Error fetching messages:', error);
        }
       setLoading(false) // Set loading more to false after fetching
    };
    const fetchInitial = async () => {
            
        console.log("Fetch Inital called");
        setLoading(true) // Set loading more to true
        try {
            
            const response = await getMessagesService(recipientId,1);
            const fetchedMessages = response.data.messages; 
            setChatMessages(fetchedMessages);
            setPage(page + 1); 
            console.log(response.data.messages);
            
        } catch (error) {
            toast.error('Something went wrong');
            console.error('Error fetching messages:', error);
        }
        setLoading(false) // Set loading more to false after fetching
    };
    useEffect(() => {
        fetchInitial();
    }, [recipientId]); // Fetch messages when recipientId changes

    useEffect(() => {
        // Scroll to bottom of chat box whenever chatMessages or recipientId changes
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [chatMessages, recipientId]);

    const sendMessage = async () => {
        if (socket && message.trim() !== '') {
            // Check if message is not emp
            try {
                setLoading(true);
                await socket.emit('chat message', { content: message, recipientId });
            } catch (error) {
                toast.error('Something went wrong');
            }
            setMessage(''); // Clear the message input after sending
        } else {
            toast.error('Message cannot be empty');
        }
    };

    return (
        <>
            <ToastContainer />
            <div
                className="Chat-Container"
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        height: '50px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '26px',
                        backgroundColor: 'rgb(59, 80, 132)',
                    }}
                >
                    {recipientId}
                </div>
                <div
                    className="Chat-Box"
                    ref={chatBoxRef}
                    onScroll={() => {
                        if (chatBoxRef.current.scrollTop === 0 ) {
                            const nextPage = page; // Use current page number when scrolling up
                            fetchMessages(nextPage);
                        }
                    }}
                    style={{
                        width: '100%',
                        backgroundColor: 'white',
                        height: 'calc(100% - 100px)', // Adjusted height to leave space for input bar
                        overflowY: 'auto',
                        padding: '10px',
                    }} // Add onScroll event handler
                >
                    <div style={{ position: 'fixed', marginTop: '25%', marginLeft: '27%' }}>
                        <BarLoader
                            color={color}
                            loading={loading}
                            cssOverride={override}
                            size={150}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div>
                    {/* Render chat messages in descending order by timestamp */}
        
                    {chatMessages.map((msg, index) => (
                        <div
                            key={index}
                            className={`Message ${msg.senderId === userId ? 'Sender' : 'Receiver'}`}
                            style={{
                                alignSelf: msg.senderId === userId ? 'flex-end' : 'flex-start',
                                display: 'flex',
                            }}
                        >
                            {msg.content}

                            {/* Render ticks based on message status and if the current user is the sender */}
                            {msg.senderId === userId && (
                                <>
                                    {msg.status === 'delivered' ? (
                                        <>
                                            <TiTick style={{color:'lightblue'}}/> {/* First tick for sent messages */}
                                            <TiTick style={{color:'lightblue'}}/> {/* Second tick for delivered messages */}
                                        </>
                                    ) : (
                                        <>
                                            <TiTick /> {/* Single tick for sent but not delivered messages */}
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                    
                </div>
                <div
                    style={{
                        width: '100%',
                        height: '50px',
                        backgroundColor: 'white',
                        position: 'absolute',
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        padding: '5px',
                    }}
                >
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        style={{
                            flex: 1,
                            height: '40px',
                            borderRadius: '20px',
                            paddingLeft: '10px',
                            marginRight: '10px',
                            backgroundColor: 'lightblue',
                        }}
                        placeholder="Type your message..."
                    />
                    <button
                        style={{
                            height: '40px',
                            width: '40px',
                            borderRadius: '50%',
                            backgroundColor: 'lightblue',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                        onClick={sendMessage}
                    >
                        <IoMdSend style={{ fontSize: '24px' }} />
                    </button>
                </div>
            </div>
        </>
    );
};

export default Chat;



