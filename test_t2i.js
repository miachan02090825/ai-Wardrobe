async function run() {
  const prompt = "A beautiful asian female model wearing a red t-shirt, studio lighting, masterpiece";
  const encoded = encodeURIComponent(prompt);

  const urls = [
    `https://api.airforce/v1/imagine?prompt=${encoded}&size=3:4`,
    `https://api.airforce/v1/imagine2?prompt=${encoded}&size=3:4`,
    `https://pollinations.ai/p/${encoded}?width=512&height=768&nologo=true&seed=9527`
  ];

  for(const url of urls) {
     console.log("Testing:", url.split('?')[0]);
     try {
       const res = await fetch(url);
       console.log("Status:", res.status);
       const ct = res.headers.get("content-type");
       console.log("Type:", ct);
     } catch(e) {
       console.log("Error");
     }
  }
}
run();
