import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import { Nav, Home, Conjugator } from "./components";
import { QuizPrefsForm } from "./components/QuizPrefsForm";
import { Blog } from "./components/Blog";
import { BlogPost } from "./components/BlogPost";
import { FlashCard } from "./components/FlashCard";
import { Grammar } from "./components/Grammar";
import Alphabet from "./components/grammar/Alphabet";
import VowelHarmony from "./components/grammar/VowelHarmony";
import PresentTense from "./components/grammar/PresentTense";
import PastTense from "./components/grammar/PastTense";
import FutureTense from "./components/grammar/FutureTense";
import Numbers from "./components/grammar/Numbers";
import TellingTime from "./components/grammar/TellingTime";
import Possessives from "./components/grammar/Possessives";
import Accusative from "./components/grammar/Accusative";
import Instrumental from "./components/grammar/Instrumental";
import Location from "./components/grammar/Location";
import IkVerbs from "./components/grammar/IkVerbs";
import { Phrasebook } from "./components/Phrasebook";
import { Erzes } from "./components/Erzes";
import { CreateFlashCard } from "./components/CreateFlashCard";
import { NotFound } from "./components/NotFound";
import { SearchPage } from "./components/SearchPage";
import { SearchProvider } from "./components/SearchDialog";

function Layout() {
  return (
    <SearchProvider>
      <Nav />
      <main className="flex flex-col items-center gap-4 p-4">
        <Outlet />
      </main>
    </SearchProvider>
  );
}

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
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
               <Route path="/grammar/present-tense" element={<PresentTense />} />
               <Route path="/grammar/past-tense" element={<PastTense />} />
               <Route path="/grammar/future-tense" element={<FutureTense />} />
               <Route path="/grammar/numbers" element={<Numbers />} />
               <Route path="/grammar/telling-time" element={<TellingTime />} />
               <Route path="/grammar/possessives" element={<Possessives />} />
               <Route path="/grammar/accusative" element={<Accusative />} />
               <Route path="/grammar/instrumental" element={<Instrumental />} />
               <Route path="/grammar/location" element={<Location />} />
               <Route path="/grammar/ik-verbs" element={<IkVerbs />} />
                <Route path="/phrasebook" element={<Phrasebook />} />
                <Route path="/erzes" element={<Erzes />} />
                 <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                 <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
