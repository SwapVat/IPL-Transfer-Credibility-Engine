from typing import Generator
from neo4j import GraphDatabase, Driver
from app.core.config import settings

_driver: Driver = None


def get_driver() -> Driver:
    """Get or initialize the global Neo4j driver."""
    global _driver
    if _driver is None:
        _driver = GraphDatabase.driver(
            settings.NEO4J_URI,
            auth=(settings.NEO4J_USERNAME, settings.NEO4J_PASSWORD)
        )
    return _driver


def close_driver() -> None:
    """Close the global Neo4j driver."""
    global _driver
    if _driver is not None:
        _driver.close()
        _driver = None


def get_db_session() -> Generator:
    """Dependency injection yield for Neo4j session."""
    driver = get_driver()
    session = driver.session()
    try:
        yield session
    finally:
        session.close()
