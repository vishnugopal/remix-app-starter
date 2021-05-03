import type { LinksFunction, LoaderFunction } from "remix";
import {
  Meta,
  Links,
  Scripts,
  useRouteData,
  LiveReload,
  usePendingLocation,
} from "remix";
import { Outlet, Link } from "react-router-dom";

import stylesUrl from "./styles/global.css";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export let loader: LoaderFunction = async () => {
  return { date: new Date() };
};

function Document({ children }: { children: React.ReactNode }) {
  let pendingLocation = usePendingLocation();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <Meta />
        <Links />
      </head>
      <body
        style={{
          opacity: !!pendingLocation ? "0.15" : "1",
          transition: "opacity 500ms ease-in-out",
          transitionDelay: "100ms",
        }}
      >
        <Link to="/gists">Gists</Link> | <Link to="/team">Team</Link> |{" "}
        <Link to="/gists/new">New Gist</Link>
        {children}
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

export default function App() {
  let data = useRouteData();
  return (
    <Document>
      <Outlet />
      <footer>
        <p>This page was rendered at {data.date.toLocaleString()}</p>
      </footer>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document>
      <h1>App Error</h1>
      <pre>{error.message}</pre>
      <p>
        Replace this UI with what you want users to see when your app throws
        uncaught errors.
      </p>
    </Document>
  );
}
