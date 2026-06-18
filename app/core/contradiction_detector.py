from typing import List, Dict, Any


def detect_contradictions(rumors: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Scans a list of rumors for a player to detect contradictory reports.
    
    Parameters:
    - rumors: A list of dicts, where each dict has:
        - id: unique identifier (str)
        - content: rumor text (str)
        - franchise: target franchise name (str)
        - journalist: reporting journalist name (str)

    Returns a dictionary with:
    - has_contradiction: bool
    - alert_message: str
    - conflicts: List[Dict[str, Any]] (containing pairs of conflicting rumor IDs/sources)
    """
    # Group rumors by player (since the input list should be pre-filtered or grouped, 
    # but to be safe we can filter here or assume they are all for the same player).
    # Let's assume the input `rumors` list contains all rumors we want to evaluate together 
    # (specifically, rumors belonging to a single player).
    if len(rumors) <= 1:
        return {"has_contradiction": False, "alert_message": "", "conflicts": []}

    staying_keywords = {"stay", "staying", "retain", "retention", "renew", "renewing", "remain", "remaining"}
    leaving_keywords = {"leave", "leaving", "trade", "trading", "transfer", "transferring", "join", "joining", "sign", "signing"}

    conflicts = []
    
    # Compare all pairs
    for i in range(len(rumors)):
        for j in range(i + 1, len(rumors)):
            r1 = rumors[i]
            r2 = rumors[j]
            
            is_conflict = False
            reason = ""
            
            # Scenario A: Contradictory target franchises
            if r1["franchise"] != r2["franchise"]:
                is_conflict = True
                reason = f"Opposing target teams ({r1['franchise']} vs. {r2['franchise']})"
                
            # Scenario B: Contradictory states (staying vs leaving/joining)
            content1_words = set(r1["content"].lower().split())
            content2_words = set(r2["content"].lower().split())
            
            has_stay1 = any(w in content1_words for w in staying_keywords)
            has_leave1 = any(w in content1_words for w in leaving_keywords)
            
            has_stay2 = any(w in content2_words for w in staying_keywords)
            has_leave2 = any(w in content2_words for w in leaving_keywords)
            
            if (has_stay1 and has_leave2) or (has_leave1 and has_stay2):
                is_conflict = True
                reason = "Conflicting report status (staying vs. leaving/trading)"

            if is_conflict:
                conflicts.append({
                    "rumor_a": r1["id"],
                    "rumor_b": r2["id"],
                    "journalist_a": r1["journalist"],
                    "journalist_b": r2["journalist"],
                    "content_a": r1["content"],
                    "content_b": r2["content"],
                    "reason": reason
                })

    if conflicts:
        # Build custom alert message using the first detected conflict for simplicity
        c = conflicts[0]
        alert_message = (
            f"Conflicting Reports: {c['journalist_a']} claims '{c['content_a']}', "
            f"while {c['journalist_b']} claims '{c['content_b']}'"
        )
        return {
            "has_contradiction": True,
            "alert_message": alert_message,
            "conflicts": conflicts
        }

    return {"has_contradiction": False, "alert_message": "", "conflicts": []}
