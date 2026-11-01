import type { Therapist } from "./types";

/** WhatsApp and Gmail both work through ordinary deep links, so a visitor can
 *  finish a booking or reach the practice without a server or an SDK. */

const digits = (value: string | undefined) => (value ?? "").replace(/[^\d]/g, "");

export const whatsappNumber = (value: string | undefined) => digits(value);

/** wa.me needs a country code with no punctuation: +91 98200 44556 → 919820044556 */
export function whatsappHref(number: string | undefined, message: string): string {
  return `https://wa.me/${digits(number)}?text=${encodeURIComponent(message)}`;
}

/** Opens Gmail's compose window with the recipient, subject and body filled in. */
export function gmailHref(to: string, subject: string, body: string): string {
  const query = new URLSearchParams({ view: "cm", fs: "1", to, su: subject, body });
  return `https://mail.google.com/mail/?${query.toString()}`;
}

export interface EnquiryDetails {
  name?: string;
  service?: string;
  when?: string;
  fee?: string;
  reference?: string;
}

export function bookingEnquiry(therapist: Therapist, details: EnquiryDetails = {}): string {
  const opener = details.reference
    ? `Hi ${therapist.name}, I've just booked a session on Unfazed (reference ${details.reference}).`
    : `Hi ${therapist.name}, I'd like to book a session on Unfazed.`;

  const lines = [opener];
  if (details.name) lines.push(`Name: ${details.name}`);
  if (details.service) lines.push(`Service: ${details.service}`);
  if (details.when) lines.push(`Preferred time: ${details.when}`);
  if (details.fee) lines.push(`Fee: ${details.fee}`);
  if (!details.service && !details.when) {
    lines.push("I'd like to know what's available in the next couple of weeks.");
  }
  return lines.join("\n");
}

export function supportSubject(therapist: Therapist): string {
  return `Session enquiry · ${therapist.name}`;
}
