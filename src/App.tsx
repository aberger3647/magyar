import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import { Nav, Home, Conjugator } from "./components";
import { QuizPrefsForm } from "./components/QuizPrefsForm";
import { Blog } from "./components/Blog";
import { FlashCard } from "./components/FlashCard";
import { Grammar } from "./components/Grammar";
import { Phrasebook } from "./components/Phrasebook";
import { CreateFlashCard } from "./components/CreateFlashCard";

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
              <Route path="/flash-cards" element={<FlashCard />} />
              <Route path="/flash-cards/create" element={<CreateFlashCard />} />
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
