import { connectToDatabase } from "../../../lib/mongo";
import ObjectID from "bson-objectid";

// Api for information on players current gamestate and updates the Nav UI
export default async function gameState(req, res) {
  const { db } = await connectToDatabase();

  try {
    const state = await db
      .collection("saves")
      .findOne({ _id: ObjectID("619d8003d937258a03fb3dc0") });

    res.status(200).json({ state });
  } catch (error) {
    res.status(400).json({ error });
  }
}
