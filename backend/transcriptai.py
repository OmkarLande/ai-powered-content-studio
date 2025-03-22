
import streamlit as st
from crewai import Agent, Task, Crew, Process
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os
from crewai_tools import *





load_dotenv()

def create_lmstudio_llm(model, temperature):
    api_base = os.getenv('LMSTUDIO_API_BASE')
    os.environ["OPENAI_API_KEY"] = "lm-studio"
    os.environ["OPENAI_API_BASE"] = api_base
    if api_base:
        return ChatOpenAI(openai_api_key='lm-studio', openai_api_base=api_base, temperature=temperature)
    else:
        raise ValueError("LM Studio API base not set in .env file")

def create_openai_llm(model, temperature):
    safe_pop_env_var('OPENAI_API_KEY')
    safe_pop_env_var('OPENAI_API_BASE')
    load_dotenv(override=True)
    api_key = os.getenv('OPENAI_API_KEY')
    api_base = os.getenv('OPENAI_API_BASE', 'https://api.openai.com/v1/')
    if api_key:
        return ChatOpenAI(openai_api_key=api_key, openai_api_base=api_base, model_name=model, temperature=temperature)
    else:
        raise ValueError("OpenAI API key not set in .env file")


def safe_pop_env_var(key):
    try:
        os.environ.pop(key)
    except KeyError:
        pass
        
LLM_CONFIG = {
    "OpenAI": {
        "create_llm": create_openai_llm
    },
    "LM Studio": {
        "create_llm": create_lmstudio_llm
    }
}

def create_llm(provider_and_model, temperature=0.1):
    provider, model = provider_and_model.split(": ")
    create_llm_func = LLM_CONFIG.get(provider, {}).get("create_llm")
    if create_llm_func:
        return create_llm_func(model, temperature)
    else:
        raise ValueError(f"LLM provider {provider} is not recognized or not supported")

def load_agents():
    agents = [
        
Agent(
    role="Transcript Analyzer",
    backstory="You are an expert in analyzing YouTube video transcripts and extracting key information with precise timestamps.",
    goal="Extract relevant content from the YouTube video transcript and provide timestamps in hh:mm:ss format",
    allow_delegation=False,
    verbose=True,
    tools=[],
    llm=create_llm("OpenAI: gpt-4o-mini", 0.07)
)
            
    ]
    return agents

def load_tasks(agents):
    tasks = [
        
Task(
    description="1. Analyze the transcript of the YouTube video at {youtube_url}.\n2. Extract relevant content from the transcript.\n3. Ensure the timestamps for the extracted content are in hh:mm:ss format.\n4. Ensure the difference between consecutive timestamps is less than 30 seconds.\n5. Consider YouTube trends and popular topics when extracting relevant content.",
    expected_output="A list of relevant content snippets with their corresponding timestamps in hh:mm:ss format.",
    agent=next(agent for agent in agents if agent.role == "Transcript Analyzer"),
    async_execution=False
)
            
    ]
    return tasks

def main():
    st.title("Transcript Analyzer")

    agents = load_agents()
    tasks = load_tasks(agents)
    crew = Crew(
        agents=agents, 
        tasks=tasks, 
        process="sequential", 
        verbose=True, 
        memory=False, 
        cache=True, 
        max_rpm=1000,
        
    )

    youtube_url = st.text_input("Youtube_url")

    placeholders = {
        "youtube_url": youtube_url
    }
    with st.spinner("Running crew..."):
        try:
            result = crew.kickoff(inputs=placeholders)
            with st.expander("Final output", expanded=True):
                if hasattr(result, 'raw'):
                    st.write(result.raw)                
            with st.expander("Full output", expanded=False):
                st.write(result)
        except Exception as e:
            st.error(f"An error occurred: {str(e)}")

if __name__ == '__main__':
    main()
