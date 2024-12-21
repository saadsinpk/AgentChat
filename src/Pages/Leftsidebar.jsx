import React, { useEffect, useRef, useState } from "react";
import SearchBar from "./SearchContact";
import { RxCross2 } from "react-icons/rx";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import defaultimage from "../assets/images/default.png";
import { agentEmail, SOCKET_SERVER_URL } from "../Config/baseUrl";
function Leftsidebar({
  userImage,
  setIsSidebarOpen,
  isSidebarOpen,
  handleGroupId,
}) {
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleSearch = (e) => {
    setSearch(e);
    // handleSearchContact()
  };

  // Fetch function for contacts
  const fetchContacts = async (pagenum) => {
    setLoadingMore(true); // Set loading state while fetching
    try {
      const response = await axios.get(
        `${SOCKET_SERVER_URL}/api/chats/users?userEmail=${agentEmail}&role=agent&search=${
          search || ""
        }&perPage=10&page=${pagenum || 1}`
      );

      if (response) {
        const newUsers = response?.data?.users || [];
        if (newUsers.length === 0) {
          sethasmore(false); // No more users to load
        }
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
  useEffect(() => {
    setTimeout(() => {
      fetchContacts();
    }, 1000);
  }, [search]);
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
            // <div
            //   key={contact._id || index} // Unique key, fallback to index if needed
            //   className={`flex items-center justify-between py-2 px-3 ${selectedUserId == contact?._id? 'bg-[#19335F] text-white':"bg-none text-white"} border-b border-gray-200 cursor-pointer mb-1`}
            //   onClick={() => {
            //     setSelectedUserId(contact?._id)
            //     handleGroupId(contact._id, contact.receiverAccessKey, contact?.otherUserName, contact?.otherUserImage)}
            //   }
            // >
            //   <div className="flex">
            //     <img
            //       // src={`${URL}/uploads/${contact?.images || ''}` || defaultimage}
            //       src={userImage  || defaultimage}
            //       className="w-10 h-10 rounded-full mr-3"
            //       style={{ border: "1px solid white" }}
            //       onError={(e) => {
            //         e.target.onerror = null; // Prevent infinite loop in case default image is also not found
            //         e.target.src = defaultimage; // Set to default image
            //       }}
            //     />
            //     <div>
            //       <p className="text-sm font-medium font-Cairo">
            //         {contact?.otherUserName || "Unknown"}
            //       </p>
            //       <p className={`${selectedUserId == contact?._id? 'text-white':" text-gray-800"} text-white text-[10px]`}> {contact?.lastMessageContent?.length>15? contact?.lastMessageContent?.slice(0, 15) + "...":contact?.lastMessageContent}</p>
            //     </div>
            //   </div>
            //   {
            //     contact?.seen === false ? (
            //       <span className="h-[10px] w-[10px] bg-white rounded-full mr-2"
            //       ></span>
            //     ) : ''
            //   }

            // </div>
            <div
              key={contact._id || index}
              className={`flex items-center justify-between py-3 px-4 rounded-lg my-3 ${
                selectedUserId == contact?._id
                  ? "bg-[#0496ff] text-white"
                  : "bg-transparent hover:bg-gray-100 text-gray-800 bg-[#0496ff] text-black"
              } border border-ligthgray cursor-pointer transition duration-200 text-white hover:text-black`}
              onClick={() => {
                setSelectedUserId(contact?._id);
                handleGroupId(
                  contact._id,
                  contact.receiverAccessKey,
                  contact?.otherUserName,
                  contact?.otherUserImage
                );
              }}
            >
              <div className="flex items-center">
                <img
                  src={contact?.otherUserImage || defaultimage}
                  className="w-12 h-12 rounded-full border border-white object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultimage;
                  }}
                />
                <div className="ml-3">
                  <p className="text-base font-semibold font-Cairo truncate">
                    {contact?.otherUserName || "Unknown"}
                  </p>
                  <p
                    className={`${
                      selectedUserId == contact?._id
                        ? "text-gray-300"
                        : "text-gray-500"
                    } text-sm truncate`}
                  >
                    {contact?.lastMessageContent?.length > 20
                      ? contact?.lastMessageContent.slice(0, 20) + "..."
                      : contact?.lastMessageContent || "No recent messages"}
                  </p>
                </div>
              </div>
              {contact?.seen === false && (
                <span
                  className="h-3 w-3 bg-blue-500 rounded-full"
                  title="Unread message"
                ></span>
              )}
            </div>
          ))
        ) : (
          <div className="text-center">No contacts found</div>
        )}
        {loadingMore && <div className="text-center py-4">Loading more...</div>}{" "}
        {/* Loading state */}
      </div>
    </div>
  );
}

export default Leftsidebar;
