import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import { Nav, Home, Conjugator } from "./components";
import "./App.css";

function Layout() {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/conjugator" element={<Conjugator />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
