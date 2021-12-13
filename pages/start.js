// When logged in redirect a player to here
// This is where you pick a team & enter your manager name
// click start game which hits the api to generate a save
import React from "react";
import { useQuery } from "react-query";
import { getSession } from "next-auth/react";

async function LoadTeams() {
  const res = await fetch("/api/start/teams");
  return res.json();
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        statusCode: 302,
      },
    };
  }

  return {
    props: {
      user: session.user || null,
    },
  };
}


export default function Start() {
  const [name, setName] = React.useState("Ted Lasso");
  const [loading, setLoading] = React.useState(false);
  const [team, setTeam] = React.useState("");

  const { data, status } = useQuery("loadteams", LoadTeams);

  async function choose() {
    setLoading(true);
    if (!name || !team || name.legnth > 0) {
      alert("Please select a team or check you have entered a name!");
    } else {
      await fetch("/api/start/generate-save", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          team,
        }),
      });
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 mt-16 sm:px-6 md:px-8">
      {status === "loading" && <div>loading</div>}

      {status === "error" && <div>loading</div>}

      {status === "success" && (
        <div>
          <div className="float-right">
            <button
              onClick={choose}
              type="button"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Start Game
            </button>
          </div>
          <h1>WELCOME TO CSGO MANAGER</h1>
          <h2>Choose your team wisely</h2>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Manager Name
            </label>
            <div className="mt-1">
              <input
                type="email"
                name="email"
                id="email"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Ted Lasso"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            <ul
              role="list"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              {data.teams.map((team) => (
                <li
                  key={team._id}
                  className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200"
                >
                  <div className="flex-1 flex flex-col p-8">
                    <img
                      className="h-20 flex-shrink-0 mx-auto rounded-full"
                      src="./teams/astralis_logo.png"
                      alt="Team logo"
                    />
                    <h3 className="mt-6 text-gray-900 text-sm font-medium">
                      {team.team_name}
                    </h3>
                    <dl className="mt-1 flex-grow flex flex-col justify-between">
                      <dt className="sr-only">Region</dt>
                      <dd className="text-gray-500 text-sm">Region - EU</dd>
                      <dt className="sr-only">Finances</dt>
                      <dd className="mt-3"></dd>
                    </dl>
                  </div>
                  <div>
                    <div className="-mt-px flex divide-x divide-gray-200">
                      <div className="w-0 flex-1 flex">
                        <button
                          onClick={() => setTeam(team.team_name)}
                          className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
                        >
                          <span className="ml-3">Choose</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
