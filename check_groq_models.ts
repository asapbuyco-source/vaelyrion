import dotenv from 'dotenv';
dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function main() {
  const response = await fetch('https://api.groq.com/openai/v1/models', {
    headers: { Authorization: `Bearer ${GROQ_API_KEY}` }
  });
  const json = await response.json();
  if (json.data) {
    console.log("Available models:");
    json.data.forEach((m: any) => console.log(' -', m.id));
  } else {
    console.log(JSON.stringify(json, null, 2));
  }
}

main();
