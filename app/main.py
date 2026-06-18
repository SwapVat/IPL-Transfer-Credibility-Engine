from contextlib import asynccontextmanager
from fastapi import FastAPI
from core.config import settings
from core.database import get_driver, close_driver
from api import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Neo4j driver on startup
    try:
        driver = get_driver()
        driver.verify_connectivity()
        print("Successfully connected to Neo4j database.")
    except Exception as e:
        print(f"Warning: Could not connect to Neo4j database: {e}")
    
    yield
    
    # Close Neo4j driver on shutdown
    close_driver()
    print("Closed Neo4j database connection.")


from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan,
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the API router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": f"Welcome to the {settings.PROJECT_NAME} API",
        "docs_url": "/docs"
    }
