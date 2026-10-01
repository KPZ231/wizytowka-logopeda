"use client";

import { CircleCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useActionState, useState, type ReactNode } from "react";
import {
  sendContact,
  type ContactField,
  type ContactState,
} from "@/app/[lang]/contact-action";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { Lottie } from "./lottie";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const MAX = 1000;

const initial: ContactState = {
  status: "idle",
  errors: [],
  failed: false,
  values: {
    name: "",
    phone: "",
    email: "",
    message: "",
    consent: false,
  },
};

const input =
  "w-full min-h-12 rounded-sm border border-border-strong bg-surface px-4 text-base text-foreground transition-colors duration-200 placeholder:text-subtle hover:border-accent focus:border-accent aria-invalid:border-danger";

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <motion.p
      id={id}
      className="mt-2 flex items-start gap-2 text-sm font-semibold text-danger"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: EASE_OUT }}
    >
      {/* ikona + tekst: błąd nigdy samym kolorem */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5M12 16.5v.01" />
      </svg>
      {children}
    </motion.p>
  );
}

/** Formularz z walidacją po stronie serwera (Server Action), animowanym błędem, ekranem sukcesu. */
export function ContactForm({ form }: { form: Dictionary["contact"]["form"] }) {
  // Zmiana key odmontowuje formularz i zeruje stan useActionState („napisz kolejną wiadomość”).
  const [resetKey, setResetKey] = useState(0);
  return (
    <FormBody
      key={resetKey}
      form={form}
      onReset={() => setResetKey((k) => k + 1)}
    />
  );
}

function FormBody({
  form,
  onReset,
}: {
  form: Dictionary["contact"]["form"];
  onReset: () => void;
}) {
  const [state, action, pending] = useActionState(sendContact, initial);
  const [length, setLength] = useState(state.values.message.length);
  const err = (f: ContactField) => state.errors.includes(f);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {state.status === "ok" ? (
        <motion.div
          key="ok"
          role="status"
          className="flex min-h-96 flex-col items-center justify-center text-center"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
        >
          <Lottie
            src="/lottie/success.json"
            className="size-28"
            fallback={
              <CircleCheck className="size-16 text-accent" strokeWidth={1.5} />
            }
          />
          <h3 className="mt-6 text-2xl font-bold text-foreground">
            {form.sentTitle}
          </h3>
          <p className="mt-2 max-w-[40ch] text-muted">{form.sentText}</p>
          <button
            type="button"
            onClick={onReset}
            className="pressable mt-8 inline-flex min-h-12 items-center rounded-full border border-border-strong px-7 font-semibold text-foreground hover:bg-accent-soft"
          >
            {form.sendAnother}
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          action={action}
          noValidate
          className="flex flex-col gap-6"
          exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
        >
          {/* Honeypot: ukryte przed ludźmi i czytnikami, boty je wypełniają */}
          <div
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
          >
            <label>
              Website
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
          </div>

          <div>
            <label
              htmlFor="cf-name"
              className="mb-2 block text-sm font-semibold text-foreground"
            >
              {form.name}
            </label>
            <input
              id="cf-name"
              name="name"
              type="text"
              autoComplete="name"
              maxLength={100}
              defaultValue={state.values.name}
              aria-invalid={err("name")}
              aria-describedby={err("name") ? "cf-name-err" : undefined}
              className={input}
            />
            {err("name") && (
              <ErrorText id="cf-name-err">{form.errors.name}</ErrorText>
            )}
          </div>

          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="cf-phone"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  {form.phone}
                </label>
                <input
                  id="cf-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength={30}
                  defaultValue={state.values.phone}
                  aria-invalid={err("contact")}
                  aria-describedby={`cf-contact-hint${err("contact") ? " cf-contact-err" : ""}`}
                  className={input}
                />
              </div>
              <div>
                <label
                  htmlFor="cf-email"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  {form.email}
                </label>
                <input
                  id="cf-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={120}
                  defaultValue={state.values.email}
                  aria-invalid={err("contact")}
                  aria-describedby={`cf-contact-hint${err("contact") ? " cf-contact-err" : ""}`}
                  className={input}
                />
              </div>
            </div>
            <p id="cf-contact-hint" className="mt-2 text-sm text-muted">
              {form.contactHint}
            </p>
            {err("contact") && (
              <ErrorText id="cf-contact-err">{form.errors.contact}</ErrorText>
            )}
          </div>

          <div>
            <label
              htmlFor="cf-message"
              className="mb-2 block text-sm font-semibold text-foreground"
            >
              {form.message}
            </label>
            <textarea
              id="cf-message"
              name="message"
              rows={5}
              maxLength={MAX}
              defaultValue={state.values.message}
              onChange={(e) => setLength(e.target.value.length)}
              aria-invalid={err("message")}
              aria-describedby={`cf-message-hint${err("message") ? " cf-message-err" : ""}`}
              className={`${input} resize-y py-3`}
            />
            <div className="mt-2 flex justify-between gap-4 text-sm text-muted">
              <p id="cf-message-hint">{form.messageHint}</p>
              <p aria-hidden="true" className="tabular-nums">
                {length}/{MAX}
              </p>
            </div>
            {err("message") && (
              <ErrorText id="cf-message-err">{form.errors.message}</ErrorText>
            )}
          </div>

          <div>
            <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
              <input
                type="checkbox"
                name="consent"
                defaultChecked={state.values.consent}
                aria-invalid={err("consent")}
                aria-describedby={err("consent") ? "cf-consent-err" : undefined}
                className="mt-0.5 size-6 shrink-0 cursor-pointer accent-violet-600"
              />
              <span>{form.consent}</span>
            </label>
            {err("consent") && (
              <ErrorText id="cf-consent-err">{form.errors.consent}</ErrorText>
            )}
          </div>

          <div aria-live="polite">
            {state.failed && (
              <ErrorText id="cf-failed">{form.failed}</ErrorText>
            )}
          </div>

          <button
            type="submit"
            disabled={pending}
            className="pressable inline-flex min-h-12 items-center justify-center gap-3 self-start rounded-full bg-accent px-7 font-semibold text-on-strong hover:bg-accent-hover disabled:opacity-70"
          >
            {pending && (
              <span
                aria-hidden="true"
                className="size-5 animate-spin rounded-full border-2 border-on-strong/40 border-t-on-strong"
              />
            )}
            {pending ? form.sending : form.send}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
