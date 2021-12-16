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

        let player_team = state.teams.filter(function(team) {
          return team.team_name === state.gamestate.manager_team
        })

        let opponent = state.teams.filter(function(team) {
          return team.team_name === 'G2'
        })
        
        const player_team_players = state.players.filter(function(player) {
          return player.team === state.gamestate.manager_team && player.active === true
        })

        player_team[0].players = player_team_players

        const opponent_players = state.players.filter(function(player) {
          return player.team === 'G2' && player.active === true
        })

        opponent[0].players = opponent_players


       res.status(200).json({
          message: "Game started",
          player_team: player_team[0],
          opponent: opponent[0],
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
