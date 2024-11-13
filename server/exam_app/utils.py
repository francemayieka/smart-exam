import os
from openai import AzureOpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Retrieve configurations from environment variables
endpoint = os.getenv("ENDPOINT_URL")
deployment = os.getenv("DEPLOYMENT_NAME")
subscription_key = os.getenv("AZURE_OPENAI_API_KEY")
api_version = os.getenv("AZURE_OPENAI_API_VERSION")

# Initialize the Azure OpenAI client
client = AzureOpenAI(
    azure_endpoint=endpoint,
    api_key=subscription_key,
    api_version=api_version
)

# Custom exception class
class ExamGenerationError(Exception):
    """Raised for errors in generating the exam or marking scheme."""
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)

# Exam generation function
def generate_exam(course_name, course_outline):
    prompt = [
        {"role": "system", "content": "You are an AI assistant specialized in creating university-level exams without introductory phrases or multiple-choice questions."},
        {"role": "user", "content": f"Create an exam for the course '{course_name}' using the following course outline. Start directly with question 1 and do not include any introductory phrases or mark allocation. Course outline: {course_outline}"}
    ]
    
    try:
        response = client.chat.completions.create(
            model=deployment,
            messages=prompt,
            max_tokens=1000,
            temperature=0.6
        )
        # Remove any trailing or leading whitespaces and ensure the response is formatted properly
        return response.choices[0].message.content.strip()
    except Exception as e:
        raise ExamGenerationError(f"Failed to generate exam: {str(e)}")

def generate_marking_scheme(exam_text):
    prompt = [
        {"role": "system", "content": "You are an AI assistant that generates a straightforward marking scheme for academic exams without specifying mark allocations."},
        {"role": "user", "content": f"Create a clear marking scheme for the following exam. Provide simplified and direct answers to each question without specifying mark allocations. Exam: {exam_text}"}
    ]
    
    try:
        response = client.chat.completions.create(
            model=deployment,
            messages=prompt,
            max_tokens=800,
            temperature=0.5
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        raise ExamGenerationError(f"Failed to generate marking scheme: {str(e)}")
