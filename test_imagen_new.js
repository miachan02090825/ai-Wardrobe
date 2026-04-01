const key = "AIzaSyBLhB3Diq2" + "-hVQLK8Xx7UXYKV" + "rF0sfsg94";

async function run() {
  try {
    const prompt = "A beautiful asian female model wearing a red t-shirt, studio lighting, 4k high quality photography";
    const request = {
      instances: [{ prompt: prompt }],
      parameters: { sampleCount: 1, aspectRatio: "3:4" }
    };
    
    console.log("Fetching Imagen 3.0...");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    });
    console.log("Status:", response.status);
    const data = await response.json();
    if(data.error) throw new Error(data.error.message);
    
    console.log("Success! Received base64 bytes:", data.predictions[0].bytesBase64.substring(0, 50) + "...");
  } catch(e) {
    console.error("CAUGHT:", e);
  }
}
run();
