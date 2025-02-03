import React, { useEffect, useRef, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaPaperPlane } from "react-icons/fa";
import { MdAttachFile, MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { PiFilePdf } from "react-icons/pi";
import { FaImage } from "react-icons/fa6";
import io from "socket.io-client";
import { CgSpinner } from "react-icons/cg";
import axios from "axios";
import { saveAs } from "file-saver";
import { agentEmail, SOCKET_SERVER_URL } from "../Config/baseUrl";
// import DeleteModal from "../../../Components/helpers/DeleteModal";
import defaultimage from "../assets/images/default.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles
function Chatbox({
  isSidebarOpen,
  setIsSidebarOpen,
  groupIds,
  accessKey,
  ContactName,
  userImage,
}) {
  // const toast = useToast();
  const fileInputRef = useRef(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState();
  const [selectedFileType, setSelectedFileType] = useState();
  const [chatHistory, setChatHistory] = useState([]);
  const [socket, setSocket] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 0 });
  const [time, setTime] = useState(() => {
    const currentDate = new Date();
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  });
  const [errors, seterror] = useState("");
  const navigate = useNavigate();

  // const SOCKET_SERVER_URL = `http://192.168.18.200:4001`;
  const SOCKET_SERVER_URL = "https://chat.healthytrybe.com";
  const lastMessageRef = useRef(null);
  const chatContainerRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const fetchChatHistory = async (condition) => {
    if (!groupIds) {
      return;
    }
    const url = `${SOCKET_SERVER_URL}/api/chats/history?otherUserEmail=${groupIds}&userEmail=${agentEmail}&page=${pagination?.page}&perPage=10`;

    try {
      const res = await axios.get(url);
      if (!condition) {
        setChatHistory((prevHistory) => [...prevHistory, ...res.data.messages]);
        setPagination({ ...pagination, totalPages: res.data.totalPages });
      } else {
        setChatHistory(res.data.messages);
        setPagination({ ...pagination, totalPages: res.data.totalPages });
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while fetching chat history.";
      console.error("Error fetching chat history:", errorMessage);
      seterror(errorMessage);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file); // Use 'file' directly, not 'selectedFile'
    setCreateLoading(true);

    try {
      const response = await axios.post(
        "https://chat.healthytrybe.com//api/chats/upload", // Fixed URL
        formData, // Correctly send FormData
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure correct content type
          },
        }
      );

      const updatedUrl = response.data.url.replace(
        "https://api.ahle.chat/uploads/",
        "https://chat.healthytrybe.com/uploads/"
      );
      console.log(updatedUrl, "Upload Response");
      if (updatedUrl) {
        console.log(updatedUrl, "Upload Response123123123");
        handleSendMessage(updatedUrl, file.type);
      }
    } catch (error) {
      console.error("Image upload failed:", error);

      toast({
        title: "Image Upload Failed!",
        description: "Please try uploading the image again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setCreateLoading(false);
    }
  };

  const fetchWithTimeout = async (url, timeout = 10000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, { signal: controller.signal });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error("File not found or server error");

      return response;
    } catch (error) {
      console.error("Download failed:", error.message);
      return null;
    }
  };

  const downloadFile = async (fileUrl, fileType) => {
    if (!fileUrl) return;

    // Replace the base URL
    const updatedFileUrl = fileUrl.replace(
      "https://api.ahle.chat/uploads/",
      "https://chat.healthytrybe.com/uploads/"
    );

    console.log("Checking file availability...");

    const fileResponse = await fetchWithTimeout(updatedFileUrl);

    if (!fileResponse) {
      console.error("File download declined: Request timed out or failed.");
      alert(
        "Download failed: The file is not available or the request timed out."
      );
      return;
    }

    // Check if it's an image or PDF
    if (fileType.startsWith("image")) {
      console.log("Downloading image...");
      saveAs(updatedFileUrl, "image.jpg"); // Download image
    } else if (fileType === "application/pdf") {
      console.log("Downloading PDF...");
      saveAs(updatedFileUrl, "document.pdf"); // Download PDF
    } else {
      console.log("Downloading file...");
      saveAs(updatedFileUrl, "file"); // Download other file types
    }
  };

  useEffect(() => {
    fetchChatHistory(true);
  }, [SOCKET_SERVER_URL, groupIds]);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected");
      const joinData = { email: agentEmail || groupIds };
      newSocket.emit("joinRoom", joinData);
    });

    // Listen for new messages
    newSocket.on("newMsg", (message) => {
      console.log("New message received:", message);
      setChatHistory((prevMessages) => [...prevMessages, message]);
    });

    newSocket.on("error", (message) => {
      console.log("New message received:", message);
      alert(message);
    });

    // fetchChatHistory();

    return () => {
      newSocket.close();
    };
  }, [SOCKET_SERVER_URL, groupIds]);

  const handleSendMessage = (fileUrl, fileType) => {
    if (newMessage || fileUrl) {
      let messageData = {
        senderEmail: agentEmail,
        senderName: "Agent",
        receiverEmail: groupIds,
        receiverName: ContactName,
        messageContent: newMessage,
        senderAccessKey: "100",
        receiverAccessKey: accessKey,
        senderImage: "",
        receiverImage: "",
        file: fileUrl || "",
        fileType: fileType || "",
        filePath: "",
      };
      socket.emit("sendMessage", messageData);
      formatMessageDate(new Date());
      fetchChatHistory()
      setNewMessage(""); // Clear the message input
    }
  };
  const formatMessageDate = (messageDate) => {
    // Ensure messageDate is a valid Date object
    if (!(messageDate instanceof Date) || isNaN(messageDate.getTime())) {
      return "Recent Message"; // Or return a default message like "Invalid date" if you prefer
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString(); // Show the actual date if it's older than yesterday
    }
  };
  function extractTimeFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");

    // Determine AM or PM suffix
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert 24-hour format to 12-hour format
    hours = hours % 12 || 12; // Convert '0' to '12' for midnight

    return `${hours}:${minutes} ${ampm}`;
  }
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleScroll = () => {
    const container = chatContainerRef.current;

    if (container.scrollTop === 0 && pagination.totalPages > pagination.page) {
      setPagination({ ...pagination, page: pagination.page++ });
      console.log("Checkfirst", pagination);
      fetchChatHistory();
    }
  };

  return (
    <div className="w-full ">
      <ToastContainer autoClose={3000} />
      <div className="flex justify-between items-center border-b-2 p-3 border-gray-200">
        <div className="flex-shrink-0">
          {!isSidebarOpen && (
            <>
              <img
                src={userImage || defaultimage}
                className="w-10 rounded-full mr-3"
                style={{ border: "1px solid white" }}
                // onError={(e) => {
                //   e.target.onerror = null;
                //   e.target.src = defaultimage;
                // }}
              />
              <RxHamburgerMenu
                className="block sm:hidden text-[#19335F] w-[35px] rounded-full cursor-pointer"
                onClick={toggleSidebar}
              />
            </>
          )}
        </div>

        {isSidebarOpen && groupIds ? (
          <div
            className={`flex-grow flex ${
              isSidebarOpen ? "text-start" : "text-center"
            }`}
          >
            <img
              src={userImage || defaultimage}
              className="w-10 rounded-full mr-3"
              style={{ border: "1px solid white" }}
              // onError={(e) => {
              //   e.target.onerror = null;
              //   e.target.src = defaultimage;
              // }}
            />
            <p className="text-white font-bold text-[25px] font-Cairo">
              {ContactName ? ContactName : "Unknown"}
            </p>
          </div>
        ) : (
          <p className="text-white flex-grow ml-2 font-bold text-start text-[25px] f-left font-Cairo">
            Hello Agent!
          </p>
        )}
      </div>
      <div className="flex flex-col space-y-4 mb-4 max-h-[570px] overflow-y-auto py-5 px-3">
        {groupIds ? (
          <>
            {chatHistory && chatHistory?.length > 0 ? (
              <div
                ref={chatContainerRef}
                onScroll={handleScroll}
                className="flex flex-col flex-grow overflow-y-auto max-h-[97%] thin-scrollbar no-scrollbar-arrows"
              >
                {chatHistory?.map((msg, index) => {
                  const messageDate = new Date(msg?.timestamp);
                  const formattedMessageDate = formatMessageDate(messageDate);

                  const prevMsgDate =
                    index > 0
                      ? new Date(chatHistory[index - 1]?.timestamp)
                      : null;
                  const isDifferentDay =
                    prevMsgDate &&
                    messageDate.toDateString() !== prevMsgDate.toDateString();

                  return (
                    <div key={index}>
                      {/* Display Date Header */}
                      {index === 0 || isDifferentDay ? (
                        <div className="flex justify-center my-8">
                          <h6 className="p-1 rounded-md text-white">
                            {formattedMessageDate}
                          </h6>
                        </div>
                      ) : null}

                      {/* Message Bubble */}
                      <div
                        className={`flex ${
                          msg?.senderEmail === agentEmail
                            ? "justify-end"
                            : "justify-start"
                        } mb-2`}
                      >
                        {/* Sender's Message */}
                        {msg?.senderEmail === agentEmail && (
                          <div className="flex items-end max-w-[70%] mr-2">
                            <div className="text-black bg-[#f7f7f7] rounded-r-xl rounded-bl-xl py-2 px-3">
                              {/* Check if there's a file */}
                              {msg?.file ? (
                                <div className="mt-2">
                                  {msg.fileType.startsWith("image") ? (
                                    <div className="flex items-center space-x-2">
                                      <img
                                        src={msg.file.replace(
                                          "https://api.ahle.chat/uploads/",
                                          "https://chat.healthytrybe.com/uploads/"
                                        )}
                                        className="w-40 h-40 rounded-lg object-cover cursor-pointer"
                                        onClick={() =>
                                          downloadFile(
                                            msg.file.replace(
                                              "https://api.ahle.chat/uploads/",
                                              "https://chat.healthytrybe.com/uploads/"
                                            ),
                                            msg.fileType
                                          )
                                        }
                                      />
                                    </div>
                                  ) : msg.fileType === "application/pdf" ? (
                                    <div className="flex items-center space-x-2 cursor-pointer">
                                      <PiFilePdf size="30" />
                                      <p
                                        className="text-white-500"
                                        onClick={() =>
                                          downloadFile(msg.file, msg.fileType)
                                        }
                                      >
                                        Download PDF
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="text-xs text-white-500">
                                      {msg.file || "File attachment"}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-sm">{msg?.message}</div>
                              )}
                            </div>
                            <div
                              className="text-xs text-[#CDD1ce] mr-2 mx-2 mb-5"
                              style={{ textAlign: "end" }}
                            >
                              {msg?.timestamp
                                ? extractTimeFromTimestamp(msg?.timestamp)
                                : ""}
                            </div>
                          </div>
                        )}

                        {/* Receiver's Message */}
                        {msg?.senderEmail !== agentEmail && (
                          <div className="flex items-start max-w-[70%] ml-2">
                            <div className="text-[white] bg-[#0496ff] rounded-l-xl rounded-br-xl py-2 px-2">
                              {/* Check if there's a file */}
                              {msg?.file ? (
                                <div className="mt-2">
                                  {msg.fileType.startsWith("image") ? (
                                    <div className="flex items-center space-x-2">
                                      <img
                                        src={msg.file.replace(
                                          "https://api.ahle.chat/uploads/",
                                          "https://chat.healthytrybe.com/uploads/"
                                        )}
                                        className="w-40 h-40 rounded-lg object-cover cursor-pointer"
                                        onClick={() =>
                                          downloadFile(
                                            msg.file.replace(
                                              "https://api.ahle.chat/uploads/",
                                              "https://chat.healthytrybe.com/uploads/"
                                            ),
                                            msg.fileType
                                          )
                                        }
                                      />
                                    </div>
                                  ) : msg.fileType === "application/pdf" ? (
                                    <div className="flex items-center space-x-2 cursor-pointer">
                                      <PiFilePdf size="30" />
                                      <p
                                        className="text-white-500"
                                        onClick={() =>
                                          downloadFile(msg.file, msg.fileType)
                                        }
                                      >
                                        Download PDF
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="text-xs text-white-500">
                                      {msg.file || "File attachment"}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-sm">{msg?.message}</div>
                              )}
                            </div>
                            <div
                              className="text-xs text-[#CDD1ce] ml-2"
                              style={{ textAlign: "start" }}
                            >
                              {msg?.timestamp
                                ? extractTimeFromTimestamp(msg?.timestamp)
                                : ""}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-white text-lg">No Message Found</p>
              </div>
            )}

            {/* Message Input */}
            <div className="flex justify-between items-center p-4 bg-[#323234] absolute rounded-[10px] bottom-0 w-[98%]">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow px-4 py-2 rounded-l-lg border bg-white text-black border-gray-300 focus:outline-none"
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
              />
              <div className="flex flex-col items-start space-y-2">
                {/* Attach Button */}
                {/* <MdAttachFile
                  size={42}
                  className="p-2 bg-white text-black cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
                /> */}
                {createLoading ? (
                  <CgSpinner
                    className="animate-spin text-gray-500 "
                    size={42}
                  />
                ) : (
                  <MdAttachFile
                    size={42}
                    className="p-2 bg-white text-black cursor-pointer"
                    onClick={() => fileInputRef.current.click()}
                  />
                )}

                {/* Hidden File Input */}
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, application/pdf"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />

                {/* Preview Selected File */}
              </div>
              <button
                onClick={handleSendMessage}
                className="flex items-center justify-center px-4 pt-[0.8rem] pb-[0.8rem] text-white rounded-r-lg bg-white transition"
              >
                <FaPaperPlane className="text-blue-500" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-screen">
            <p className="text-white text-lg">Let's Start Chat</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chatbox;
