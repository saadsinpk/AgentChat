import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Leftsidebar from "./Leftsidebar";
import Chatbox from "./Chatbox";


function Chat() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [ContactName, setContactName] = useState(true);
  const [groupId, setGroupId] = useState("");
  const [contact, setcontact] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [userImage, setUserImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsSidebarOpen(true); 
      }
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setIsSidebarOpen]);
  const handleGroupId=(value,isaccess,contactname,image)=>{
    console.log("object",value);
    setGroupId(value)
    setUserImage(image)
    setAccessKey(isaccess)
    setContactName(contactname)
  }
  return (
    <div className="layoutbgimage w-full h-screen">
      <div className="flex">
        {/* Sidebar */}
        <div className={`transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'w-[40%] md:w-[20%]' : 'hidden'} bg-black border-r-[2px] border-white text-white h-screen overflow-y-auto`}>
          <Leftsidebar setIsSidebarOpen={setIsSidebarOpen} userImage={userImage} isSidebarOpen={isSidebarOpen} handleGroupId={handleGroupId} />
        </div>

        {/* Right side - Chatbox */}
        <div className={`transition-all duration-300 bg-black ease-in-out relative ${isSidebarOpen ? 'w-[60%] md:w-[80%]' : 'w-full'} pb-5 text-white h-screen overflow-y-auto`}>
          <Chatbox isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} ContactName={ContactName} groupIds={groupId} accessKey={accessKey}/>
        </div>
      </div>
    </div>
  );
}

export default Chat;

