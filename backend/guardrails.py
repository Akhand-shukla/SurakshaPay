"""Stage 3 — Compliance & financial hard-gates. Downstream clamp on the agent."""
from __future__ import annotations

from datetime import datetime
from zoneinfo import ZoneInfo

IST = ZoneInfo("Asia/Kolkata")


def _hhmm(s: str) -> int:
    h, m = s.split(":")
    return int(h) * 60 + int(m)


def in_quiet_hours(policy: dict, now: datetime | None = None) -> bool:
    """TRAI window may span midnight (e.g. 21:00 → 09:00)."""
    if not policy["quiet_hours"]["enabled"]:
        return False
    now = now or datetime.now(IST)
    cur = now.hour * 60 + now.minute
    a, b = _hhmm(policy["quiet_hours"]["from"]), _hhmm(policy["quiet_hours"]["to"])
    if a <= b:
        return a <= cur < b
    return cur >= a or cur < b


def clamp_discount(amount: int, policy: dict) -> int:
    """Offered incentive = min(policy pct of amount, rupee cap). Agent cannot exceed."""
    p = policy["discount"]
    return 0 if (p["pct"] <= 0 or p["cap"] <= 0) else min(amount * p["pct"] // 100, p["cap"])


def touches_exceeded(store: dict, phone: str, policy: dict, now: datetime | None = None) -> bool:
    stamps = store["touches"].setdefault(phone, [])
    now = now or datetime.now(IST)
    window_s = policy["touches"]["window_h"] * 3600
    live = [t for t in stamps if (now.timestamp() - t) <= window_s]
    store["touches"][phone] = live
    return len(live) >= policy["touches"]["max"]


def record_touch(store: dict, phone: str) -> None:
    store["touches"].setdefault(phone, []).append(datetime.now(IST).timestamp())


def evaluate(event: dict, archetype: str, policy: dict, store: dict) -> dict:
    """Returns the gate decision. Orchestrator must obey — no exceptions."""
    verdict = {"dispatch": False, "reason": "", "discount": 0, "scheduled_for": ""}

    if archetype == "fraud":
        verdict["reason"] = "policy:fraud_block → outreach aborted"
        return verdict

    if touches_exceeded(store, event["phone_last4"], policy):
        verdict["reason"] = "touch ceiling reached · cooldown active"
        return verdict

    if in_quiet_hours(policy):
        verdict["reason"] = "TRAI quiet hours · queued for 09:01 IST"
        verdict["scheduled_for"] = "09:01 IST"
        return verdict

    verdict["dispatch"] = True
    verdict["discount"] = clamp_discount(event["amount"], policy)
    return verdict
