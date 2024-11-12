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
        {"role": "system", "content": "You are an AI assistant specialized in creating comprehensive exams for academic courses based on course outlines."},
        {"role": "user", "content": f"Generate a university-level exam for the course '{course_name}'. Use the following course outline to create relevant questions and include clear marks allocation for each question. Course outline: {course_outline}"}
    ]
    
    try:
        response = client.chat.completions.create(
            model=deployment,
            messages=prompt,
            max_tokens=1000,
            temperature=0.6
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        raise ExamGenerationError(f"Failed to generate exam: {str(e)}")

def generate_marking_scheme(exam_text):
    prompt = [
        {"role": "system", "content": "You are an AI assistant that generates detailed marking schemes for academic exams."},
        {"role": "user", "content": f"Generate a marking scheme for the following exam: {exam_text}. Include precise answers and mark allocation for each question."}
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
