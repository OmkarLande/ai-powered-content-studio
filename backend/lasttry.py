#AIzaSyClLd68te8NirSPdVqfc53bGXjIi278dps
import os
import re
import googleapiclient.discovery
import google.generativeai as genai
import yt_dlp
import subprocess

def extract_video_id(url):
    pattern = r"(?:v=|\/)([0-9A-Za-z_-]{11}).*"
    match = re.search(pattern, url)
    return match.group(1) if match else None

def get_video_details(video_url, api_key):
    video_id = extract_video_id(video_url)
    if not video_id:
        return None
    
    youtube = googleapiclient.discovery.build("youtube", "v3", developerKey=api_key)
    
    request = youtube.videos().list(
        part="snippet,statistics,contentDetails",
        id=video_id
    )
    response = request.execute()
    
    if "items" not in response or not response["items"]:
        return None
    
    video_data = response["items"][0]
    return {
        "title": video_data["snippet"]["title"],
        "description": video_data["snippet"]["description"],
        "views": video_data["statistics"].get("viewCount", 0),
        "likes": video_data["statistics"].get("likeCount", 0),
        "comments": video_data["statistics"].get("commentCount", 0),
        "duration": video_data["contentDetails"]["duration"],
    }
    
def get_video_comments(video_url, api_key, max_results=10):
    video_id = extract_video_id(video_url)
    if not video_id:
        return None
    
    youtube = googleapiclient.discovery.build("youtube", "v3", developerKey=api_key)
    
    request = youtube.commentThreads().list(
        part="snippet",
        videoId=video_id,
        maxResults=max_results,
        order="relevance"
    )
    response = request.execute()
    
    comments = [item["snippet"]["topLevelComment"]["snippet"]["textDisplay"] for item in response.get("items", [])]
    return comments

def analyze_sentiment(comments, gemini_api_key):
    genai.configure(api_key=gemini_api_key)
    model = genai.GenerativeModel("gemini-pro")
    
    results = {}
    for comment in comments:
        prompt = f"Classify the sentiment of this comment as Positive, Negative, or Neutral: {comment}"
        response = model.generate_content(prompt)
        sentiment = response.text.strip()
        results[comment] = sentiment
    
    return results

def identify_key_moments(comments, gemini_api_key):
    genai.configure(api_key=gemini_api_key)
    model = genai.GenerativeModel("gemini-pro")
    
    prompt = (
        "Given the following YouTube comments, determine the most discussed and engaging moments "
        "in the video. Provide approximate timestamps for the best short clips: " + str(comments)
    )
    
    response = model.generate_content(prompt)
    key_moments = response.text.strip()
    return key_moments

def download_video(video_url, output_path="video.mp4"):
    ydl_opts = {
        'format': 'bestvideo+bestaudio',
        'outtmpl': output_path,
        'merge_output_format': 'mp4',
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([video_url])
    
    return output_path

def extract_clips(video_path, timestamps, output_folder="shorts"):
    os.makedirs(output_folder, exist_ok=True)
    clips = []
    
    for i, timestamp in enumerate(timestamps):
        start_time = timestamp.strip()
        output_file = os.path.join(output_folder, f"short_{i+1}.mp4")
        
        command = [
            "ffmpeg", "-i", video_path, "-ss", start_time, "-t", "00:00:30", "-c", "copy", output_file
        ]
        subprocess.run(command, check=True)
        clips.append(output_file)
    
    return clips

# Example Usage
API_KEY = "AIzaSyClLd68te8NirSPdVqfc53bGXjIi278dps"
VIDEO_URL = "https://www.youtube.com/watch?v=BEmrsmTzuw4"
GEMINI_API_KEY = "AIzaSyCuKU4cJ80cqGTEVI5NF_1u9paxGJvzZdQ"
video_info = get_video_details(VIDEO_URL, API_KEY)
video_comments = get_video_comments(VIDEO_URL, API_KEY)
sentiment_results = analyze_sentiment(video_comments, GEMINI_API_KEY)
key_moments = identify_key_moments(video_comments, GEMINI_API_KEY)


print(video_info)
print(sentiment_results)
print(video_info)
print(video_comments)
