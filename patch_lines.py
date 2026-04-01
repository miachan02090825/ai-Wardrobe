with open('index.html', 'r', encoding='utf8') as f:
    lines = f.readlines()

new_lines = []
for idx, line in enumerate(lines):
    if "{currentOutfit && !isDrawing && viewMode === 'model' && (" in line:
        new_lines.append(line)
        # The next line is the relative div
        next_line1 = lines[idx+1]
        new_lines.append(next_line1.replace('my-10', 'my-10 mt-16 md:mt-10'))
        
        # Now insert the generatedModelUrl code
        new_lines.append(
'''                                 {generatedModelUrl && (
                                    <div className="absolute inset-0 w-[110%] md:w-[120%] h-[110%] -left-[5%] md:-left-[10%] -top-[5%] z-50 flex items-center justify-center bg-white/80 backdrop-blur-md rounded-[2rem] p-4 animate-fade-in shadow-2xl group border border-slate-100">
                                       <img src={generatedModelUrl} className="w-full h-full object-contain filter drop-shadow-xl rounded-[1.5rem]" />
                                       <div className="absolute bottom-8 bg-black/60 text-white backdrop-blur-md px-5 py-2.5 rounded-full text-xs font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 shadow-lg">
                                          <Icon name="sparkles" size={14} className="text-yellow-400" /> 高階 AI 模特兒模擬實穿照
                                       </div>
                                       <button onClick={() => setGeneratedModelUrl(null)} className="absolute top-8 right-8 bg-black/50 hover:bg-red-500 text-white p-2 md:p-3 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-50 shadow-lg hover:rotate-12">
                                          <Icon name="trash" size={16} />
                                       </button>
                                    </div>
                                 )}\n''')
        continue
    
    if idx > 0 and "{currentOutfit && !isDrawing && viewMode === 'model' && (" in lines[idx-1]:
        # Skip the original div line, we already appended a modified version
        continue
    
    new_lines.append(line)

with open('index.html', 'w', encoding='utf8') as f:
    f.writelines(new_lines)
print("SUCCESS!")
