const key = "AIzaSyBLhB3Diq2" + "-hVQLK8Xx7UXYKV" + "rF0sfsg94";
const fs = require('fs');

async function run() {
  try {
    const prompt = "A beautiful asian female model wearing a red t-shirt, studio lighting, 4k high quality photography";
    const request = {
      instances: [{ prompt: prompt }],
      parameters: { sampleCount: 1, aspectRatio: "3:4", seed: 9527 }
    };
    
    console.log("Fetching Imagen 4.0 Fast with seed...");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    });
    const data = await response.json();
    if(data.error) throw new Error(data.error.message);
    
    fs.writeFileSync('test_out_imagen_js.txt', "Success with seed!");
  } catch(e) {
    fs.writeFileSync('test_out_imagen_js.txt', "CAUGHT: " + e.message);
  }
}
run();
