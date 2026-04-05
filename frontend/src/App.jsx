import { useState } from "react";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Cursor from "./components/Cursor";

function App() {
  const [page, setPage] = useState("landing");

  let content;
  if (page === "login") content = <Login setPage={setPage} />;
  else if (page === "signup") content = <Signup setPage={setPage} />;
  else if (page === "dashboard") content = <Dashboard />;
  else content = <Landing setPage={setPage} />;

  return (
    <>
      <Cursor />
      {content}
    </>
  );
}

export default App;