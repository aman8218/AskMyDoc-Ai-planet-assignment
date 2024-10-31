import cloudinary # type: ignore
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()



cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key=os.getenv("CLOUD_API_KEY"),
    api_secret=os.getenv("CLOUD_API_SECRET")
)
