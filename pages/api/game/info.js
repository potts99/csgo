// Preloads the match info and displays on front end
// When UI clicks play then execute round by round functionality
import { connectToDatabase } from "../../../lib/mongo";
import ObjectID from "bson-objectid";
import format from "date-fns/format";

// Sends the relevant match info to the UI
export default async function matchInfo(req, res) {
  const { db } = await connectToDatabase();

  try {
    const state = await db
      .collection("saves")
      .findOne({ _id: ObjectID("619d8003d937258a03fb3dc0") });

    const fixture = state.fixtures.filter(function (e) {
      const date = format(e.date, "dd/MM/yyyy");

      return date === format(state.gamestate.current_date, "dd/MM/yyyy");
    });

    if (fixture.length === 0) {
      res.status(200).json({ no_game: true });
    } else {
      const player_team = await db.collection("teams").findOne({
        team_name: state.gamestate.manager_team,
      });

      const opponent = await db.collection("teams").findOne({
        team_name: fixture[0].opponent,
      });

      res
        .status(200)
        .json({
          message: "Game started",
          player_team,
          opponent,
          gameID: state._id,
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
