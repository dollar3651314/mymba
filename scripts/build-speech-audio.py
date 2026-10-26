# 把演讲稿（content/<课程>/speech-<作业>.md）拼成一整段 mp3，每句后面留出跟读的停顿，手机锁屏也能连续播放。
# 用法：先 node scripts/build-practice.mjs 和 build-audio.py（生成每句的 mp3），再 python3 scripts/build-speech-audio.py
# 输出 audio/speech-<课程>-<作业>-<内容哈希>.mp3，并写 data/speech-audio.js（网页用它找到文件）
import glob, hashlib, json, os, re, subprocess, tempfile

def sha(t): return hashlib.sha1(t.encode('utf-8')).hexdigest()
def dur(p): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p]).strip())

out = {}
for f in sorted(glob.glob('content/*/speech-*.md')):
    mod, asm = f.split('/')[1], re.search(r'speech-(\w+)\.md$', f).group(1)
    sections, cur = [], None
    for line in open(f, encoding='utf-8'):
        if line.startswith('## '): cur = [line[3:].strip(), []]; sections.append(cur); continue
        m = re.match(r'^- "(.+)"\s*——', line)
        if m and cur: cur[1].append(m.group(1).strip())
    texts = [t for _, ts in sections for t in ts]
    h = sha('\n'.join(texts))[:10]
    name = f'audio/speech-{mod}-{asm}-{h}.mp3'
    total = sum(len(ts) for _, ts in sections)
    if not os.path.exists(name):
        missing = [t for t in texts if not os.path.exists('audio/' + sha(t)[:12] + '.mp3')]
        if missing: raise SystemExit(f'{f}: {len(missing)} 句还没有录音，先运行 build-audio.py')
        with tempfile.TemporaryDirectory() as tmp:
            def silence(sec):
                p = os.path.join(tmp, f'sil{int(sec * 1000)}.mp3')
                if not os.path.exists(p):
                    subprocess.run(['ffmpeg', '-v', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=24000:cl=mono', '-t', f'{sec:.2f}', '-q:a', '9', '-acodec', 'libmp3lame', p], check=True)
                return p
            parts = [silence(1.0)]
            for title, ts in sections:
                for t in ts:
                    p = 'audio/' + sha(t)[:12] + '.mp3'
                    parts += [p, silence(round(dur(p) + 1.2, 1))]  # 停顿 = 句子长度 + 1.2 秒，够跟读一遍
                parts.append(silence(2.0))  # 每页之间多停 2 秒
            lst = os.path.join(tmp, 'list.txt')
            open(lst, 'w').write(''.join(f"file '{os.path.abspath(p)}'\n" for p in parts))
            subprocess.run(['ffmpeg', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-ac', '1', '-ar', '24000', '-b:a', '48k', '-acodec', 'libmp3lame', name], check=True)
        for old in glob.glob(f'audio/speech-{mod}-{asm}-*.mp3'):
            if old != name: os.remove(old)
    out[f'{mod}/{asm}'] = {'src': name, 'sec': round(dur(name)), 'n': total}
    print(name, out[f'{mod}/{asm}'])

open('data/speech-audio.js', 'w').write('// 自动生成（scripts/build-speech-audio.py），不要手改\nMBA.speechAudio = ' + json.dumps(out, ensure_ascii=False) + ';\n')
