import { TopBar } from "./components/TopBar";
import { Logo } from "./components/Brand";
import { Icon, Toasts, WhatsAppMark } from "./components/ui";
import { signOut, useSession } from "./lib/auth";
import { bookingEnquiry, gmailHref, supportSubject, whatsappHref } from "./lib/contact";
import { useRoute } from "./lib/routing";
import { useStore } from "./lib/store";
import { ClientPortal } from "./views/ClientPortal";
import { Landing } from "./views/Landing";
import { Login } from "./views/Login";
import { PublicBooking } from "./views/PublicBooking";
import { TherapistConsole } from "./views/TherapistConsole";

export default function App() {
  const { route } = useRoute();
  const { state, reset } = useStore();
  const session = useSession();

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <TopBar active={route.name} />
      <main id="main" className="flex-1">
        {route.name === "landing" && <Landing />}
        {route.name === "login" && <Login />}
        {route.name === "public" && <PublicBooking />}
        {route.name === "console" && (session ? <TherapistConsole /> : <Login intent="console" />)}
        {route.name === "portal" && (session ? <ClientPortal /> : <Login intent="portal" />)}
      </main>

      <footer className="mt-10 border-t border-line/80 bg-canvas/75 backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-5 px-4 py-7 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Logo />
            <p className="mt-3 max-w-[52ch] text-[11.5px] leading-relaxed text-ink-3">
              Practice software for independent therapists in India — scheduling, clinical notes,
              packages and payments in one calm console. Demonstration build; every record here is
              synthetic.
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11.5px] font-medium text-ink-2"
          >
            <a href="#/public" className="hover:text-ink">
              Book a session
            </a>
            <a
              href={whatsappHref(state.therapist.whatsapp, bookingEnquiry(state.therapist))}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-[#128c4a] hover:underline"
            >
              <WhatsAppMark className="h-3.5 w-3.5" />
              WhatsApp booking
            </a>
            <a
              href={gmailHref(
                state.therapist.supportEmail,
                supportSubject(state.therapist),
                bookingEnquiry(state.therapist),
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-ink"
            >
              <Icon name="mail" className="h-3.5 w-3.5" />
              {state.therapist.supportEmail}
            </a>
            <a href="#/console" className="hover:text-ink">
              Console
            </a>
            <a href="#/portal" className="hover:text-ink">
              Client portal
            </a>
            <a href="#/login" className="font-semibold text-[#157a4d] hover:underline">
              {session ? "Account" : "Sign in"}
            </a>
            {session && (
              <button
                type="button"
                onClick={() => {
                  signOut();
                  window.location.hash = "";
                }}
                className="text-ink-3 transition-colors hover:text-ink"
              >
                Sign out
              </button>
            )}
            <button
              type="button"
              onClick={reset}
              className="text-ink-3 transition-colors hover:text-ink"
            >
              Reset demo
            </button>
          </nav>
        </div>
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-2 border-t border-line/70 px-4 py-3 text-[10.5px] text-ink-3 sm:px-6">
          <span>© {new Date().getFullYear()} Unfazed · Practice OS</span>
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>Mumbai · Mon–Sat 9:00–18:00 IST</span>
            <a href="tel:14416" className="hover:text-ink">
              Crisis: Tele-MANAS 14416
            </a>
          </span>
          <span className="num">
            /{state.therapist.slug} · IST (Asia/Kolkata)
          </span>
        </div>
      </footer>

      <Toasts />
    </div>
  );
}
