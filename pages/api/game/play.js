// This file collects the teams and the players in the server that are going to play and passes the game info to the front end
// Front end shows the pre match info - match history and player ratings of last 5 games
import { connectToDatabase } from "../../../lib/mongo";

export default async function PlayGame(req, res) {
  const { db } = await connectToDatabase();

  const { date, managers_team, opp_team } = req.body;

  try {
    const m_t = await db.collection("teams").findOne({
      team_name: managers_team,
    });

    const o_t = await db.collection("teams").findOne({
      team_name: opp_team,
    });

    const m_t_players = m_t.players;
    const o_t_players = o_t.players;

    // Adds a basic weight to each player
    m_t_players.forEach((element) => {
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
      total = (element.morale + total) / 100;

      element.stats = { ...stats, weight: total };
    });

    o_t_players.forEach((element) => {
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
      total = (element.morale + total) / 100;

      element.stats = { ...stats, weight: total };
    });

    let a_score = 0
    let b_score = 0

    function weight() {
      const m_hat = [];
      const o_hat = [];

      for (let i = 0; i < m_t_players.length; i++) {
        const weight = Math.round(m_t_players[i].stats.weight);
        for (let i = 0; i < weight; i++) {
          m_hat.push(m_t_players[i].ign);
        }
      }

      for (let i = 0; i < o_t_players.length; i++) {
        const weight = Math.round(o_t_players[i].stats.weight);
        for (let i = 0; i < weight; i++) {
          o_hat.push(o_t_players[i].ign);
        }
      }

      const a = m_hat[Math.floor(Math.random() * m_hat.length)];
      const b = o_hat[Math.floor(Math.random() * o_hat.length)];

      console.log(a, b)
    }

    const result = weight();

    res.status(200).json({ message: "Game started" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
