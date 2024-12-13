import React, { useEffect, useRef, useState } from "react";
import SearchBar from "./SearchContact";
import { RxCross2 } from "react-icons/rx";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import defaultimage from "../assets/images/default.png"
function Leftsidebar({ setIsSidebarOpen, isSidebarOpen, handleGroupId }) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userList, setuserList] = useState([]);
  const [hasmore, sethasmore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const location = useLocation();
  const containerRef = useRef(null);
  const debounceTimeout = useRef(null); // Debounce timeout ref
  const SOCKET_SERVER_URL = "https://api.ahle.chat/"
  const URL =  "https://api.ahle.chat/uploads"
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleSearch = (e) => {
    setSearch(e);
    // handleSearchContact()
  };

  // Fetch function for contacts
  const fetchContacts = async (pagenum) => {
  console.log("ok");
    
    setLoadingMore(true); // Set loading state while fetching
    try {
      const response = await axios.get(
        `${SOCKET_SERVER_URL}api/chats/users?userEmail=afaque.memon22@gmail.com&search=${search||""}&perPage=10&page=${pagenum||1}`);

      if (response) {
        const newUsers = response?.data?.users || [];
        console.log(response.data);
        
        // console.log(response);
        // console.log(newUsers);
        if (newUsers?.length === 0) {
          sethasmore(false); // No more users to load
        };
        // Update the userList with new users
        setuserList((prevChatUsers) => {
          if (search) {
            return newUsers.length > 0 ? newUsers : []; // Replace with search results
          } else {
            const uniqueUsers = newUsers.filter(
              (newUser) =>
                !prevChatUsers.some((user) => user?._id === newUser._id)
            );
            return [...prevChatUsers, ...uniqueUsers];
          }
        });
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoadingMore(false); // Set loading state to false once data is fetched
    }
  };
  useEffect(()=>{
    setTimeout(() => {
      fetchContacts()
    }, 1000);
  },[search])
  // Handle scroll to trigger next page fetch
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (
      scrollTop + clientHeight >= scrollHeight - 50 && // Trigger 50px before the bottom
      !loadingMore && // Don't trigger if already loading
      hasmore // Only trigger if there's more data to load
    ) {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current); // Clear previous debounce

      debounceTimeout.current = setTimeout(() => {
        setLoadingMore(true); // Set loading state
        setCurrentPage((prevPage) => prevPage + 1); // Increment page number for next fetch
      }, 200); // Debounce time to avoid rapid consecutive triggers
    }
  };

  // Effect to fetch data when page number changes
  useEffect(() => {
    if (currentPage > 1 && hasmore) {
      fetchContacts(currentPage);
    }
  }, [currentPage]);
  useEffect(() => {
    if (location?.pathname) {
      fetchContacts(currentPage);
    }
  }, [location?.pathname]);

  // Attach scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll); // Add scroll listener
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll); // Clean up scroll listener
      }
    };
  }, [hasmore, loadingMore]);
  return (
    <div className="py-5">
      <div className="block flex justify-end mb-5 me-2 md:hidden">
        {isSidebarOpen && (
          <RxCross2
            className="text-[#19335F] font-bold w-[25px] h-[25px] p-1 rounded-full bg-white cursor-pointer"
            onClick={toggleSidebar} // Close the sidebar
          />
        )}
      </div>
      <SearchBar SearchValue={handleSearch} />
      <div
        ref={containerRef}
        className="scrollpagination my-4 max-h-[400px] overflow-y-auto" // Adjust height and overflow
      >
        {userList.length > 0 ? (
          userList.map((contact, index) => (
            <div
              key={contact._id || index} // Unique key, fallback to index if needed
              className={`flex items-center justify-between py-2 px-3 ${selectedUserId == contact?._id? 'bg-[#19335F] text-white':"bg-none text-white"} border-b border-gray-200 cursor-pointer mb-1`}
              onClick={() => {
                setSelectedUserId(contact?._id)
                handleGroupId(contact._id, contact.accessKey ? true : false, contact?.otherUserName)}
              }
            >
              {console.log(contact?.otherUserImage  || "defaultimage")    }
              <div className="flex">
                <img
                  // src={`${URL}/uploads/${contact?.images || ''}` || defaultimage}
                  src={contact?.otherUserImage  || defaultimage}
                  className="w-10 h-10 rounded-full mr-3"
                  style={{ border: "1px solid white" }}
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop in case default image is also not found
                    e.target.src = defaultimage; // Set to default image
                  }}
                />
                <div>
                  <p className="text-sm font-medium font-Cairo">
                    {contact?.otherUserName || "Unknown"}
                  </p>
                  <p className={`${selectedUserId == contact?._id? 'text-white':" text-gray-800"} text-[10px]`}> {contact?.lastMessage?.length>15? contact?.lastMessage?.slice(0, 15) + "...":contact?.lastMessage}</p>
                </div>
              </div>
              {
                contact?.seen === false ? (
                  <span className="h-[10px] w-[10px] bg-[#B69B30] rounded-full mr-2"
                    
                  ></span>
                ) : ''
              }

            </div>
          ))
        ) : (
          <div className="text-center">No contacts found</div> // Show message if no contacts
        )}
        {loadingMore && <div className="text-center py-4">Loading more...</div>}{" "}
        {/* Loading state */}
      </div>
    </div>
  );
}

export default Leftsidebar;
