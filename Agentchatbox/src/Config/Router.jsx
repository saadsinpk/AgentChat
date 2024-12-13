import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Agentchat from "../Pages/Agentchat";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/Agentchat",
    element: <Agentchat/>,
  },
]);
export default Router;
