"use client";

import { useState } from "react";
import { sendInquiry, type InquiryInput } from "./api";
import { useSite } from "./site-context";
import { trackLead } from "./track";

/* Slanje upita sa forme u admin (Upiti sa sajta). Ako server ne odgovara, nudi se rezerva:
 * e-mail program sa popunjenom porukom (kao ranije). */
export function useInquiry() {
  const { contact } = useSite();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [mailto, setMailto] = useState("");

  async function send(input: InquiryInput, fallback: { subject: string; body: string }) {
    setStatus("sending");
    setError("");
    setMailto(`mailto:${contact.email}?subject=${encodeURIComponent(fallback.subject)}&body=${encodeURIComponent(fallback.body)}`);
    try {
      await sendInquiry(input);
      trackLead(input.type, input.productName);
      setStatus("sent");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upit nije poslat.");
      setStatus("error");
    }
  }

  return { status, error, mailto, send, reset: () => setStatus("idle") };
}
