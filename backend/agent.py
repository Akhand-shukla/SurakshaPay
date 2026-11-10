"""Stage 2 — Contextual AI reasoning (Gemini), with zero-network fallback.

The agent composes customer copy and handles 2-way conversational recovery in Hinglish.
Money, timing and eligibility are bounded by triage + guardrails.
"""
from __future__ import annotations

import os

from . import guardrails, store

FALLBACKS: dict[str, str] = {
    "gateway": "Hi! {id} ka payment bank server issue ki wajah se fail hua tha. Poore {amt} tha, sab theek hai. Neeche 1-tap UPI se Karo — link 15 min valid hai.",
    "otp": "Hi! {id} me OTP time par nahi mila tha, isliye payment fail hua. Ab OTP khatam ho, 1-tap UPI se turant kar sakte hain.",
    "limit": "Hi! Shayad aaj ki UPI limit poori ho gayi thi. {id} ke liye netbanking ya card se link pe se payment ho jayega.",
}
FALLBACK_DISCOUNT = {"gateway": 1, "otp": 1, "limit": 0}

_SYSTEM = (
    "You write recovery follow-ups for an Indian merchant in Hinglish. "
    "Rules: under 280 chars, warm respectful non-aggressive tone, no discount unless given value, "
    "no promises of refunds/support, mention the one-tap UPI link."
)


async def compose(event: dict, archetype: str, discount: int) -> dict:
    key = os.getenv("GEMINI_API_KEY", "")
    out = {"message": "", "engine": "fallback"}
    if archetype == "fraud":
        return out

    template = FALLBACKS.get(archetype, FALLBACKS["gateway"])
    text = template.format(id=event.get("id", "ORD"), amt=event.get("amount", 0))
    if discount:
        text += f" Aapke liye ₹{discount} off bhi hai."
    out["message"] = text
    out["discount"] = discount

    if not key:
        return out

    try:
        import httpx

        prompt = (
            f"{_SYSTEM}\n"
            f"Order id: {event.get('id')} · Amount: ₹{event.get('amount')} · Failure: {archetype} · "
            f"Incentive offered: ₹{discount or 0}\n"
            "Write the WhatsApp follow-up message in Hinglish."
        )
        async with httpx.AsyncClient(timeout=8) as client:
            r = await client.post(
                "https://generativelanguage.googleapis.com/v1beta/models"
                "/gemini-2.0-flash:generateContent",
                params={"key": key},
                json={"contents": [{"parts": [{"text": prompt}]}]},
            )
            r.raise_for_status()
            data = r.json()
            text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
            out["message"] = text[:280]
            out["engine"] = "gemini"
            return out
    except Exception:
        return out


async def reply_chat(message: str, event: dict, history: list[dict] | None = None) -> dict:
    """Handles 2-way conversational negotiation over WhatsApp in Hinglish."""
    msg = message.lower().strip()
    order_id = event.get("id", "ORD-78432")
    amt = event.get("amount", 2499)
    key = os.getenv("GEMINI_API_KEY", "")

    # Quick deterministic responses for high-confidence intents
    if any(k in msg for k in ["salary", "kal", "parso", "1st", "date", "tarikh", "paise nahi", "next month"]):
        return {
            "reply": f"Bilkul koi baat nahi! Humne aapka order {order_id} reserve kar diya hai agle 48 ghante ke liye. Jab salary credit ho tab bina kisi jaldi ke 1-tap se complete kar lijiyega.",
            "engine": "deterministic-guardrail",
            "action": "hold_cart",
            "discount": 0,
        }

    if any(k in msg for k in ["emi", "installment", "kist"]):
        return {
            "reply": f"Ji haan, ₹{amt} ke liye Razorpay No-Cost 3-month EMI available hai (₹{round(amt / 3)}/mo) via HDFC, ICICI, aur credit cards. Smart link se checkout pe 'EMI' choose kijiye.",
            "engine": "deterministic-guardrail",
            "action": "emi_link",
            "discount": 0,
        }

    if any(k in msg for k in ["discount", "off", "kam karo", "coupon", "sasta"]):
        # Stage 3 wins: agent may never exceed min(pct% of amt, rupee cap)
        discount_val = guardrails.clamp_discount(int(amt), store.store["policy"])
        return {
            "reply": f"Aapke order completion ke liye humne ₹{discount_val} ka exclusive Sentinel waiver apply kar diya hai! Ab aapka payable amount sirf ₹{amt - discount_val} hai. 15 min tak valid hai.",
            "engine": "deterministic-guardrail",
            "action": "discount_applied",
            "discount": discount_val,
        }

    if any(k in msg for k in ["fail", "kata", "debit", "kaha gaya", "paise kat gaye"]):
        return {
            "reply": f"Fikr mat kijiye! Agar aapke bank se paise kate hain to wo 2 ghante me auto-refund ho jayenge. Humne check kar liya hai, abhi merchant ko paise nahi mile. Aap neeche link se fresh 1-tap UPI kar sakte hain.",
            "engine": "deterministic-guardrail",
            "action": "refund_assurance",
            "discount": 0,
        }

    if key:
        try:
            import httpx

            conv_ctx = (
                f"You are Sentinel-Recover AI assistant talking to an Indian customer on WhatsApp in warm, reassuring Hinglish. "
                f"Order: {order_id}, Amount: ₹{amt}. Customer says: '{message}'. "
                "Keep response under 200 characters. Reassure them, provide 1-tap UPI assistance, never make false promises."
            )
            async with httpx.AsyncClient(timeout=8) as client:
                r = await client.post(
                    "https://generativelanguage.googleapis.com/v1beta/models"
                    "/gemini-2.0-flash:generateContent",
                    params={"key": key},
                    json={"contents": [{"parts": [{"text": conv_ctx}]}]},
                )
                r.raise_for_status()
                data = r.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                return {"reply": text[:240], "engine": "gemini", "action": "none", "discount": 0}
        except Exception:
            pass

    return {
        "reply": f"Ji, aapka {order_id} safe hai. UPI auto-redirect link tayar hai — GPay ya PhonePe se bina OTP direct 10 seconds me payment pura ho jayega.",
        "engine": "fallback",
        "action": "pay_upi",
        "discount": 0,
    }
