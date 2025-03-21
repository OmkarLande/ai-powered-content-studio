import os
import requests
from flask import Flask, request, jsonify
from youtube_comments import get_youtube_comments  # Import YouTube comments function

app = Flask(__name__)

# Notion OAuth Credentials
NOTION_CLIENT_ID = "162d872b-594c-808c-8c87-0037bfed4a05"
NOTION_CLIENT_SECRET = "secret_i1QAOAbPFmA4TNdNOS9SiFJtoLgkHswvKeSkpkojJhc"
REDIRECT_URI = "https://api.notion.com/v1/oauth/authorize?client_id=162d872b-594c-808c-8c87-0037bfed4a05&response_type=code&owner=user&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fintegrations%2Fnotion%2Foauth2callback"

ACCESS_TOKENS = {}  # Store tokens (Use a database in production)


@app.route("/notion/callback")
def notion_callback():
    """Handle Notion OAuth Callback"""
    code = request.args.get("code")
    if not code:
        return jsonify({"error": "Authorization failed"}), 400

    # Exchange code for access token
    token_url = "https://api.notion.com/v1/oauth/token"
    payload = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
        "client_id": NOTION_CLIENT_ID,
        "client_secret": NOTION_CLIENT_SECRET,
    }
    headers = {"Content-Type": "application/json"}
    response = requests.post(token_url, json=payload, headers=headers)

    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch token"}), 400

    token_data = response.json()
    access_token = token_data["access_token"]
    owner_id = token_data["owner"]["user"]["id"]  # Store per user

    # Save token (for demonstration purposes, using a dictionary)
    ACCESS_TOKENS[owner_id] = access_token

    return jsonify({"message": "Notion connected successfully", "user_id": owner_id})


@app.route("/notion/create-page", methods=["POST"])
def create_page():
    """Create a new page in a Notion database"""
    data = request.json
    user_id = data.get("user_id")
    database_id = data.get("database_id")
    title = data.get("title")

    if not user_id or not database_id or not title:
        return jsonify({"error": "Missing required fields"}), 400

    access_token = ACCESS_TOKENS.get(user_id)
    if not access_token:
        return jsonify({"error": "User not authenticated"}), 401

    notion_url = "https://api.notion.com/v1/pages"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
    }

    page_data = {
        "parent": {"database_id": database_id},
        "properties": {
            "Name": {"title": [{"text": {"content": title}}]}
        }
    }

    response = requests.post(notion_url, json=page_data, headers=headers)
    return response.json()


@app.route("/youtube/comments", methods=["GET"])
def youtube_comments():
    """Fetch YouTube comments for a given video ID"""
    video_id = request.args.get("video_id")
    
    if not video_id:
        return jsonify({"error": "Missing video_id parameter"}), 400

    try:
        comments = get_youtube_comments(video_id)
        return jsonify({"comments": comments})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
