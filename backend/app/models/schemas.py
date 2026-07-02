from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class Severity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    NORMAL = "normal"

class Flag(BaseModel):
    name: str = Field(..., description="The name of the metric or test, e.g., Hemoglobin.")
    value: str = Field(..., description="The user's test result value.")
    unit: Optional[str] = Field(None, description="The measurement unit, e.g., g/dL, mg/dL.")
    normal_range: str = Field(..., description="The standard healthy reference bounds.")
    severity: Severity = Field(default=Severity.NORMAL, description="Calculated urgency band.")
    plain_english: str = Field(..., description="A simple explanation of what this test variance means.")

class AnalysisResult(BaseModel):
    doc_id: str = Field(..., description="The underlying tracking identifier.")
    summary: str = Field(..., description="High level plain English synthesis of the health report.")
    flags: List[Flag] = Field(default=[], description="Extracted medical anomalies.")
    doctor_questions: List[str] = Field(default=[], description="Smart follow-up questions to help a patient talk to their provider.")
    disclaimer: str = Field(default="Please consult a qualified doctor.")