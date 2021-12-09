import React, { useState } from "react";
import { useQuery } from "react-query";
import _, { remove, findIndex, set, update } from "lodash";

async function gameInfo() {
  const res = await fetch("/api/game/info");
  return res.json();
}

export default function game() {
  const [live, setLive] = useState(true);
  const [rounds, setRounds] = useState([]);
  const [match, setMatch] = useState({
    round: 0,
    a_score: 0,
    b_score: 0,
    a_team_stats: [],
    b_team_stats: [],
  });

  const { data, status } = useQuery("game", gameInfo);

  // Loops over fixtures to see if theres a game on that given day
  React.useEffect(() => {
    if (match.a_score > 15 || match.b_score > 15) {
      console.log("match over");
      setLive(false);
      return fetch("/api/game/gameover", {
        method: "POST",
        Headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
          match,
          completed: true,
          id: data.gameID,
          opponent_name: data.opponent.team_name,
        }),
      });
    }
  }, [match]);

  function playRound() {
    const a_team = [...data.player_team.players];
    const b_team = [...data.opponent.players];

    let m_team_stats = [...a_team];
    let o_team_stats = [...b_team];

    while (live === true) {
      // Adds a basic weight to each player
      a_team.forEach((element) => {
        const stats = element.stats;

        let total =
          stats.rifle +
          stats.awp +
          stats.leadership +
          stats.tactics +
          stats.flair +
          stats.mentality +
          stats.teamwork +
          stats.workrate +
          stats.composure +
          stats.aggression +
          stats.utilty;
        total = (total / element.morale) * 10;

        element.stats = { ...stats, weight: Math.round(total) };
      });

      b_team.forEach((element) => {
        const stats = element.stats;

        let total =
          stats.rifle +
          stats.awp +
          stats.leadership +
          stats.tactics +
          stats.flair +
          stats.mentality +
          stats.teamwork +
          stats.workrate +
          stats.composure +
          stats.aggression +
          stats.utilty;
        total = (total / element.morale) * 10;

        element.stats = { ...stats, weight: Math.round(total) };
      });

      if (a_team.length === 0 || b_team.length === 0) {
        if (b_team.length === 0) {
          setMatch({
            ...match,
            round: match.round + 1,
            a_score: match.a_score + 1,
            a_team_stats: m_team_stats,
            b_team_stats: o_team_stats,
          });
        } else {
          setMatch({
            ...match,
            round: match.round + 1,
            b_score: match.b_score + 1,
            a_team_stats: m_team_stats,
            b_team_stats: o_team_stats,
          });
        }
        break;
      } else {
        let a_player = a_team[Math.floor(Math.random() * a_team.length)];
        let b_player = b_team[Math.floor(Math.random() * b_team.length)];

        let hat = [];

        for (let i = 0; i < a_player.stats.weight; i++) {
          hat.push(a_player.ign);
        }

        for (let i = 0; i < b_player.stats.weight; i++) {
          hat.push(b_player.ign);
        }

        const win = hat[Math.floor(Math.random() * hat.length)];

        function findloser() {
          let h = new Set(hat);
          let it = h.values();
          let arr = Array.from(it);
          return arr.filter(function (value, index, arr) {
            return value !== win;
          });
        }

        const checkwinner = (obj) => obj.ign === win;

        if (a_team.some(checkwinner)) {
          const loser = findloser();

          const index = findIndex(o_team_stats, function (o) {
            return o.ign == loser;
          });

          const winner = findIndex(m_team_stats, function (m) {
            return m.ign == win;
          });

          const prevdeaths = o_team_stats[index].deaths
            ? o_team_stats[index].deaths
            : 0;
          const prevkills = m_team_stats[winner].kills
            ? m_team_stats[winner].kills
            : 0;

          set(o_team_stats[index], "deaths", prevdeaths + 1);
          set(m_team_stats[winner], "kills", prevkills + 1);

          remove(b_team, function (n) {
            return n.ign === String(loser);
          });

          console.log("astralis killed " + String(loser) + " with " + win);
        } else {
          const loser = findloser();

          const index = findIndex(m_team_stats, function (e) {
            return e.ign == String(loser);
          });

          const winner = findIndex(o_team_stats, function (w) {
            return w.ign == win;
          });

          const prevdeaths = m_team_stats[index].deaths
            ? m_team_stats[index].deaths
            : 0;
          const prevkills = o_team_stats[winner].kills
            ? o_team_stats[winner].kills
            : 0;

          m_team_stats[index].deaths = prevdeaths + 1;
          o_team_stats[winner].kills = prevkills + 1;

          remove(a_team, function (a) {
            return a.ign === String(loser);
          });

          console.log("liquid killed " + String(loser) + " with " + win);
        }
      }
    }
  }

  return (
    <div className="">
      {status === "loading" && <div>Loading</div>}

      {status === "error" && <div>error</div>}

      {/* {status === "success" && data.gameDay && <div>{data.message}</div>} */}

      {status === "success" && data.opponent && (
        <div>
          {data.no_game === true && <p>error</p>}
          {data.player_team && (
            <div className="flex-col">
              <div className="flex justify-center">
                <div className="bg-gray-400 flex flex-row space-x-8">
                  <div>{data.player_team.team_name}</div>
                  <div className="flex flex-col">
                    <p>02 Jan</p>
                    <p>Test B01</p>
                    <p>{live === true ? "Live" : "Match Over"}</p>
                  </div>
                  <div>{data.opponent.team_name}</div>
                </div>
              </div>

              <div className="flex flex-row space-x-4">
                <div>
                  <button
                    disabled={live === false ? true : false}
                    onClick={() => playRound()}
                  >
                    Play Round
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-12  mt-32">
                <div className="space-y-4 w-full p-8">
                  {data.player_team.players.map((player) => {
                    return (
                      <div className="space-y-4 border w-full" key={player.ign}>
                        <div className="p-4 flex-col">
                          <p>{player.ign}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div>
                  <div className="flex flex-col p-2">
                    <div className="w-full h-8 flex flex-row items-center justify-center">
                      <div className="mr-16">R: {match.round}</div>
                      <div className="flex flex-row justify-center font-bold text-2xl space-x-4">
                        <p className="text-blue-500">{match.a_score}</p>
                        <p>:</p>
                        <p className="text-yellow-400 ">{match.b_score}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-4 ml-2 p-0 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {data.player_team.team_name}
                            </th>
                            <th
                              scope="col"
                              className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Kills
                            </th>
                            <th
                              scope="col"
                              className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Deaths
                            </th>

                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Edit</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {match.a_team_stats.map((player) => (
                            <tr key={player.ign}>
                              <td className="ml-2 p-0 whitespace-nowrap text-sm font-medium text-gray-900">
                                {player.ign}
                              </td>
                              <td className="text-center whitespace-nowrap text-sm font-medium text-gray-900">
                                {player.kills ? player.kills : 0}
                              </td>
                              <td className="text-center whitespace-nowrap text-sm font-medium text-gray-900">
                                {player.deaths ? player.deaths : 0}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="ml-2 p-0 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {data.opponent.team_name}
                            </th>
                            <th
                              scope="col"
                              className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Kills
                            </th>
                            <th
                              scope="col"
                              className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Deaths
                            </th>

                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Edit</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {match.b_team_stats.map((player) => (
                            <tr key={player.ign}>
                              <td className="ml-2 p-0 whitespace-nowrap text-sm font-medium text-gray-900">
                                {player.ign}
                              </td>
                              <td className="text-center whitespace-nowrap text-sm font-medium text-gray-900">
                                {player.kills ? player.kills : 0}
                              </td>
                              <td className="text-center whitespace-nowrap text-sm font-medium text-gray-900">
                                {player.deaths ? player.deaths : 0}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 w-full p-8">
                  {data.opponent.players.map((player) => {
                    return (
                      <div className="space-y-4 border w-full" key={player.ign}>
                        <div className="p-4 flex-col">
                          <p>{player.ign}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
