from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from crewai import Crew, Agent, Task
from script.text_to_audio import generate_audio
import os
import logging
import warnings

warnings.filterwarnings('ignore')
logging.getLogger("werkzeug").setLevel(logging.ERROR)

app = Flask(__name__)
CORS(app)

# Defining AI agents
planner = Agent(
    role="Content Planner",
    goal="Plan engaging and factually accurate content on {topic}",
    backstory="You're responsible for creating an outline for an article on {topic}.",
    allow_delegation=False,
    verbose=True,
    llm="mistral-small"
)

writer = Agent(
    role="Content Writer",
    goal="Write an insightful article based on the content plan.",
    backstory="You write well-structured articles following the plan provided by the planner.",
    allow_delegation=False,
    verbose=True,
    llm="mistral-small"
)

editor = Agent(
    role="Editor",
    goal="Edit the article to align with journalistic best practices.",
    backstory="You proofread and refine the article before final publication.",
    allow_delegation=False,
    verbose=True,
    llm="mistral-small"
)

# Define Tasks
plan_task = Task(
    description="Create an outline for an article on {topic}, including key points, target audience, and SEO keywords.",
    expected_output="A structured content plan.",
    agent=planner
)

write_task = Task(
    description="Write a blog post based on the content plan.",
    expected_output="A well-written blog post.",
    agent=writer
)

edit_task = Task(
    description="Edit the blog post to ensure grammatical accuracy and coherence.",
    expected_output="A polished blog post.",
    agent=editor
)

@app.route('/generate', methods=['POST'])
def generate_article():
    data = request.json
    topic = data.get("topic", "Artificial Intelligence")

    crew = Crew(agents=[planner, writer, editor], tasks=[plan_task, write_task, edit_task], verbose=True)
    result = crew.kickoff(inputs={"topic": topic})

    # Convert article text to audio
    audio_file = generate_audio(result, "article_audio.mp3")

    return jsonify({
        "article": result,
        "audio_url": f"/download-audio"
    })

@app.route('/download-audio', methods=['GET'])
def download_audio():
    return send_file("article_audio.mp3", as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
