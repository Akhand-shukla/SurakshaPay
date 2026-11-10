"""Stage 1 — Deterministic triage. Zero hallucination: pure enum/regex mapping."""

from __future__ import annotations

from .schemas import Archetype

_RULES: list[tuple[Archetype, tuple[str, ...], float]] = [
    ("gateway", ("ETX-504", "GATEWAY_TIMEOUT", "NETC-504", "504", "ETIMEOUT", "SWITCH_TIMEOUT"), 0.97),
    ("otp", ("3DS-TMO", "OTP_EXPIRED", "AUTH_TIMEOUT", "SESSION_EXPIRED", "3DS_TIMEOUT"), 0.94),
    ("limit", ("UPI-LIM", "INSUFFICIENT_FUNDS", "LIMIT_EXCEEDED", "NSDL-LIM", "DAILY_LIMIT"), 0.92),
    ("fraud", ("FRD-BLK", "FRAUD", "STOLEN_CARD", "SUSPECTED_FRAUD", "CHARGEBACK_RING"), 0.99),
]

_CODE_RE: dict[str, Archetype] = {
    "gateway": r"(504|timeout|switch)",
    "otp": r"(otp|3ds|session)",
    "limit": r"(limit|funds|ceiling)",
    "fraud": r"(fraud|stolen|ring)",
}


def classify(error_code: str, error_source: str, error_step: str, risk_score: float) -> tuple[Archetype, float]:
    code = (error_code or "").upper()
    for archetype, codes, confidence in _RULES:
        if code in codes:
            return archetype, confidence
    # fuzzy failover on code text
    import re

    for archetype, pattern in _CODE_RE.items():
        if re.search(pattern, code, re.I):
            return archetype, 0.80
    # risk-based hard path always wins over heuristic guesses
    if risk_score >= 0.80:
        return "fraud", 0.99
    if error_step == "authentication":
        return "otp", 0.72
    if error_source == "customer":
        return "limit", 0.66
    return "gateway", 0.55
