import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Agentchat from "../Pages/Chatlayout";
import Chatlayout from "../Pages/Chatlayout";
import Chat from "../Pages/Chat";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/chat",
    element: <Chatlayout></Chatlayout>,
    children: [
      {
        path: "/chat",
        element: <Chat/>,
      },
      // {
      //   path: "/chat/creategroupchat",
      //   element: <Groupchat />,
      // },
      // {
      //   path: "/chat/updategroupchat/:name",
      //   element: <Groupchat />,
      // },
    ],
  },
]);
export default Router;
