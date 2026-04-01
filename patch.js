const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const target = `{currentOutfit && !isDrawing && viewMode === 'model' && (
                              <div className="relative w-full max-w-[400px] h-full max-h-[700px] flex items-center justify-center animate-fade-in my-10">
                                 {/* Vector 人台 */}`;

const replace = `{currentOutfit && !isDrawing && viewMode === 'model' && (
                              <div className="relative w-full max-w-[400px] h-full max-h-[700px] flex items-center justify-center animate-fade-in my-10 mt-16 md:mt-10">
                                 {generatedModelUrl && (
                                    <div className="absolute inset-0 w-[110%] md:w-[120%] h-[110%] -left-[5%] md:-left-[10%] -top-[5%] z-50 flex items-center justify-center bg-white/80 backdrop-blur-md rounded-[2rem] p-4 animate-fade-in shadow-2xl group border border-slate-100">
                                       <img src={generatedModelUrl} className="w-full h-full object-contain filter drop-shadow-xl rounded-[1.5rem]" />
                                       <div className="absolute bottom-8 bg-black/60 text-white backdrop-blur-md px-5 py-2.5 rounded-full text-xs font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 shadow-lg">
                                          <Icon name="sparkles" size={14} className="text-yellow-400" /> 高階 AI 模特兒模擬實穿照
                                       </div>
                                       <button onClick={() => setGeneratedModelUrl(null)} className="absolute top-8 right-8 bg-black/50 hover:bg-red-500 text-white p-2 md:p-3 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-50 shadow-lg hover:rotate-12">
                                          <Icon name="trash" size={16} />
                                       </button>
                                    </div>
                                 )}
                                 {/* Vector 人台 */}`;

if (code.includes(target)) {
    code = code.replace(target, replace);
} else {
    code = code.replace(target.replace(/\n/g, '\r\n'), replace);
}

fs.writeFileSync('index.html', code, 'utf8');
console.log('patched');
