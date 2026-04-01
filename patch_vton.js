const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// 1. Remove setGeneratedModelUrl(null) from generateVirtualTryOn
code = code.replace(
  `         setIsGeneratingModel(true);
         setGeneratedModelUrl(null);
         showToast("✨ AI 正在為您光速生成真人模特兒實穿照，請稍候...");`,
  `         setIsGeneratingModel(true);
         // 保留舊照，只顯示 Loading
         showToast("✨ AI 正在為您光速生成裝扮，請稍候...");`
);

// 2. Fix the Pollinations prompt and seed
code = code.replace(
  `            const encodedPrompt = encodeURIComponent(prompt + ", elegant pose, soft studio edge lighting, 8k resolution, masterpiece");
            const seed = Math.floor(Math.random() * 1000000);
            const imgUrl = \`https://image.pollinations.ai/prompt/\${encodedPrompt}?width=512&height=768&nologo=true&enhance=true&seed=\${seed}\`;`,
  `            const encodedPrompt = encodeURIComponent(prompt + ", beautiful asian female model, identical face, consistent appearance, standing full body in a minimal bright modern studio, highly detailed fashion photography, 4k resolution, masterpiece");
            const seed = 9527; // 固定 Seed，讓模特兒長相與姿勢保持「同一個人」的感覺，製造直接換衣服的錯覺
            const imgUrl = \`https://image.pollinations.ai/prompt/\${encodedPrompt}?width=512&height=768&nologo=true&enhance=true&seed=\${seed}\`;`
);

// 3. Update the UI for generatedModelUrl overlay to contain the Blur Loader and Swap buttons
const oldUI = `                                 {generatedModelUrl && (
                                    <div className="absolute inset-0 w-[110%] md:w-[120%] h-[110%] -left-[5%] md:-left-[10%] -top-[5%] z-50 flex items-center justify-center bg-white/80 backdrop-blur-md rounded-[2rem] p-4 animate-fade-in shadow-2xl group border border-slate-100">
                                       <img src={generatedModelUrl} className="w-full h-full object-contain filter drop-shadow-xl rounded-[1.5rem]" />
                                       <div className="absolute bottom-8 bg-black/60 text-white backdrop-blur-md px-5 py-2.5 rounded-full text-xs font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 shadow-lg">
                                          <Icon name="sparkles" size={14} className="text-yellow-400" /> 高階 AI 模特兒模擬實穿照
                                       </div>
                                       <button onClick={() => setGeneratedModelUrl(null)} className="absolute top-8 right-8 bg-black/50 hover:bg-red-500 text-white p-2 md:p-3 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-50 shadow-lg hover:rotate-12">
                                          <Icon name="trash" size={16} />
                                       </button>
                                    </div>
                                 )}`;

const newUI = `                                 {generatedModelUrl && (
                                    <div className="absolute inset-0 w-[110%] md:w-[120%] h-[110%] -left-[5%] md:-left-[10%] -top-[5%] z-50 flex items-center justify-center bg-white/80 backdrop-blur-md rounded-[2rem] p-4 animate-fade-in shadow-2xl border border-slate-100 group">
                                       <img src={generatedModelUrl} className={\`w-full h-full object-contain filter drop-shadow-xl rounded-[1.5rem] transition-all duration-700 \${isGeneratingModel ? 'blur-md opacity-60 scale-95' : 'blur-0 opacity-100 scale-100'}\`} />
                                       
                                       {isGeneratingModel && (
                                          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-indigo-600 bg-white/30 backdrop-blur-sm rounded-[1.5rem] m-4">
                                            <Icon name="wand" size={32} className="animate-pulse mb-3" />
                                            <span className="font-bold tracking-widest text-xs bg-white/80 px-4 py-2 rounded-full shadow-sm">正在直接為您換上...</span>
                                          </div>
                                       )}

                                       {!isGeneratingModel && (
                                          <div className="absolute bottom-10 right-10 flex flex-col gap-2 z-20">
                                             {currentOutfit.top && <button onClick={() => handleSwap('top')} className="bg-white/90 hover:bg-indigo-50 text-indigo-700 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black shadow-lg shadow-indigo-200/50 hover:-translate-x-1 transition-transform border border-indigo-100">更換上衣</button>}
                                             {currentOutfit.bottom && <button onClick={() => handleSwap('bottom')} className="bg-white/90 hover:bg-indigo-50 text-indigo-700 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black shadow-lg shadow-indigo-200/50 hover:-translate-x-1 transition-transform border border-indigo-100">更換下身</button>}
                                             {currentOutfit.dress && <button onClick={() => handleSwap('dress')} className="bg-white/90 hover:bg-indigo-50 text-indigo-700 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black shadow-lg shadow-indigo-200/50 hover:-translate-x-1 transition-transform border border-indigo-100">更換連身</button>}
                                             {currentOutfit.bag && <button onClick={() => handleSwap('bag')} className="bg-white/90 hover:bg-indigo-50 text-indigo-700 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black shadow-lg shadow-indigo-200/50 hover:-translate-x-1 transition-transform border border-indigo-100">更換包包</button>}
                                          </div>
                                       )}

                                       <button onClick={() => setGeneratedModelUrl(null)} className="absolute top-8 right-8 bg-black/50 hover:bg-red-500 text-white p-2 md:p-3 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-50 shadow-lg hover:rotate-12">
                                          <Icon name="trash" size={16} />
                                       </button>
                                    </div>
                                 )}`;

code = code.replace(oldUI, newUI);
code = code.replace(oldUI.replace(/\r\n/g, '\n'), newUI);

fs.writeFileSync('index.html', code, 'utf8');
console.log('Video Style VTON patch completely applied!');
