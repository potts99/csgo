import { connectToDatabase } from "../../../lib/mongo";
import { getSession } from "next-auth/react";

// Gets Fixtures for players team
export default async function teamInfo(req, res) {
  const { db } = await connectToDatabase();
  const session = await getSession({ req });

  try {
    if (session.user.email) {
      const save = await db.collection("saves").findOne({
        user: session.user.email,
      });

      const fixtures = save.fixtures;

      res.status(200).json({ success: true, fixtures });
    } else {
      res.status(404).json({ error: "You are not logged in" });
    }
  } catch (error) {
    console.log(error);
  }
}
