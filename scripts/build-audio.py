# 用微软 Edge 神经网络语音（en-GB-SoniaNeural）给跟读练习生成真人风格的 mp3，存到 audio/<sha1前12位>.mp3
# 用法：pip install edge-tts；node scripts/build-practice.mjs；python3 scripts/build-audio.py
# 已经生成过的跳过；云端环境要用代理的 CA：export TTS_CA=/root/.ccr/ca-bundle.crt
import asyncio, hashlib, json, os, ssl, subprocess, sys
import edge_tts.communicate as c
if os.environ.get('TTS_CA'):
    c._SSL_CTX = ssl.create_default_context(cafile=os.environ['TTS_CA'])
VOICE = 'en-GB-SoniaNeural'
texts = json.loads(subprocess.check_output(['node', 'scripts/list-audio-texts.mjs']))
os.makedirs('audio', exist_ok=True)
def name(t): return hashlib.sha1(t.encode('utf-8')).hexdigest()[:12] + '.mp3'
todo = [t for t in texts if not os.path.exists('audio/' + name(t))]
print(len(texts), 'texts,', len(todo), 'to generate', flush=True)
sem = asyncio.Semaphore(6); done = 0; failed = []
async def one(t):
    global done
    async with sem:
        for attempt in range(3):
            try:
                tmp = 'audio/' + name(t) + '.tmp'
                await c.Communicate(t, VOICE, rate='-5%').save(tmp)
                os.replace(tmp, 'audio/' + name(t)); break
            except Exception as e:
                if attempt == 2: failed.append((t, str(e)[:80]))
                await asyncio.sleep(2 * (attempt + 1))
        done += 1
        if done % 100 == 0: print(done, flush=True)
async def main(): await asyncio.gather(*(one(t) for t in todo))
asyncio.run(main())
print('failed', len(failed), failed[:5])
