import { connectToDatabase } from "../../../lib/mongo";
import { getSession } from "next-auth/react";

// Api for information on players current gamestate and updates the Nav UI
export default async function gameState(req, res) {
  const { db } = await connectToDatabase();
  const session = await getSession({ req });

  try {
    if (session.user.email) {
      const state = await db
        .collection("saves")
        .findOne({ user: session.user.email  });

      res.status(200).json({ state });
    } else {
      res.status(404).json({ error: "You are not logged in" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
}
