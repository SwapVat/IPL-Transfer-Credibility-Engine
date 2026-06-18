import pytest
from app.core.credibility_engine import calculate_credibility


def test_base_credibility_with_no_sources_and_no_decay():
    # With 0 sources and 0 decay, credibility should be exactly journalist reliability
    assert calculate_credibility(
        journalist_reliability=0.8,
        additional_sources=0,
        hours_since_update=0.0,
        has_enough_purse=True
    ) == pytest.approx(0.8)

    assert calculate_credibility(
        journalist_reliability=0.45,
        additional_sources=0,
        hours_since_update=0.0,
        has_enough_purse=True
    ) == pytest.approx(0.45)


def test_franchise_purse_constraint():
    # If has_enough_purse is False, credibility should instantly drop to 0.05 (5%)
    assert calculate_credibility(
        journalist_reliability=0.95,
        additional_sources=5,
        hours_since_update=0.0,
        has_enough_purse=False
    ) == 0.05


def test_additional_sources_boost():
    # Base credibility = 0.5
    # With 1 additional source (boost = 0.3):
    # P = 1 - (1 - 0.5) * (1 - 0.3)^1 = 1 - 0.5 * 0.7 = 1 - 0.35 = 0.65
    assert calculate_credibility(
        journalist_reliability=0.5,
        additional_sources=1,
        hours_since_update=0.0,
        has_enough_purse=True
    ) == pytest.approx(0.65)

    # With 2 additional sources:
    # P = 1 - (1 - 0.5) * 0.7^2 = 1 - 0.5 * 0.49 = 1 - 0.245 = 0.755
    assert calculate_credibility(
        journalist_reliability=0.5,
        additional_sources=2,
        hours_since_update=0.0,
        has_enough_purse=True
    ) == pytest.approx(0.755)


def test_time_decay():
    # Base = 0.8
    # After 24 hours: 5% decay -> 0.8 * 0.95 = 0.76
    assert calculate_credibility(
        journalist_reliability=0.8,
        additional_sources=0,
        hours_since_update=24.0,
        has_enough_purse=True
    ) == pytest.approx(0.76)

    # After 48 hours: 0.8 * 0.95^2 = 0.8 * 0.9025 = 0.722
    assert calculate_credibility(
        journalist_reliability=0.8,
        additional_sources=0,
        hours_since_update=48.0,
        has_enough_purse=True
    ) == pytest.approx(0.722)
