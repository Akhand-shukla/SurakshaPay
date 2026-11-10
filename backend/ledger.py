"""Stage 5 — SHA-256 tamper-evident chain. Every sealed entry links to the previous.

Entry shape: {"prev": <hash of previous>, "payload": <canonical event JSON>, "hash": <sha256>}
Verifier recomputes sha256(prev + payload) for every link.
Replaying backend/ledger.journal at boot reconstructs the chain for durability.
"""
from __future__ import annotations

import hashlib
import json

GENESIS = "0" * 64


def canonical(obj) -> str:
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def seal(prev_hash: str, payload: str) -> str:
    """payload must be the canonical string being committed."""
    return hashlib.sha256((prev_hash + payload).encode("utf-8")).hexdigest()


def head(chain: list[dict]) -> str:
    return chain[-1]["hash"] if chain else GENESIS


def verify(chain: list[dict]) -> bool:
    prev = GENESIS
    for entry in chain:
        if entry.get("prev") != prev or not entry.get("payload") or not entry.get("hash"):
            return False
        if seal(entry["prev"], entry["payload"]) != entry["hash"]:
            return False
        prev = entry["hash"]
    return True
