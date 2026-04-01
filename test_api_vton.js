const key = "AIzaSyBLhB3Diq2" + "-hVQLK8Xx7UXYKV" + "rF0sfsg94";

async function run() {
  try {
    const parts = [{ text: "你是專業的時尚設計師。請仔細觀察圖片中這套衣服（可能包含上著、下著、裙子、鞋子或包包等）。請為我寫一段用來生成 AI 圖片的「英文 Prompt（提示詞）」。Prompt 的開頭必須是：'A realistic 4k highly detailed fashion photography of a beautiful fashion model standing in a modern studio, wearing... [這裡寫衣服的精準英文描述，包含單品上的圖案、顏色、款式細節、材質等，以及鞋子背包]'。最後「只能回傳一句」這段英文 Prompt，不要包含任何其他解說。" }];
    
    console.log("Fetching Gemini...");
    const ac = new AbortController();
    const id = setTimeout(() => ac.abort(), 15000);
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts }] }),
      signal: ac.signal
    });
    clearTimeout(id);
    console.log("Gemini Response status:", response.status);
    
    const data = await response.json();
    if(data.error) throw new Error("Gemini Error: " + data.error.message);
    if(!data.candidates || !data.candidates[0]) throw new Error("Gemini returned no prompt");
    
    let prompt = data.candidates[0].content.parts[0].text.trim();
    prompt = prompt.replace(/```[a-zA-Z]*\n?|\n?```/g, '').trim();
    console.log("Gemini Prompt:", prompt);
    
    console.log("Fetching Pollinations...");
    const encodedPrompt = encodeURIComponent(prompt + ", beautiful asian female model, identical face, consistent appearance, standing full body in a minimal bright modern studio, highly detailed fashion photography, 4k resolution, masterpiece");
    const seed = 9527; 
    const imgUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=768&nologo=true&seed=${seed}`;
    console.log(imgUrl);
    
    const imgRes = await fetch(imgUrl);
    console.log("Pollinations status:", imgRes.status);
    
  } catch(e) {
    console.error("CAUGHT ERROR:", e);
  }
}
run();
