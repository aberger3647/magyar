import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import { Nav, Home, Conjugator } from "./components";
import { QuizPrefsForm } from "./components/QuizPrefsForm";
import { Blog } from "./components/Blog";
import { FlashCards } from "./components/FlashCards";
import { Grammar } from "./components/Grammar";
import { Phrasebook } from "./components/Phrasebook";

function Layout() {
  return (
    <>
      <Nav />
        <main className="flex flex-col items-center gap-4 p-4">
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
             <Route path="/" element={<Home />} />
              <Route path="/flash-cards" element={<FlashCards />} />
               <Route path="/grammar" element={<Grammar />} />
                <Route path="/phrasebook" element={<Phrasebook />} />
                 <Route path="/blog" element={<Blog />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
