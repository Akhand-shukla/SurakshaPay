# ── Sentinel-Recover backend config ─────────────────────────────────────────
# Production: set via environment / .env. Nothing is hardcoded.
import os


def _norm_origins(raw: str) -> list[str]:
    return [o.strip() for o in raw.split(",") if o.strip()]


WEBHOOK_SECRET: str = os.getenv("RAZORPAY_WEBHOOK_SECRET", "")          # HMAC verification
GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")                  # AI reasoning core
LEDGER_PATH: str = os.getenv(
    "LEDGER_PATH", os.path.join(os.path.dirname(__file__), "ledger.journal")
)          # append-only journal
CORS_ORIGINS: list[str] = _norm_origins(os.getenv("CORS_ORIGINS", "http://localhost:5173"))

# Razorpay REST (optional — smart links generated via API only when keys exist)
RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "")
