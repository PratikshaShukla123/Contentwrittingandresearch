from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Grant Writing & Research Team"
    API_V1_STR: str = "/api/v1"
    
    # CORS setup
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # Database (Placeholder for Step 4)
    DATABASE_URL: str = "sqlite:///./test.db"
    
    # JWT settings
    SECRET_KEY: str = "supersecretkey-please-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # API Keys
    OPENAI_API_KEY: str | None = None
    GROQ_API_KEY: str | None = None
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
