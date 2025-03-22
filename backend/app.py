import os
import re
import warnings
from flask import Flask, request, jsonify, send_file
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from crewai import Agent, Task, Crew, LLM
from flask_cors import CORS
from crewai_tools import YoutubeVideoSearchTool
from youtube_transcript_api import YouTubeTranscriptApi
import google.generativeai as genai

# Suppress warnings
warnings.filterwarnings('ignore')

# Set up Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes for simplicity

# Configure Gemini
GEMINI_API_KEY = "your-gemini-api-key"
OPENAI_API_KEY = "your-openai-api-key"

# Custom Gemini LLM Wrapper
class GeminiLLM:
    def __init__(self, model="gemini-1.5-flash", temperature=0.7):
        self.model = genai.GenerativeModel(model)
        self.temperature = temperature

    def generate(self, prompt):
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error: {str(e)}"

# Initialize LLM
llm = GeminiLLM(model="gemini-1.5-flash", temperature=0.7)

# Custom YoutubeSearchTool with Gemini
class GeminiYoutubeSearchTool(YoutubeVideoSearchTool):
    def _run(self, query):
        try:
            # Custom implementation using Gemini
            prompt = f"Analyze this YouTube video: {self.youtube_video_url}\n{query}"
            return llm.generate(prompt)
        except Exception as e:
            return f"Error: {str(e)}"

@app.route('/generate', methods=['POST', 'GET'])
def generate_content():
    data = request.get_json()
    print("Received data:", data)
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    topic = data.get("topic", "Artificial Intelligence")
    
    try:
        # Define Agents
        planner = Agent(
            role="Content Planner",
            goal=f"Plan engaging and factually accurate content on {topic}",
            backstory=f"You're working on planning a blog article about the topic: {topic}.",
            allow_delegation=False,
            verbose=True,
            llm=llm  # Use the custom Gemini LLM
        )

        writer = Agent(
            role="Content Writer",
            goal=f"Write insightful and factually accurate opinion pieces about the topic: {topic}",
            backstory=f"You're writing a new opinion piece based on the Content Planner's outline.",
            allow_delegation=False,
            verbose=True,
            llm=llm  # Use the custom Gemini LLM
        )

        editor = Agent(
            role="Editor",
            goal="Edit a given blog post to align with the writing style of the organization.",
            backstory="You're reviewing the Content Writer's work to ensure quality and accuracy.",
            allow_delegation=False,
            verbose=True,
            llm=llm  # Use the custom Gemini LLM
        )

        senior_reviewer = Agent(
            role="Senior Reviewer",
            goal="Ensure the final content meets YouTube guidelines and is suitable for publication.",
            backstory="You're an experienced content reviewer specializing in YouTube compliance, ensuring all content aligns with platform rules.",
            allow_delegation=False,
            verbose=True,
            llm=llm  # Use the custom Gemini LLM
        )

        # Define Tasks
        plan = Task(
            description=(f"1. Identify the latest trends, key players, and noteworthy news on {topic}.\n"
                         "2. Determine the target audience and their interests.\n"
                         "3. Develop a detailed content outline including an introduction, key points, and a call to action.\n"
                         "4. Include SEO keywords and relevant data or sources."),
            expected_output="A comprehensive content plan document with an outline, audience analysis, and SEO keywords.",
            agent=planner,
        )

        write = Task(
            description=(f"1. Use the content plan to craft a compelling blog post on {topic}.\n"
                         "2. Incorporate SEO keywords naturally.\n"
                         "3. Structure the post with an engaging introduction, insightful body, and a strong conclusion.\n"
                         "4. Proofread for grammatical errors and brand voice alignment."),
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

def extract_video_id(youtube_url):
    """Extracts the Video ID from a YouTube URL."""
    pattern = r"(?:v=|\/)([0-9A-Za-z_-]{11}).*"
    match = re.search(pattern, youtube_url)
    return match.group(1) if match else None

def get_youtube_transcript(video_id):
    """Fetches the transcript of a YouTube video along with timestamps."""
    try:
        return YouTubeTranscriptApi.get_transcript(video_id)
        print("Successfully fetched transcript")
    except Exception as e:
        return str(e)

@app.route('/analyze_transcript', methods=['POST'])
def analyze_transcript():
    # Log: Starting analyze_transcript endpoint
    print("Starting analyze_transcript endpoint")

    # Get input data from the request
    data = request.get_json()
    if not data:
        print("Error: No data provided in the request")
        return jsonify({"error": "No data provided"}), 400

    youtube_url = data.get("youtube_url")
    if not youtube_url:
        print("Error: Missing 'youtube_url' in request")
        return jsonify({"error": "Missing 'youtube_url' in request"}), 400

    # Extract video ID from the URL
    video_id = extract_video_id(youtube_url)
    if not video_id:
        print("Error: Invalid YouTube URL")
        return jsonify({"error": "Invalid YouTube URL"}), 400

    # Log: Extracted video ID
    print(f"Extracted video ID: {video_id}")

    # Fetch the transcript
    transcript = get_youtube_transcript(video_id)
    print("Fetched transcript")
    if isinstance(transcript, str):  # If an error occurred
        print(f"Error fetching transcript: {transcript}")
        return jsonify({"error": transcript}), 500

    # Log: Successfully fetched transcript
    print("Successfully fetched transcript")

    try:
        # Initialize the YoutubeVideoSearchTool
        print("   fetched transcript")
        youtube_search_tool = YoutubeVideoSearchTool(
            youtube_video_url=youtube_url
        )
        print("Initialized YoutubeVideoSearchTool")

        # Define the Transcript Analyzer Agent
        transcript_analyzer = Agent(
            role="Transcript Analyzer",
            goal="Extract relevant content from the YouTube video transcript and provide timestamps in hh:mm:ss format.",
            backstory="You are an expert in analyzing YouTube video transcripts and extracting key information with precise timestamps.",
            tools=[youtube_search_tool],
            verbose=True,
            llm=llm  # Use the custom Gemini LLM
        )
        print("Defined Transcript Analyzer Agent")

        # Define the Task for the Transcript Analyzer
        analyze_task = Task(
            description=(f"1. Analyze the transcript of the YouTube video at {youtube_url}.\n"
                         "2. Extract relevant content from the transcript.\n"
                         "3. Ensure the timestamps for the extracted content are in hh:mm:ss format.\n"
                         "4. Ensure the difference between consecutive timestamps is less than 30 seconds.\n"
                         "5. Consider YouTube trends and popular topics when extracting relevant content."),
            expected_output="A list of relevant content snippets with their corresponding timestamps in hh:mm:ss format.",
            agent=transcript_analyzer
        )
        print("Defined Task for Transcript Analyzer")

        # Create and run the Crew
        crew = Crew(
            agents=[transcript_analyzer],
            tasks=[analyze_task],
            verbose=True
        )
        print("Created Crew with Transcript Analyzer Agent and Task")

        # Kickoff the task
        result = crew.kickoff()
        print("Task kickoff completed successfully")

        # Return the result as JSON
        print("Returning result as JSON")
        return jsonify({"result": result})

    except Exception as e:
        print(f"Error occurred during transcript analysis: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
