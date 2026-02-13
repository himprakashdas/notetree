
import { GoogleGenAI } from "@google/genai";

const API_KEY = "AIzaSyClWsZZoESFPqf22L1m7M4b5mS8b1bM3MU";
const client = new GoogleGenAI({ apiKey: API_KEY });

async function test() {
    try {
        console.log("Listing models...");
        const response = await client.models.list();
        // In some versions it's an array directly, in others it's a paginated response
        console.log("Response type:", typeof response);

        // Attempting to print entries
        if (Array.isArray(response)) {
            response.forEach(m => console.log(m.name));
        } else {
            console.log("Response keys:", Object.keys(response));
            // Might be response.models?
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

test();
