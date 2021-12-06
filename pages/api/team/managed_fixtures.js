import { connectToDatabase } from "../../../lib/mongo";
import ObjectID from "bson-objectid";

// Gets Fixtures for players team
export default async function teamInfo(req, res) {
    const { db } = await connectToDatabase();
    
    try {
        const save = await db.collection('saves').findOne({
            _id: ObjectID('619d8003d937258a03fb3dc0')
        })

        const fixtures = save.fixtures

        res.status(200).json({ success: true, fixtures })
    } catch (error) {
        console.log(error);
    }
  }
  
