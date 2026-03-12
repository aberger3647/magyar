import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <section className="mx-auto mt-12 flex w-full max-w-2xl flex-col items-center rounded-xl border border-border bg-card p-8 text-center shadow-sm">
      <p className="text-sm font-semibold tracking-wide text-muted-foreground">404</p>
      <h1 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">
        Az oldal nem található
      </h1>
      <p className="mt-1 text-xs text-muted-foreground">
        This page could not be found.
      </p>

      <p className="mt-6 max-w-xl text-base text-foreground">
        Úgy tűnik, rossz helyre tévedtél. Menj vissza a kezdőoldalra, és
        folytasd a tanulást.
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Looks like you took a wrong turn. Go back home and keep learning.
      </p>

      <Link
        to="/"
        className="mt-8 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Vissza a kezdőoldalra
      </Link>
      <p className="mt-1 text-xs text-muted-foreground">Back to home</p>
    </section>
  );
};
