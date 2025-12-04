import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import {
  Home
} from "./components"
import './App.css'

function Layout() {
  return (
    <>
      {/* <Nav /> */}
      <Outlet />
      {/* <Footer /> */}
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
            {/* <Route path="/footer" element={<Footer />} /> */}
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
