import { useState } from "react";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function App() {

  const [page, setPage] = useState("landing");

  if (page === "login") return <Login setPage={setPage} />;
  if (page === "signup") return <Signup setPage={setPage} />;
  if (page === "dashboard") return <Dashboard />;

  return <Landing setPage={setPage} />;
}

export default App;