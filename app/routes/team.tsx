import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useRouteData } from "remix";

import type { LoaderFunction, LinksFunction } from "remix";

import styles from "../styles/team.css";

interface Member {
  id: string;
  login: string;
}

export function meta() {
  return {
    title: `Team page for reacttraining`,
    description: `View all members of reacttraining`,
  };
}

export let loader: LoaderFunction = () => {
  // you can point to whatever org you want, ofc
  return fetch("https://api.github.com/orgs/reacttraining/members");
};

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export default function Team() {
  let data = useRouteData<Member[]>();

  return (
    <div>
      <h2>Team</h2>
      <ul>
        {data.map((member) => (
          <li key={member.id}>
            <Link to={member.login}>{member.login}</Link>
          </li>
        ))}
      </ul>
      <hr />
      <Outlet />
    </div>
  );
}
