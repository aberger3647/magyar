import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import { Nav, Home, Conjugator } from "./components";
import { QuizPrefsForm } from "./components/QuizPrefsForm";

function Layout() {
  return (
    <>
      <Nav />
        <main className="flex flex-col items-center gap-4 pb-4">
      <Outlet />
      </main>
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
            <Route
              path="/conjugator/:tense/:voice/"
              element={<Conjugator/>}
              />
            <Route
                path="/conjugator"
              element={
                <QuizPrefsForm/>
              }
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
