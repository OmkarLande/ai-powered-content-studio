from gtts import gTTS
import os

def generate_audio(text, filename="output.mp3"):
    if not text:
        raise ValueError("Text cannot be empty")
    
    tts = gTTS(text, lang='en')
    tts.save(filename)
    return filename

generate_audio("Hello, worlda tejas neet code lihi nahir late hoil ani omkar tula marel!", "hello.mp3")  # Output: hello.mp3