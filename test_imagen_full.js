const key = "AIzaSyBLhB3Diq2" + "-hVQLK8Xx7UXYKV" + "rF0sfsg94";
const fs = require('fs');

async function run() {
  try {
    const prompt = "A beautiful asian female model wearing a red t-shirt, studio lighting";
    const request = {
      instances: [{ prompt: prompt }],
      parameters: { sampleCount: 1, aspectRatio: "3:4" }
    };
    
    console.log("Fetching Imagen 4.0 Fast...");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    });
    const data = await response.json();
    if(data.error) throw new Error(data.error.message);
    
    fs.writeFileSync('test_out_imagen_data.json', JSON.stringify(data, null, 2));
    console.log("Wrote full JSON to test_out_imagen_data.json");
  } catch(e) {
    console.error("CAUGHT: " + e.message);
  }
}
run();
