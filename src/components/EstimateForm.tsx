import { useState, useEffect, type FormEvent } from "react";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageSquare,
  Mail,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { BUSINESS, FORM_SERVICE_OPTIONS, type ServiceId } from "../lib/constants";
import { useServiceSelection } from "../context/ServiceSelectionContext";
import { useChat } from "../context/ChatContext";
import Reveal from "./Reveal";

type ContactMethod = "Phone Call" | "Text Message" | "Email";
type Status = "idle" | "submitting" | "success" | "error";

interface FormState {
  service: ServiceId | "";
  fullName: string;
  phone: string;
  email: string;
  zip: string;
  message: string;
  contactMethod: ContactMethod | "";
  company: string; // honeypot
}

const INITIAL: FormState = {
  service: "",
  fullName: "",
  phone: "",
  email: "",
  zip: "",
  message: "",
  contactMethod: "",
  company: "",
};

const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${BUSINESS.email}`;

export default function EstimateForm() {
  const { selected } = useServiceSelection();
  const { openChatWith } = useChat();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<FormState>({ ...INITIAL, service: selected ?? "" });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<Status>("idle");

  const serviceLabel = FORM_SERVICE_OPTIONS.find((o) => o.id === form.service)?.label ?? "";

  useEffect(() => {
    if (selected && selected !== form.service) {
      setForm((f) => ({ ...f, service: selected }));
      setErrors((e) => ({ ...e, service: undefined }));
      setStep(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validateStep1() {
    if (!form.service) {
      setErrors((e) => ({ ...e, service: "Please select a service." }));
      return false;
    }
    return true;
  }

  function validateStep2() {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!/^[\d()+\-.\s]{7,}$/.test(form.phone.trim())) next.phone = "Enter a valid phone number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (!/^\d{5}(-\d{4})?$/.test(form.zip.trim())) next.zip = "Enter a valid ZIP code.";
    if (!form.message.trim() || form.message.trim().length < 10)
      next.message = "Please tell us a bit about your project (10+ characters).";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  }

  function goBack() {
    setStep((s) => (s === 3 ? 2 : 1));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (form.company.trim() !== "") {
      // honeypot triggered — silently pretend success
      setStatus("success");
      return;
    }

    if (!validateStep1() || !validateStep2()) {
      setStep(!validateStep1() ? 1 : 2);
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch(FORMSUBMIT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `New Estimate Request — ${serviceLabel || "GSN Construction"}`,
          _template: "table",
          _captcha: "false",
          _honey: form.company,
          Service: serviceLabel,
          "Full Name": form.fullName,
          Phone: form.phone,
          Email: form.email,
          "ZIP Code": form.zip,
          "Project Details": form.message,
          "Preferred Contact Method": form.contactMethod || "Not specified",
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      // Hand the visitor straight into a pre-filled live chat so they get an
      // immediate response instead of just waiting on an email/call back.
      openChatWith(
        form.fullName,
        `Hi, I just requested a free estimate for ${serviceLabel || "a project"}. ${form.message}`.trim()
      );
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl bg-white border border-gray-100 shadow-elevated p-10 sm:p-14 text-center">
        <span className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 text-blue-600 mx-auto">
          <CheckCircle2 size={32} />
        </span>
        <h3 className="mt-6 font-display font-bold text-navy-900 text-2xl sm:text-3xl">Thank You!</h3>
        <p className="mt-3 text-gray-500 text-lg max-w-md mx-auto">
          We received your project information. We've also opened a live chat below — say hello
          and a team member will jump in.
        </p>
        <p className="mt-6 text-sm text-gray-500">
          Need immediate assistance? Call{" "}
          <a href={BUSINESS.phoneHref} className="font-semibold text-blue-600 hover:text-blue-700">
            {BUSINESS.phone}
          </a>{" "}
          or{" "}
          <a href={BUSINESS.phone2Href} className="font-semibold text-blue-600 hover:text-blue-700">
            {BUSINESS.phone2}
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white border border-gray-100 shadow-elevated p-6 sm:p-10">
      <div className="flex items-center gap-2 mb-8" aria-hidden="true">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 flex items-center gap-2">
            <div
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                s <= step ? "bg-blue-600" : "bg-gray-100"
              }`}
            />
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* honeypot */}
        <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
          <label htmlFor="company">Company</label>
          <input
            id="company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
          />
        </div>

        {step === 1 && (
          <fieldset>
            <legend className="font-display font-bold text-navy-900 text-xl sm:text-2xl">
              What service do you need?
            </legend>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {FORM_SERVICE_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={`cursor-pointer rounded-xl border px-4 py-3.5 text-sm font-semibold text-center transition-all ${
                    form.service === opt.id
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-[0_0_0_1px_rgba(8,102,217,0.3)]"
                      : "border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="service"
                    value={opt.id}
                    checked={form.service === opt.id}
                    onChange={() => update("service", opt.id)}
                    className="sr-only"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            {errors.service && (
              <p className="mt-3 text-sm text-red-600 flex items-center gap-1.5">
                <AlertCircle size={15} /> {errors.service}
              </p>
            )}

            <button
              type="button"
              onClick={goNext}
              className="mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 px-8 py-4 text-base font-semibold text-white transition-all hover:-translate-y-0.5"
            >
              Continue
              <ArrowRight size={18} />
            </button>
          </fieldset>
        )}

        {step === 2 && (
          <div>
            <h3 className="font-display font-bold text-navy-900 text-xl sm:text-2xl">
              Tell us about your project
            </h3>

            <div className="mt-6 grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-navy-900 mb-1.5">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  className={`w-full rounded-xl border px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-blue-500 ${
                    errors.fullName ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {errors.fullName && <p className="mt-1.5 text-xs text-red-600">{errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-navy-900 mb-1.5">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={`w-full rounded-xl border px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-blue-500 ${
                    errors.phone ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {errors.phone && <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-navy-900 mb-1.5">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={`w-full rounded-xl border px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-blue-500 ${
                    errors.email ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="zip" className="block text-sm font-semibold text-navy-900 mb-1.5">
                  ZIP Code
                </label>
                <input
                  id="zip"
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  value={form.zip}
                  onChange={(e) => update("zip", e.target.value)}
                  className={`w-full rounded-xl border px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-blue-500 ${
                    errors.zip ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {errors.zip && <p className="mt-1.5 text-xs text-red-600">{errors.zip}</p>}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-sm font-semibold text-navy-900 mb-1.5">
                  Tell us about your project
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className={`w-full rounded-xl border px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-blue-500 resize-none ${
                    errors.message ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {errors.message && <p className="mt-1.5 text-xs text-red-600">{errors.message}</p>}
              </div>

              <fieldset className="sm:col-span-2">
                <legend className="block text-sm font-semibold text-navy-900 mb-2">
                  Preferred contact method <span className="font-normal text-gray-400">(optional)</span>
                </legend>
                <div className="flex flex-wrap gap-3">
                  {(
                    [
                      { label: "Phone Call", icon: Phone },
                      { label: "Text Message", icon: MessageSquare },
                      { label: "Email", icon: Mail },
                    ] as const
                  ).map(({ label, icon: Icon }) => (
                    <label
                      key={label}
                      className={`cursor-pointer inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all ${
                        form.contactMethod === label
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 text-gray-600 hover:border-blue-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="contactMethod"
                        value={label}
                        checked={form.contactMethod === label}
                        onChange={() => update("contactMethod", label)}
                        className="sr-only"
                      />
                      <Icon size={15} />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-6 py-4 text-base font-semibold text-navy-900 hover:bg-gray-50 transition-all"
              >
                <ArrowLeft size={18} />
                Back
              </button>
              <button
                type="button"
                onClick={goNext}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 px-8 py-4 text-base font-semibold text-white transition-all hover:-translate-y-0.5"
              >
                Continue
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="font-display font-bold text-navy-900 text-xl sm:text-2xl">
              Review &amp; Submit
            </h3>
            <p className="mt-2 text-gray-500">Please confirm your details before sending.</p>

            <dl className="mt-6 divide-y divide-gray-100 rounded-xl border border-gray-100 overflow-hidden">
              {[
                ["Service", serviceLabel],
                ["Name", form.fullName],
                ["Phone", form.phone],
                ["Email", form.email],
                ["ZIP Code", form.zip],
                ["Preferred Contact", form.contactMethod || "Not specified"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 px-5 py-3.5 text-sm">
                  <dt className="text-gray-500 font-medium">{label}</dt>
                  <dd className="text-navy-900 font-semibold text-right">{value}</dd>
                </div>
              ))}
            </dl>

            {status === "error" && (
              <p className="mt-4 text-sm text-red-600 flex items-center gap-1.5" role="alert">
                <AlertCircle size={15} />
                Something went wrong sending your request. Please try again, or call{" "}
                {BUSINESS.phone} or {BUSINESS.phone2}.
              </p>
            )}

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={goBack}
                disabled={status === "submitting"}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-6 py-4 text-base font-semibold text-navy-900 hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                <ArrowLeft size={18} />
                Back
              </button>
              <button
                type="submit"
                disabled={status === "submitting"}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 px-8 py-4 text-base font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Request My Free Estimate"
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export function EstimateFormSection() {
  return (
    <section id="contact" className="bg-gray-50 py-24 sm:py-28">
      <div className="container-px mx-auto max-w-4xl">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-[0.2em] text-blue-600">GET STARTED</span>
          <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl sm:text-4xl lg:text-[2.6rem] text-balance">
            Get Your Free Estimate
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Tell us a little about your project and we&apos;ll get in touch with you.
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-12">
          <EstimateForm />
        </Reveal>
      </div>
    </section>
  );
}
