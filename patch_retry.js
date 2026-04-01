const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// The block to replace
const target = `            const encodedPrompt = encodeURIComponent(prompt + ", beautiful asian female model, identical face, consistent appearance, standing full body in a minimal bright modern studio, highly detailed fashion photography, 4k resolution, masterpiece");
            const seed = 9527; // 固定 Seed，讓模特兒長相與姿勢保持「同一個人」的感覺，製造直接換衣服的錯覺
            const imgUrl = \`https://image.pollinations.ai/prompt/\${encodedPrompt}?width=512&height=768&nologo=true&seed=\${seed}\`;
            
            await new Promise((resolve, reject) => {
               const img = new Image();
               let isDone = false;
               const timeoutId = setTimeout(() => {
                  if(!isDone) { isDone = true; reject(new Error("Timeout loading image")); }
               }, 30000); // 30秒超時
               
               img.onload = () => {
                  if(isDone) return;
                  isDone = true;
                  clearTimeout(timeoutId);
                  setGeneratedModelUrl(imgUrl);
                  setIsGeneratingModel(false);
                  showToast("🎉 專屬模特兒已為您換上最新穿搭照！");
                  resolve();
               };
               img.onerror = () => {
                  if(isDone) return;
                  isDone = true;
                  clearTimeout(timeoutId);
                  reject(new Error("Image load failed"));
               };
               img.src = imgUrl;
            });`;

const replacement = `            // 重試生圖機制 (針對 429 或網路擁塞)
            const encodedPrompt = encodeURIComponent(prompt + ", beautiful asian female model, identical face, consistent appearance, standing full body in a minimal bright modern studio, highly detailed fashion photography, 4k resolution, masterpiece");
            const seed = 9527; // 固定 Seed 統一模特兒身型外貌
            
            let attempts = 0;
            let finalImgUrl = null;
            
            while(attempts < 3) {
               attempts++;
               // 使用多個分流網址或加上隨機版本號避免快取 429
               const baseUrl = attempts % 2 === 0 ? "https://image.pollinations.ai/prompt/" : "https://pollinations.ai/p/";
               const imgUrl = \`\${baseUrl}\${encodedPrompt}?width=512&height=768&nologo=true&seed=\${seed}&retry=\${Date.now()}\`;
               
               try {
                  await new Promise((resolve, reject) => {
                     const img = new Image();
                     let isDone = false;
                     const timeoutId = setTimeout(() => {
                        if(!isDone) { isDone = true; reject(new Error("Timeout")); }
                     }, 15000); // 單次 15 秒超時
                     
                     img.onload = () => {
                        if(isDone) return;
                        isDone = true;
                        clearTimeout(timeoutId);
                        finalImgUrl = imgUrl;
                        resolve();
                     };
                     img.onerror = () => {
                        if(isDone) return;
                        isDone = true;
                        clearTimeout(timeoutId);
                        reject(new Error("Load Error"));
                     };
                     img.src = imgUrl;
                  });
                  break; // 成功就跳出迴圈
               } catch(err) {
                  if(attempts >= 3) throw err;
                  console.warn("Retrying image load...", err);
                  await new Promise(r => setTimeout(r, 2000)); // 等 2 秒再試
               }
            }
            
            setGeneratedModelUrl(finalImgUrl);
            setIsGeneratingModel(false);
            showToast("🎉 專屬模特兒已為您換上最新穿搭照！");`;

const oldCode = code;
code = code.replace(target, replacement);

// Fallback if whitespace differs
if (code === oldCode) {
    code = code.replace(target.replace(/\r\n/g, '\n'), replacement);
}

fs.writeFileSync('index.html', code, 'utf8');
console.log('Retry mechanism added');
