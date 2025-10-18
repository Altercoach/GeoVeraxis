import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import cors from "cors";

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

const corsHandler = cors({origin: true});

// In a real monorepo, this would be a shared package.
export type Client = {
  id: string;
  name: string;
  role: "Client" | "Notary" | "Public Registrar";
  status: "Active" | "Paused" | "Suspended" | "Canceled";
  plan: "Basic" | "Pro" | "Enterprise" | "Government";
};

export const getClients = functions.https.onRequest(async (request, response) => {
  corsHandler(request, response, async () => {
    try {
      const snapshot = await db.collection("clients").get();
      if (snapshot.empty) {
        response.json({ data: [] });
        return;
      }

      const clients: Client[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          role: data.role,
          status: data.status,
          plan: data.plan,
        } as Client;
      });

      response.json({ data: clients });
    } catch (error) {
      functions.logger.error("Error getting clients:", error);
      response.status(500).send("Internal Server Error");
    }
  });
});