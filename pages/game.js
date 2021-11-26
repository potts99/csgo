import { useState } from "react";
import { useQuery } from "react-query";
import { remove, findIndex } from "lodash";

// Introduce player man advantage to weight system 

// Add each round to global Rounds State
// round info -> who killed who -> player stats

// Round Array struc
// Each index will hold round_number -> round_events in order -> round stats e.g k/d

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
  const [match, setMatch] = useState() // Holds Match stats such as player k/d

  const { data, status } = useQuery("game", game);


  async function playRound() {
    const m_team = [...data.m_t.players];
    const o_team = [...data.o_t.players];

    let m_team_stats = [...m_team];
    let o_team_stats = [...o_team];

    if (a > 15 || b > 15) {
      console.log("Game over");
      setLive(false);
    } else {
      let active = true;

      while (active === true) {
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

        const a_team = m_team;
        const b_team = o_team;

        if (a_team.length === 0 || b_team.length === 0) {
          console.log("round over amingo");

          if (b_team.length === 0) {
            console.log("you win");
            setA(a + 1);
            setRounds([]);
          } else {
            console.log("you lose");
            setB(b + 1);
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

          const winner = hat[Math.floor(Math.random() * hat.length)];

          function findloser() {
            let h = new Set(hat);
            let it = h.values();
            let arr = Array.from(it);
            return arr.filter(function (value, index, arr) {
              return value !== winner;
            });
          }

          const checkwinner = (obj) => obj.ign === winner;

          if (a_team.some(checkwinner)) {
            const loser = findloser();

            const index = findIndex(o_team_stats, function (o) {
              return o.ign == loser;
            });
            console.log(index);

            remove(b_team, function (n) {
              return n.ign === String(loser);
            });

            console.log("astralis killed " + String(loser) + " with " + winner);
          } else {
            const loser = findloser();

            remove(a_team, function (n) {
              return n.ign === String(loser);
            });

            console.log("liquid killed " + String(loser) + " with " + winner);
          }
        }
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
              <button
                disabled={live === false ? true : false}
                onClick={() => playRound()}
              >
                play round
              </button>
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
