import { connectToDatabase } from "../../../lib/mongo";
import { hashPassword } from "../../../lib/helpers";

export default async (req, res) => {
	if (req.method === "POST") {
		const { email, password } = req.body;

		if (
			!email ||
			!email.includes("@") ||
			!password 
			// !password.trim().length > 7
		) {
			res.status(422).json({ message: "Invalid input!" });
			return;
		}

		const { db } = await connectToDatabase();

		const existingUser = await db.collection("users").findOne({ email: email });

		if (existingUser) {
			res.status(422).json({ message: "User is already registered." });
			return;
		}

		const hashedPassword = await hashPassword(password);

		await db.collection("users").insertOne({
			email: email,
			password: hashedPassword,
		});

		res.status(200).json({ message: "Created user!" });
	}
};