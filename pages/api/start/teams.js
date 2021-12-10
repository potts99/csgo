import { connectToDatabase } from "../../../lib/mongo";

export default async function teams(req, res) {
  const { db } = await connectToDatabase();

  try {
    const teams = await db.collection("teams").find({}).toArray();

    res.status(200).json({ teams, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
