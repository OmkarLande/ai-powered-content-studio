import os
import warnings
from flask import Flask, request, jsonify, send_file
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from crewai import Agent, Task, Crew, LLM
from flask_cors import CORS
from notion_client import Client
from pymongo import MongoClient
from bson import ObjectId
import bcrypt

app = Flask(__name__)
app.secret_key = "ai-powered-monitoring"

# MongoDB Connection
client = MongoClient("mongodb+srv://admin:9QClajz7LQ8rMMyw@cluster0.jjih8.mongodb.net/")
db = client["content-creators"]
users = db["users"]

# Notion OAuth Config
NOTION_CLIENT_ID = os.getenv("NOTION_CLIENT_ID")
NOTION_CLIENT_SECRET = os.getenv("NOTION_CLIENT_SECRET")
NOTION_REDIRECT_URI = os.getenv("NOTION_REDIRECT_URI")
NOTION_AUTH_URL = "https://api.notion.com/v1/oauth/token"   

# NOTION_TOKEN = "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"
# DATABASE_ID = "test-database-1624df00ff718024a863f4410c470342"

# notion = Client(auth=NOTION_TOKEN)
 
app.config["JWT_SECRET_KEY"] = "your_secret_key"
jwt = JWTManager(app)

# Suppress warnings
warnings.filterwarnings('ignore')

# Set up Flask app
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})  # Enable CORS for localhost:5173

def hash_password(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

# Helper function to check password
def check_password(password, hashed):
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))

def create_users_collection():
    validation = {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["email", "password"],
            "properties": {
                "email": {
                    "bsonType": "string",
                    "pattern": "^.+@.+$",
                    "description": "Must be a valid email"
                },
                "password": {
                    "bsonType": "string",
                    "minLength": 8,
                    "description": "Must be a hashed password"
                },
                "notion_token": {
                    "bsonType": "string",
                    "description": "Notion access token (optional)"
                }
            }
        }
    }

    if "users" not in db.list_collection_names():
        db.create_collection("users", validator=validation)
        print("Users collection created with schema validation.")

# Run this function once
create_users_collection()

# Signup Route
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    if users.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = hash_password(password)
    user_id = users.insert_one({
        "email": email,
        "password": hashed_password,
    }).inserted_id

    return jsonify({"message": "User registered", "user_id": str(user_id)})

