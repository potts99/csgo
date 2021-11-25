// Preloads the match info and displays on front end
// When UI clicks play then execute round by round functionality
import { connectToDatabase } from "../../../lib/mongo";

export default async function matchInfo(req, res) {
  const { db } = await connectToDatabase();

  const { date, managers_team, opp_team } = req.body;

  try {
    const m_t = await db.collection("teams").findOne({
      team_name: managers_team,
    });

    const o_t = await db.collection("teams").findOne({
      team_name: opp_team,
    });

    const matchstate = {
      m_score: 0,
      o_score: 0,
      live: true,
    };

    res.status(200).json({ message: "Game started", matchstate, m_t, o_t });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
