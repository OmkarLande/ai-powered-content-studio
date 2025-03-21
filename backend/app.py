import os
import warnings
from flask import Flask, request, jsonify
from crewai import Agent, Task, Crew, LLM
from flask_cors import CORS

# Suppress warnings
warnings.filterwarnings('ignore')

# Set up Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes for simplicity

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

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
