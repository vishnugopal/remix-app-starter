import React from "react";
import { useRouteData } from "remix";

import type { LoaderFunction } from "remix";

// Define the Gist type
interface Gist {
  id: string;
  html_url: string;
  files: {
    [fileName: string]: {
      filename: string;
      type: string;
      language: string;
      raw_url: string;
      size: number;
    };
  };
}

export function meta({ data }: { data: Gist[] }) {
  return {
    title: "Public Gists",
    description: `View the latest ${data.length} gists from the public`,
  };
}

// The HTTP headers for the server rendered request, just use the cache control
// from the loader.
export function headers({ loaderHeaders }: { loaderHeaders: Headers }) {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control"),
  };
}

export let loader: LoaderFunction = async () => {
  let token = process.env.GITHUB_TOKEN;
  return fetch("https://api.github.com/gists", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${token}`,
    },
  });
};

export default function Gists() {
  let data = useRouteData<Gist[]>();

  return (
    <div>
      <h2>Public Gists</h2>
      <ul>
        {data.map((gist) => (
          <li key={gist.id}>
            <a href={gist.html_url}>{Object.keys(gist.files)[0]}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
