import re

with open('index.html', 'r', encoding='utf8') as f:
    text = f.read()

target1 = r'''                       {/\* Canvas Header \*/}
                       <div className="absolute top-4 left-6 right-6 flex justify-between items-center z-20">
                          <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-slate-500 border border-slate-100 shadow-sm">
                             {currentOutfit \? '單擊服裝單品即可手動替換' : '等待生成指令...'}
                          </div>
                          {currentOutfit && \(
                             <div className="flex bg-white/90 backdrop-blur-sm p-1\.5 rounded-2xl shadow-sm border border-slate-100 gap-1">
                               <button onClick=\{\(\) => setViewMode\('model'\)} className=\{`px-4 py-2 text-xs font-bold rounded-xl transition \$\{viewMode === 'model' \? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 hover:bg-slate-50'\}`}>視角一: 人台</button>
                               <button onClick=\{\(\) => setViewMode\('grid'\)} className=\{`px-4 py-2 text-xs font-bold rounded-xl transition \$\{viewMode === 'grid' \? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 hover:bg-slate-50'\}`}>視角二: 平鋪</button>
                             </div>
                          \)}
                       </div>'''

replace1 = '''                       {/* Canvas Header */}
                       <div className="absolute top-4 left-4 right-4 md:left-6 md:right-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 z-[60] pointer-events-none">
                          <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-slate-500 border border-slate-100 shadow-sm pointer-events-auto">
                             {currentOutfit ? '單擊服裝單品即可手動替換' : '等待生成指令...'}
                          </div>
                          {currentOutfit && (
                             <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
                               <button onClick={generateVirtualTryOn} disabled={isGeneratingModel} className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl shadow-md transition-all ${isGeneratingModel ? 'bg-indigo-300 text-white cursor-not-allowed hidden md:flex' : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white hover:scale-105 active:scale-95'}`}>
                                  {isGeneratingModel ? <Icon name="rotate" className="animate-spin" size={14} /> : <Icon name="wand" size={14} />}
                                  <span className="hidden sm:inline">{isGeneratingModel ? '加載中...' : '生成 AI 實穿照'}</span>
                                  <span className="sm:hidden">{isGeneratingModel ? '加載中...' : 'AI實穿'}</span>
                               </button>
                               <div className="flex bg-white/90 backdrop-blur-sm p-1.5 rounded-2xl shadow-sm border border-slate-100 gap-1">
                                 <button onClick={() => setViewMode('model')} className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${viewMode === 'model' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 hover:bg-slate-50'}`}>人台</button>
                                 <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 hover:bg-slate-50'}`}>平鋪</button>
                               </div>
                             </div>
                          )}
                       </div>'''

target2 = r'''                           \{currentOutfit && !isDrawing && viewMode === 'model' && \(
                              <div className="relative w-full max-w-\[400px\] h-full max-h-\[700px\] flex items-center justify-center animate-fade-in my-10">
                                 \{/\* Vector 人台 \*/}'''

replace2 = '''                           {currentOutfit && !isDrawing && viewMode === 'model' && (
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
                                 {/* Vector 人台 */}'''

import sys
new_text = re.sub(target1, replace1, text)
new_text = re.sub(target2, replace2, new_text)

if text == new_text:
    print("NO CHANGES MADE!")
else:
    with open('index.html', 'w', encoding='utf8') as f:
        f.write(new_text)
    print("SUCCESS")
