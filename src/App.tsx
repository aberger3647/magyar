import { useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
  useLocation,
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

const SITE_NAME = "Learn Magyar Language";
const SITE_ORIGIN = "https://magyar.alexberger.dev";

const ROUTE_TITLES: Record<string, string> = {
  "/": SITE_NAME,
  "/search": `Search · ${SITE_NAME}`,
  "/conjugator": `Conjugator Quiz · ${SITE_NAME}`,
  "/flash-cards": `Flash Cards · ${SITE_NAME}`,
  "/flash-cards/create": `Create Flash Cards · ${SITE_NAME}`,
  "/grammar": `Grammar · ${SITE_NAME}`,
  "/grammar/phonetics": `Alphabet and Pronunciation · ${SITE_NAME}`,
  "/grammar/alphabet": `Alphabet and Pronunciation · ${SITE_NAME}`,
  "/grammar/vowel-harmony": `Vowel Harmony · ${SITE_NAME}`,
  "/grammar/present-tense": `Present Tense · ${SITE_NAME}`,
  "/grammar/past-tense": `Past Tense · ${SITE_NAME}`,
  "/grammar/future-tense": `Future Tense · ${SITE_NAME}`,
  "/grammar/numbers": `Numbers · ${SITE_NAME}`,
  "/grammar/telling-time": `Telling Time · ${SITE_NAME}`,
  "/grammar/possessives": `Possessives · ${SITE_NAME}`,
  "/grammar/accusative": `Accusative Case · ${SITE_NAME}`,
  "/grammar/instrumental": `Instrumental Case · ${SITE_NAME}`,
  "/grammar/location": `Location · ${SITE_NAME}`,
  "/grammar/ik-verbs": `-ik Verbs · ${SITE_NAME}`,
  "/phrasebook": `Phrasebook · ${SITE_NAME}`,
  "/erzes": `Érzem… · ${SITE_NAME}`,
  "/blog": `Blog · ${SITE_NAME}`,
};

function getRouteTitle(pathname: string): string {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, "") : "/";
  if (ROUTE_TITLES[normalized]) return ROUTE_TITLES[normalized];
  if (normalized.startsWith("/conjugator/")) return `Conjugator Quiz · ${SITE_NAME}`;
  if (normalized.startsWith("/blog/")) return `Blog · ${SITE_NAME}`;
  return `Page not found · ${SITE_NAME}`;
}

function Layout() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    document.title = getRouteTitle(pathname);
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) {
      canonical.href = `${SITE_ORIGIN}${pathname}`;
    }
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <SearchProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
      >
        Skip to main content
      </a>
      <Nav />
      <main
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        className="flex flex-col items-center gap-4 p-4 outline-none"
      >
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
