"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClients = void 0;
const functions = require("firebase-functions");
const cors = require("cors");
const corsHandler = cors({ origin: true });
const clients = [
    {
        id: "m5gr84i9",
        name: "Tech Solutions Inc.",
        role: "Client",
        status: "Active",
        plan: "Enterprise",
    },
    {
        id: "3u1reuv4",
        name: "Notaría Pública 12",
        role: "Notary",
        status: "Active",
        plan: "Pro",
    },
    {
        id: "derv1ws0",
        name: "Real Estate Global",
        role: "Client",
        status: "Suspended",
        plan: "Basic",
    },
    {
        id: "5kma53ae",
        name: "Registro Público de la Propiedad",
        role: "Public Registrar",
        status: "Active",
        plan: "Government",
    },
    {
        id: "bhqecj4p",
        name: "Innovatech Legal",
        role: "Notary",
        status: "Paused",
        plan: "Pro",
    },
];
// Start writing functions
// https://firebase.google.com/docs/functions/typescript
exports.getClients = functions.https.onRequest((request, response) => {
    corsHandler(request, response, () => {
        // In a real app, you would fetch this from Firestore.
        response.json({ data: clients });
    });
});
//# sourceMappingURL=index.js.map