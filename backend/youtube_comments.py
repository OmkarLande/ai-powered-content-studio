from googleapiclient.discovery import build

API_KEY = "YOUR_YOUTUBE_API_KEY"  # Replace with a valid API Key

def get_youtube_comments(video_id, max_comments=50):
    youtube = build("youtube", "v3", developerKey=API_KEY)
    comments = []

    request = youtube.commentThreads().list(
        part="snippet",
        videoId=video_id,
        maxResults=max_comments,
        textFormat="plainText"
    )
    response = request.execute()

    for item in response.get("items", []):
        comment = item["snippet"]["topLevelComment"]["snippet"]["textDisplay"]
        comments.append(comment)

    return comments
