const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const targetStr = `            // 重試生圖機制 (針對 429 或網路擁塞)
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
            showToast("🎉 專屬模特兒已為您換上最新穿搭照！");

         } catch(e) {
            console.error(e);
            showToast("⚠️ 模特兒生成超時或失敗，請再試一次！");
            setIsGeneratingModel(false);
         }`;

const replaceStr = `            // 透過 Gemini (Imagen) 進行原生生圖
            const fullPrompt = prompt + ", beautiful asian female model, identical face, consistent appearance, standing full body in a minimal bright modern studio, highly detailed fashion photography, 4k resolution, masterpiece";
            
            const imgReqBody = {
               instances: [{ prompt: fullPrompt }],
               parameters: { sampleCount: 1, aspectRatio: "3:4" }
            };
            
            const imgResponse = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=\${g_api}\`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(imgReqBody)
            });
            const imgData = await imgResponse.json();
            
            if(imgData.error) throw new Error(imgData.error.message);
            if(!imgData.predictions || !imgData.predictions[0]) throw new Error("Imagen returned no image");
            
            const b64Image = \`data:image/jpeg;base64,\${imgData.predictions[0].bytesBase64}\`;
            
            setGeneratedModelUrl(b64Image);
            setIsGeneratingModel(false);
            showToast("🎉 專屬模特兒已為您換上最新穿搭照！");

         } catch(e) {
            console.error("生成失敗:", e.message);
            if(e.message.includes("paid plans")) {
               showToast("⚠️ Gemini API 錯誤: 您的 API 密鑰是免費版，無法產圖！請升級 Google 付費計畫。");
            } else {
               showToast("⚠️ 模特兒生成失敗: " + e.message);
            }
            setIsGeneratingModel(false);
         }`;

code = code.replace(targetStr, replaceStr);
code = code.replace(targetStr.replace(/\r\n/g, '\n'), replaceStr);

fs.writeFileSync('index.html', code, 'utf8');
console.log('Imagen API patch fully applied!');