# Login Route
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = users.find_one({"email": email})
    if not user or not check_password(password, user["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=str(user["_id"]))
    return jsonify({"message": "Login successful", "token": access_token})

# Get User Info (Protected Route)
@app.route("/user", methods=["GET"])
@jwt_required()
def get_user():
    user_id = get_jwt_identity()
    user = users.find_one({"_id": ObjectId(user_id)}, {"password": 0})  # Exclude password
    if not user:
        return jsonify({"error": "User not found"}), 404

    user["_id"] = str(user["_id"])
    return jsonify(user)


@app.route('/generate', methods=['POST', 'GET'])
def generate_content():
    data = request.get_json()
    print("Received data:", data)
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    topic = data.get("topic", "Artificial Intelligence")
    
    # Use a fixed API key instead of expecting it from the request
    api_key = "AIzaSyCuKU4cJ80cqGTEVI5NF_1u9paxGJvzZdQ"
    
    try:
        # Set up LLM with the API key
        llm = LLM(
            model="gemini/gemini-1.5-flash-8b",
            temperature=0.7,
            api_key=api_key
        )
        
        print("LLM initialized successfully")
        
        # Define Agents
        planner = Agent(
            role="Content Planner",
            goal=f"Plan engaging and factually accurate content on {topic}",
            backstory=f"You're working on planning a blog article about the topic: {topic}.",
            allow_delegation=False,
            verbose=True,
            llm=llm
        )

        writer = Agent(
            role="Content Writer",
            goal=f"Write insightful and factually accurate opinion pieces about the topic: {topic}",
            backstory=f"You're writing a new opinion piece based on the Content Planner's outline.",
            allow_delegation=False,
            verbose=True,
            llm=llm
        )

        editor = Agent(
            role="Editor",
            goal="Edit a given blog post to align with the writing style of the organization.",
            backstory="You're reviewing the Content Writer's work to ensure quality and accuracy.",
            allow_delegation=False,
            verbose=True,
            llm=llm
        )

        senior_reviewer = Agent(
            role="Senior Reviewer",
            goal="Ensure the final content meets YouTube guidelines and is suitable for publication.",
            backstory="You're an experienced content reviewer specializing in YouTube compliance, ensuring all content aligns with platform rules.",
            allow_delegation=False,
            verbose=True,
            llm=llm
        )

        # Define Tasks
        plan = Task(
            description=(
                f"1. Identify the latest trends, key players, and noteworthy news on {topic}.\n"
                "2. Determine the target audience and their interests.\n"
                "3. Develop a detailed content outline including an introduction, key points, and a call to action.\n"
                "4. Include SEO keywords and relevant data or sources."
            ),
            expected_output="A comprehensive content plan document with an outline, audience analysis, and SEO keywords.",
            agent=planner,
        )

        write = Task(
            description=(
                f"1. Use the content plan to craft a compelling blog post on {topic}.\n"
                "2. Incorporate SEO keywords naturally.\n"
                "3. Structure the post with an engaging introduction, insightful body, and a strong conclusion.\n"
                "4. Proofread for grammatical errors and brand voice alignment."
            ),
            expected_output="A well-written blog post in markdown format, ready for publication.",
            agent=writer,
        )

        edit = Task(
            description="Proofread the blog post for grammatical errors and ensure it aligns with the brand's voice.",
            expected_output="A polished blog post ready for publication.",
            agent=editor
        )
        
        review = Task(
            description="Ensure the content complies with YouTube's content policies and is safe for publishing.",
            expected_output="A finalized article that meets YouTube's guidelines.",
            agent=senior_reviewer
        )
        
        # Create and run the Crew
        crew = Crew(
            agents=[planner, writer, editor, senior_reviewer],
            tasks=[plan, write, edit, review],
            verbose=True
        )
        
        result = crew.kickoff()
        print("Generated content successfully")
        
        return jsonify({"result": str(result)})
    
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
@app.route('/download-audio', methods=['GET'])
def download_audio():
    return send_file("article_audio.mp3", as_attachment=True)

@app.route("/connect/notion", methods=["GET"])
@jwt_required()
def connect_notion():
    user_id = get_jwt_identity()
    
    auth_url = (
        "https://api.notion.com/v1/oauth/authorize?"
        f"client_id={NOTION_CLIENT_ID}&"
        f"response_type=code&"
        f"owner=user&"
        f"redirect_uri={NOTION_REDIRECT_URI}"
    )
    return jsonify({"url": auth_url})
    
    
@app.route("/notion/callback", methods=["GET"])
def notion_callback():
    code = request.args.get("code")
    if not code:
        return jsonify({"error": "Authorization code not found"}), 400

    token_url = "https://api.notion.com/v1/oauth/token"
    headers = {"Content-Type": "application/json"}
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": NOTION_REDIRECT_URI,
        "client_id": NOTION_CLIENT_ID,
        "client_secret": NOTION_CLIENT_SECRET
    }

    response = requests.post(token_url, json=data, headers=headers)
    token_info = response.json()

    if "access_token" not in token_info:
        return jsonify({"error": "Failed to get access token"}), 400

    # Store Notion token in user DB
    user_id = get_jwt_identity()
    users.update_one({"_id": ObjectId(user_id)}, {"$set": {"notion_token": token_info["access_token"]}})

    return jsonify({"message": "Notion connected successfully!"})

    
@app.route("/send/notion", methods=["POST"])
@jwt_required()
def send_to_notion():
    user_id = get_jwt_identity()
    user = users.find_one({"_id": ObjectId(user_id)})

    if not user or not user.get("notion_token"):
        return jsonify({"error": "Notion not connected"}), 400

    notion_token = user["notion_token"]
    notion = Client(auth=notion_token)

    data = request.json
    title = data.get("title", "Untitled")
    content = data.get("content", "")

    new_page = notion.pages.create(
        parent={"database_id": DATABASE_ID},
        properties={"Name": {"title": [{"text": {"content": title}}]}},
        children=[{"object": "block", "type": "paragraph", "paragraph": {"text": [{"type": "text", "text": {"content": content}}]}}]
    )

    return jsonify({"message": "Content added", "page_id": new_page["id"]})








#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
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)