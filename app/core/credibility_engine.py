def calculate_credibility(
    journalist_reliability: float,
    additional_sources: int,
    hours_since_update: float,
    has_enough_purse: bool,
    source_boost_factor: float = 0.3,
    decay_rate_per_24h: float = 0.05
) -> float:
    """
    Calculate the credibility score (0.0 to 1.0) of an IPL transfer rumor.

    Parameters:
    - journalist_reliability: Base reliability of the reporting journalist (0.0 to 1.0).
    - additional_sources: Number of other independent sources reporting the same rumor.
    - hours_since_update: Hours passed since the rumor was last updated.
    - has_enough_purse: True if the target franchise has enough purse money, False otherwise.
    - source_boost_factor: Impact factor of additional sources on credibility.
    - decay_rate_per_24h: Decay percentage every 24 hours.

    Returns:
    - Credibility probability as a float between 0.0 and 1.0.
    """
    # Rule 4: If target Franchise does not have enough purse money left, instantly drop to 5%
    if not has_enough_purse:
        return 0.05

    # Clamp journalist reliability to [0.0, 1.0]
    r_j = max(0.0, min(1.0, journalist_reliability))

    # Rule 2: Combine journalist reliability with additional independent sources
    # Using probability of union: P = 1 - (1 - R_j) * (1 - boost)^N
    n = max(0, additional_sources)
    combined_credibility = 1.0 - (1.0 - r_j) * ((1.0 - source_boost_factor) ** n)

    # Rule 3: Apply time-decay factor (drops by 5% every 24 hours)
    days_passed = max(0.0, hours_since_update / 24.0)
    decay_multiplier = (1.0 - decay_rate_per_24h) ** days_passed
    final_credibility = combined_credibility * decay_multiplier

    # Ensure result is bounded between 0.0 and 1.0
    return max(0.0, min(1.0, final_credibility))
