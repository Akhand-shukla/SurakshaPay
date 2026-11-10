"""Append-only journal store. Boot replays ledger.journal; every seal appends."""
from __future__ import annotations

import json
import threading
from pathlib import Path

from . import config

_lock = threading.Lock()

DEFAULT_POLICY = {
    "quiet_hours": {"enabled": True, "from": "21:00", "to": "09:00"},
    "discount": {"pct": 5, "cap": 200},
    "touches": {"max": 3, "window_h": 72},
    "channels": {"wa": True, "sms": False, "email": False},
}

store: dict = {
    "events": [],          # sealed payment events (API shape)
    "chain": [],           # ledger chain entries
    "policy": dict(DEFAULT_POLICY),
    "touches": {},         # phone_last4 → [timestamps]
    "seq": 78432,          # order id counter
}


def init() -> None:
    path = Path(config.LEDGER_PATH)
    if not path.exists():
        return
    with path.open("r", encoding="utf-8") as fh:
        seen: dict[str, int] = {}           # event id → index (latest replay wins)
        for line in fh:
            line = line.strip()
            if not line:
                continue
            try:
                rec = json.loads(line)
            except json.JSONDecodeError:
                continue
            if rec.get("type") == "event":
                eid = rec["data"].get("id")
                if eid in seen:
                    # re-seal (e.g. capture completing the loop) — replace, don't duplicate
                    store["events"][seen[eid]] = rec["data"]
                else:
                    seen[eid] = len(store["events"])
                    store["events"].append(rec["data"])
                store["chain"].append(rec["entry"])
                try:
                    store["seq"] = max(store["seq"], int(rec["data"]["id"].split("-")[1]))
                except (IndexError, ValueError):
                    pass
            elif rec.get("type") == "policy":
                store["policy"] = policy_merge(rec["data"])


def policy_merge(patch: dict) -> dict:
    out = {k: dict(v) for k, v in store["policy"].items()}
    for section, values in patch.items():
        if isinstance(values, dict):
            out.setdefault(section, {}).update(values)
        else:
            out[section] = values
    return out


def journal(kind: str, payload: dict) -> None:
    path = Path(config.LEDGER_PATH)
    with _lock, path.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps({"type": kind, **payload}, ensure_ascii=False) + "\n")
