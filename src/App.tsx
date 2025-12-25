import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import { Nav, Home, Conjugator } from "./components";
import { QuizPrefsForm } from "./components/QuizPrefsForm";
import { useState } from "react";
import type { TenseType } from "./components/types";
import type { VoiceType } from "./components/types";

function Layout() {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}

function App() {
  const [tense, setTense] = useState<TenseType>("present");
  const [voice, setVoice] = useState<VoiceType>("definite");
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route
              path="/conjugator"
              element={<Conjugator tense={tense} voice={voice} />}
            />
            <Route
              path="/conjugator/:tense/:voice/"
              element={
                <QuizPrefsForm setTense={setTense} setVoice={setVoice} />
              }
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
