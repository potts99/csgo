import { connectToDatabase } from "../../../lib/mongo";

import players from '../../../lib/db/players.json'

export default async function seedPlayers() {

    const { db } = await connectToDatabase();

    try {
        
    } catch (error) {
        
    }
}