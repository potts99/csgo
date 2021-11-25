import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import _, { includes } from "lodash";

export default function game() {
  async function game() {
    const res = await fetch("/api/game/info", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        date: "02 JAN",
        managers_team: "astralis",
        opp_team: "liquid",
      }),
    });
    return res.json();
  }

  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [live, setLive] = useState(true);
  const [rounds, setRounds] = useState([]);

  const { data, status } = useQuery("game", game);

  async function playfull() {
    let m_team = data.m_t.players;
    let o_team = data.o_t.players;

    if (a > 15 || b > 15) {
      console.log("Game over");
      setLive(false);
    } else {
      // Adds a basic weight to each player
      m_team.forEach((element) => {
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

      o_team.forEach((element) => {
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

      let a_player = m_team[Math.floor(Math.random() * m_team.length)];
      let b_player = o_team[Math.floor(Math.random() * o_team.length)];
      let hat = [];

      for (let i = 0; i < a_player.stats.weight; i++) {
        hat.push(a_player.ign);
      }

      for (let i = 0; i < b_player.stats.weight; i++) {
        hat.push(b_player.ign);
      }

      const winner = hat[Math.floor(Math.random() * hat.length)]

      const checkwinner = obj => obj.ign === winner;

      if(m_team.some(checkwinner)) {
          console.log('astralis wins with ' + winner)
          setA(a + 1)
      } else {
        console.log('liquid wins with ' + winner)
        setB(b + 1)
      }

    }
  }

  return (
    <div className="">
      {status === "loading" && <div>Loading</div>}

      {status === "error" && <div>error</div>}

      {status === "success" && (
        <div className="flex-col">
          <div className="flex justify-center">
            <div className="bg-gray-400 flex flex-row space-x-8">
              <div>{data.m_t.team_name}</div>
              <div className="flex flex-col">
                <p>02 Jan</p>
                <p>Test B01</p>
                <p>{live === true ? "Live" : "Match Over"}</p>
              </div>
              <div>{data.o_t.team_name}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-12 place-items-center mt-32">
            <div className="">
              {data.m_t.players.map((player) => {
                return <div>{player.ign}</div>;
              })}
            </div>

            <div className="">
              <div>
                astralis {a} - {b} liquid
              </div>
              <button disabled={live === false ? true : false} onClick={() => playfull()}>play round</button>
            </div>

            <div className="">
              {data.o_t.players.map((player) => {
                return <div>{player.ign}</div>;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
