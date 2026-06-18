from app.core.contradiction_detector import detect_contradictions


def test_no_contradiction_single_rumor():
    rumors = [
        {"id": "r1", "content": "Rinku Singh trading to CSK", "franchise": "CSK", "journalist": "Rep A"}
    ]
    res = detect_contradictions(rumors)
    assert res["has_contradiction"] is False
    assert len(res["conflicts"]) == 0


def test_contradiction_different_teams():
    rumors = [
        {"id": "r1", "content": "Rinku Singh trading to CSK", "franchise": "CSK", "journalist": "Rep A"},
        {"id": "r2", "content": "Rinku Singh trading to MI", "franchise": "MI", "journalist": "Rep B"}
    ]
    res = detect_contradictions(rumors)
    assert res["has_contradiction"] is True
    assert len(res["conflicts"]) == 1
    assert res["conflicts"][0]["reason"] == "Opposing target teams (CSK vs. MI)"


def test_contradiction_staying_vs_leaving():
    rumors = [
        {"id": "r1", "content": "Rinku Singh staying at KKR", "franchise": "KKR", "journalist": "Rep A"},
        {"id": "r2", "content": "Rinku Singh leaving KKR to join another team", "franchise": "KKR", "journalist": "Rep B"}
    ]
    res = detect_contradictions(rumors)
    assert res["has_contradiction"] is True
    assert len(res["conflicts"]) == 1
    assert "staying vs. leaving" in res["conflicts"][0]["reason"]
