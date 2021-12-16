import { connectToDatabase } from "../../../lib/mongo";
import { getSession } from "next-auth/react";

export default async function genSave(req, res) {
  const session = await getSession({ req });
  const { db } = await connectToDatabase();

  const user = session.user.email;

  try {
    const teams = await db.collection("teams").find({}).toArray();
    const players = await db.collection("players").find({}).toArray();

    await db.collection("saves").insertOne({
      user: user,
      gamestate: {
        current_date: new Date("2021-01-01T00:00:00.000+00:00"),
        year: "2021",
        manager_name: req.body.name,
        manager_team: req.body.team,
      },
      teams: teams,
      players: players,
      fixtures: [
        {
          date: new Date("2021-01-02T00:00:00.000+00:00"),
          opponent: "G2",
          winner: "",
          loser: "",
          m_score: "",
          o_score: "",
          completed: false,
        },
      ],
    });

    res.status(200).json({ sucess: true, message: "Save Generating" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
    });
  }
}
