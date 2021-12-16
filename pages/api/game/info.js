// Preloads the match info and displays on front end
// When UI clicks play then execute round by round functionality
import { connectToDatabase } from "../../../lib/mongo";
import format from "date-fns/format";
import { getSession } from "next-auth/react";

// Sends the relevant match info to the UI
export default async function matchInfo(req, res) {
  const { db } = await connectToDatabase();
  const session = await getSession({ req });

  try {
    if (session.user.email) {
      const state = await db
        .collection("saves")
        .findOne({ user: session.user.email });

      const fixture = state.fixtures.filter(function (e) {
        const date = format(e.date, "dd/MM/yyyy");

        return (
          date === format(state.gamestate.current_date, "dd/MM/yyyy") &&
          e.completed === false
        );
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

        res.status(200).json({
          message: "Game started",
          player_team,
          opponent,
          gameID: state._id,
        });
      }
    } else {
      res.status(404).json({ error: "You are not logged in" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
