import { connectToDatabase } from "../../../lib/mongo";

// This executes when play full button is clicked
// will simulate full match
// First generate weights and add rounded number to player
// Then create a while loop which will be the game loop
// in the while loop add logic for round played
// round played function has an array for each team
// select two players at random
// loser gets removed from array
// array first two 0 loses, winner gets + 1 score first to 16 wins

export default async function PlayGame(req, res) {

  const {m_team, o_team, date} = req.body

  try {
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

    function weight() {
      const m_hat = [];
      const o_hat = [];

      console.log(m_t_players.length)

      for (let i = 0; i < m_t_players.length; i++) {
        const weight = Math.round(m_t_players[i].stats.weight);
        for (let k = 0; k < weight; k++) {
          m_hat.push(m_t_players[i].ign);
          console.log(m_t_players[i].ign)
        }
      }

      for (let i = 0; i < o_t_players.length; i++) {
        const weight = Math.round(o_t_players[i].stats.weight);
        for (let k = 0; k < weight; k++) {
          o_hat.push(o_t_players[i].ign);
        }
      }

      const a = m_hat[Math.floor(Math.random() * m_hat.length)];
      const b = o_hat[Math.floor(Math.random() * o_hat.length)];

      const t = [...m_hat, o_hat]

      console.log(t)
    }

    res.status(200).json({ message: "Game started", gamestate, m_t, o_t });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
