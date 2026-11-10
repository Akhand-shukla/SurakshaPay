from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

Archetype = Literal["gateway", "otp", "limit", "fraud"]


class PaymentFailure(BaseModel):
    # Shape mirrors Razorpay's payment.failed webhook (subset that triage uses).
    event: Literal["payment.failed", "payment.captured"]
    order_id: str
    amount: int = Field(ge=1)                      # rupees
    contact: str                                   # raw phone; masked at ingest
    bank: str = "UNKNOWN"
    error_code: str = ""
    error_source: str = "gateway"                  # gateway | bank | customer
    error_step: str = "authorization"              # authentication | authorization
    risk_score: float = Field(default=0.0, ge=0, le=1)
    captured_event: bool = False


class SimulateIn(BaseModel):
    archetype: Archetype                           # checkout simulator fires the same pipeline
    capture: bool = False                          # also emit payment.captured to complete the loop
    amount: int = Field(default=2499, ge=1)


class PolicyIn(BaseModel):
    quiet_hours: "QuietHours"
    discount: "DiscountPolicy"
    touches: "TouchPolicy"
    channels: "Channels"


class QuietHours(BaseModel):
    enabled: bool = True
    from_: str = Field(default="21:00", alias="from", pattern=r"^\d{2}:\d{2}$")
    to: str = Field(default="09:00", pattern=r"^\d{2}:\d{2}$")

    model_config = {"populate_by_name": True}


class DiscountPolicy(BaseModel):
    pct: int = Field(default=5, ge=0, le=10)       # hard clamp: agent may offer less, never more
    cap: int = Field(default=200, ge=0)            # rupee ceiling


class TouchPolicy(BaseModel):
    max: int = Field(default=3, ge=1, le=5)
    window_h: int = Field(default=72, ge=1)


class Channels(BaseModel):
    wa: bool = True
    sms: bool = False
    email: bool = False


class ChatIn(BaseModel):
    message: str
    event: dict = Field(default_factory=dict)
    history: list[dict] = Field(default_factory=list)


class CaptureIn(BaseModel):
    order_id: str
    amount: int | None = None
    method: str = "upi_intent"


PolicyIn.model_rebuild()
