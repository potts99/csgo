import { connectToDatabase } from "../../../lib/mongo";
import ObjectID from "bson-objectid";
import { getSession } from "next-auth/react";

export default async function gameover(req, res) {
  const { db } = await connectToDatabase();
  const session = await getSession({ req });

  const { match, id, opponent_name } = JSON.parse(req.body);

  try {
    if (session.user.email) {
      // Loads save file
      const save = await db.collection("saves").findOne({
        user: session.user.email,
      });

      const winner =
        match.a_score < match.b_score
          ? opponent_name
          : save.gamestate.manager_team;

      const loser =
        match.a_score > match.b_score
          ? opponent_name
          : save.gamestate.manager_team;

      const test = await db.collection("saves").updateOne(
        {
          _id: ObjectID(id),
          fixtures: {
            $elemMatch: {
              opponent: {
                $eq: opponent_name,
              },
              date: {
                $eq: save.gamestate.current_date,
              },
            },
          },
        },
        {
          $set: {
            "fixtures.$.completed": true,
            "fixtures.$.winner": winner,
            "fixtures.$.loser": loser,
            "fixtures.$.m_score": match.a_score,
            "fixtures.$.o_score": match.b_score,
          },
        }
        // { upsert: true }
      );

      res
        .status(200)
        .json({ message: "Match over & Data Saved", success: true });
    } else {
      res.status(404).json({ error: "You are not logged in" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
