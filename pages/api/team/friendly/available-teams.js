import { connectToDatabase } from "../../../../lib/mongo";

// Will get the available teams for a friendly
// Region based later

export default async function availableTeams(req, res) {
  const { db } = await connectToDatabase();

  try {
    const teams = await db.collection("teams").find({}).toArray();

    res.status(200).json({ teams, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, success: false });
  }
}
