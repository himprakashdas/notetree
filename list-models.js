
import { GoogleGenAI } from "@google/genai";

const API_KEY = "AIzaSyClWsZZoESFPqf22L1m7M4b5mS8b1bM3MU";
const client = new GoogleGenAI({ apiKey: API_KEY });

async function test() {
  try {
    console.log("Listing models...");
    for await (const model of client.models.list()) {
      console.log(model.name);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
