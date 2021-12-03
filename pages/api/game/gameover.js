import { connectToDatabase } from "../../../lib/mongo";
import ObjectID from "bson-objectid";
import format from "date-fns/format";

export default async function gameover(req, res) {
  const { db } = await connectToDatabase();

  const { match, id, completed, opponent_name } = JSON.parse(req.body);

  console.log(id, completed, opponent_name);

  try {
    // Loads save file
    const save = await db.collection("saves").findOne({
      _id: ObjectID(id),
    });

    // Loads fixtures for given day
    const days_fixtures = save.fixtures.filter(function (e) {
      const date = format(e.date, "dd/MM/yyyy");
      return date === format(save.gamestate.current_date, "dd/MM/yyyy");
    });

    // Finds fixture played
    days_fixtures.filter(function (e) {
      return e.opponent === opponent_name;
    });

    const winner =
      match.a_score < match.b_score
        ? opponent_name
        : save.gamestate.manager_team;

    const loser =
      match.a_score > match.b_score
        ? opponent_name
        : save.gamestate.manager_team;

    await db.collection("saves").updateOne(
      {
        _id: ObjectID(id),
        "fixtures.date": save.gamestate.current_date,
        "fixtures.opponent": opponent_name,
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
    );

    res.status(200).json({ message: "Match over & Data Saved", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}