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
import Alphabet from "./components/grammar/Alphabet";
import VowelHarmony from "./components/grammar/VowelHarmony";
import Numbers from "./components/grammar/Numbers";
import TellingTime from "./components/grammar/TellingTime";
import Possessives from "./components/grammar/Possessives";
import Accusative from "./components/grammar/Accusative";
import IkVerbs from "./components/grammar/IkVerbs";
import { Phrasebook } from "./components/Phrasebook";
import { CreateFlashCard } from "./components/CreateFlashCard";
import { NotFound } from "./components/NotFound";

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
            <Route index element={<Home />} />
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
              <Route path="/flash-cards" element={<FlashCard />} />
              <Route path="/flash-cards/create" element={<CreateFlashCard />} />
               <Route path="/grammar" element={<Grammar />} />
               <Route path="/grammar/phonetics" element={<Alphabet />} />
               <Route path="/grammar/alphabet" element={<Alphabet />} />
               <Route path="/grammar/vowel-harmony" element={<VowelHarmony />} />
               <Route path="/grammar/numbers" element={<Numbers />} />
               <Route path="/grammar/telling-time" element={<TellingTime />} />
               <Route path="/grammar/possessives" element={<Possessives />} />
               <Route path="/grammar/accusative" element={<Accusative />} />
               <Route path="/grammar/ik-verbs" element={<IkVerbs />} />
                <Route path="/phrasebook" element={<Phrasebook />} />
                 <Route path="/blog" element={<Blog />} />
                 <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
