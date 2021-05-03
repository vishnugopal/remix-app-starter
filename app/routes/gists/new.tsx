import React from "react";
import { Form, redirect, usePendingFormSubmit } from "remix";

import type { ActionFunction, LinksFunction } from "remix";

import styles from "../../styles/gists.new.css";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export let action: ActionFunction = async ({ request }) => {
  let token = process.env.GITHUB_TOKEN;
  // in a real world scenario you'd want this token to be an enviornment
  // variable on your server, but as long as you only use it in this action, it
  // won't get included in the browser bundle.

  // get the form body out of the request using standard web APIs on the server
  let body = new URLSearchParams(await request.text());

  // pull off what we need from the form, note they are named the same thing
  // as the `<input/>` in the form.
  let fileName = body.get("fileName") || "";
  let content = body.get("content");

  // Hit the GitHub API to create a gist
  await fetch("https://api.github.com/gists", {
    method: "post",
    body: JSON.stringify({
      description: "Created from Remix Form!",
      public: true,
      files: { [fileName]: { content } },
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${token}`,
    },
  });

  // you always have to redirect from actions
  return redirect("/gists");
};

export default function NewGist() {
  let pendingForm = usePendingFormSubmit();

  return (
    <>
      <h2>New Gist!</h2>

      {pendingForm ? (
        <div>
          <p>
            <Loading /> Creating gist: {pendingForm.data.get("fileName")}
          </p>
        </div>
      ) : (
        <Form method="post">
          <p>
            <label>
              Gist file name:
              <br />
              <input required type="text" name="fileName" />
            </label>
          </p>
          <p>
            <label>
              Content:
              <br />
              <textarea required rows={10} name="content" />
            </label>
          </p>
          <p>
            <button type="submit">Create Gist</button>
          </p>
        </Form>
      )}
    </>
  );
}

function Loading() {
  return (
    <svg
      className="spin"
      style={{ height: "1rem" }}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}
