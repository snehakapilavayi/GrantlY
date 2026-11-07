import { demoFile } from "./demoFile";
import {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import {
  Routes,
  Route,
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  motion,
  MotionConfig,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  X,
  Bookmark,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Clock,
  FileText,
  Compass,
  Route as RouteIcon,
  Wallet,
  FolderOpen,
  ContactRound,
  HelpCircle,
  LogOut,
  Download,
  Upload,
  Trash2,
  CheckCheck,
  ExternalLink,
  Menu,
  RotateCcw,
  Info,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Paperclip,
} from "lucide-react";
import {
  documents,
  scholarships,
  defaultProfile,
  initialState,
  loadState,
  eligibility,
  fit,
  missing,
  deadline,
  daysLeft,
  money,
  oneAway,
  funding,
  incompatible,
  priority,
  type State,
  type Scholarship,
  type Profile,
  type Application,
} from "./domain";
type Attachment = { name: string; size: number; type: string; url: string };
type Ctx = {
  state: State;
  update: (fn: (s: State) => State, note?: string) => void;
  toast: (s: string) => void;
  attachments: Record<string, Attachment>;
  attach: (id: string, f: File) => void;
  removeAttachment: (id: string) => void;
  setModal: (m: ReactNode) => void;
};
const Context = createContext<Ctx>(null!);
const useStore = () => useContext(Context);
const date = (d: Date) =>
  d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      to="/"
      className={`logo ${light ? "light" : ""}`}
      aria-label="Grantly home"
    >
      <svg
        width="30"
        height="35"
        viewBox="0 0 30 35"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 31V12C4 6 8 3 15 3h10v9H15v19H4Z"
          stroke="currentColor"
          strokeWidth="3.5"
        />
        <path d="M15 20h11v11H15" stroke="currentColor" strokeWidth="3.5" />
      </svg>
      <span>
        grantly<span className="logo-dot">.</span>
      </span>
    </Link>
  );
}
function Button({
  children,
  onClick,
  variant = "",
  className = "",
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: string;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${variant} ${className}`}
    >
      {children}
    </button>
  );
}
function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose?: () => void;
}) {
  const { setModal } = useStore();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement;
    ref.current?.showModal();
    return () => {
      ref.current?.close();
      prev?.focus();
    };
  }, []);
  const close = () => {
    onClose?.();
    setModal(null);
  };
  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      className="dialog"
    >
      <header>
        <h2>{title}</h2>
        <button onClick={close} className="icon-btn" aria-label="Close dialog">
          <X />
        </button>
      </header>
      {children}
    </dialog>
  );
}
function Guide() {
  const { setModal } = useStore();
  return (
    <Modal title="A small guide to a big next step">
      <p>
        All providers, awards and submissions in this workspace are fictional
        demonstration data.
      </p>
      <ol className="guide-list">
        <li>
          On My Journey, open <b>One document away</b>.
        </li>
        <li>
          Prepare your income certificate in the Passport. Two opportunities
          become application-ready.
        </li>
        <li>Discover a scholarship and inspect “Why this fits”.</li>
        <li>
          Start an application. Save a draft, resume it, attach demo files and
          complete a demo submission.
        </li>
        <li>
          Add an opportunity to the Funding Plan and see your potential gap
          change.
        </li>
        <li>
          Reload. Your checklist, drafts and selections stay saved. Files must
          be reattached.
        </li>
      </ol>
      <Link to="/journey" className="btn" onClick={() => setModal(null)}>
        Let’s explore <ArrowRight size={17} />
      </Link>
    </Modal>
  );
}
function App() {
  const [state, setState] = useState<State>(loadState);
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState<ReactNode>(null);
  const [attachments, setAttachments] = useState<Record<string, Attachment>>(
    {},
  );
  const location = useLocation();
  const reduce = useReducedMotion();
  useEffect(() => {
    try {
      localStorage.setItem("grantly-v1", JSON.stringify(state));
    } catch {
      setMessage(
        "Browser storage is unavailable. Keep this tab open to retain progress.",
      );
    }
  }, [state]);
  useEffect(() => {
    if (message) {
      const id = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(id);
    }
  }, [message]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setModal(null);
  }, [location.pathname]);
  const update = (fn: (s: State) => State, note?: string) =>
    setState((s) => {
      const next = fn(s);
      return note
        ? {
            ...next,
            activity: [
              { text: note, time: new Date().toISOString() },
              ...next.activity,
            ].slice(0, 30),
          }
        : next;
    });
  const attach = (id: string, f: File) => {
    if (
      !["application/pdf", "image/png", "image/jpeg"].includes(f.type) ||
      f.size > 5 * 1024 * 1024
    ) {
      setMessage("Choose a PDF, PNG or JPG under 5 MB.");
      return;
    }
    setAttachments((a) => {
      if (a[id]) URL.revokeObjectURL(a[id].url);
      return {
        ...a,
        [id]: {
          name: f.name,
          size: f.size,
          type: f.type,
          url: URL.createObjectURL(f),
        },
      };
    });
    update(
      (s) => ({
        ...s,
        prepared: [...new Set([...s.prepared, id])],
        documentMeta: {
          ...s.documentMeta,
          [id]: { name: f.name, size: f.size, type: f.type },
        },
      }),
      `${documents[id].name} prepared.`,
    );
    setMessage("Demo file attached for this session. Checklist updated.");
  };
  const removeAttachment = (id: string) =>
    setAttachments((a) => {
      const n = { ...a };
      if (n[id]) URL.revokeObjectURL(n[id].url);
      delete n[id];
      return n;
    });
  return (
    <MotionConfig reducedMotion="user">
      <Context.Provider
        value={{
          state,
          update,
          toast: setMessage,
          attachments,
          attach,
          removeAttachment,
          setModal,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={
              location.pathname.split("/")[1] === "" ? "welcome" : "workspace"
            }
            initial={{ opacity: reduce ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: reduce ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/*" element={<Shell />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
        {modal}
        <AnimatePresence>
          {message && (
            <motion.div
              className="toast"
              role="status"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <CheckCircle2 size={20} />
              <span>{message}</span>
              <button
                aria-label="Dismiss notification"
                onClick={() => setMessage("")}
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </Context.Provider>
    </MotionConfig>
  );
}
function PassportArt({ small = false }: { small?: boolean }) {
  return (
    <div className={`passport-art ${small ? "small" : ""}`}>
      <div className="passport-top">
        <span>GRANTLY / STUDENT EDITION</span>
        <ArrowUpRight size={22} />
      </div>
      <div className="passport-door">
        <svg viewBox="0 0 140 150" fill="none" aria-hidden="true">
          <path
            d="M30 145V58C30 27 48 10 78 10h34v135"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M51 145V63c0-19 11-31 31-31h9v113M72 145V73c0-11 6-17 19-17"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="106" cy="84" r="3" fill="currentColor" />
          <path d="M6 145h128" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
      <p>
        THE FUTURE
        <br />
        IS YOURS TO
        <br />
        <i>unfold.</i>
      </p>
      <div className="passport-bottom">
        <span>
          FUNDING
          <br />
          PASSPORT
        </span>
        <span className="barcode">|||| ||||| || ||||</span>
      </div>
    </div>
  );
}
function Welcome() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 110]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-10, reduce ? -10 : 0]);
  return (
    <div className="welcome">
      <nav className="welcome-nav">
        <Logo />
        <div className="welcome-links">
          <button
            onClick={() =>
              document
                .getElementById("how")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            The approach
          </button>
          <button
            onClick={() =>
              document
                .getElementById("story")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Your journey
          </button>
        </div>
        <Link className="nav-enter" to="/journey">
          Explore the workspace <ArrowUpRight size={17} />
        </Link>
      </nav>
      <section className="welcome-hero" ref={ref}>
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="live-dot" /> A LITTLE CLARITY. A LOT OF
            POSSIBILITY.
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.7 }}
          >
            Your future
            <br />
            deserves a<br />
            <em>funding plan.</em>
            <svg
              className="headline-swish"
              viewBox="0 0 380 24"
              fill="none"
              aria-hidden="true"
            >
              <motion.path
                d="M3 18C108-4 260 0 374 11"
                stroke="#153f35"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.5, duration: 0.7 }}
              />
            </svg>
          </motion.h1>
          <p>
            Big ambitions. A clearer way forward.
            <br />
            Find scholarships that fit you, prepare with confidence,
            <br className="desktop" /> and take your next step.
          </p>
          <div className="hero-actions">
            <Link className="btn" to="/onboarding">
              Build my funding plan <ArrowUpRight size={18} />
            </Link>
            <Link className="text-link" to="/journey">
              Explore demo <ArrowRight size={18} />
            </Link>
          </div>
          <div className="hero-footnote">
            <span className="mini-avatars">
              <i>A</i>
              <i>R</i>
              <i>S</i>
            </span>
            <span>Made for the first step. And every step after.</span>
          </div>
        </div>
        <div className="hero-art">
          <svg
            className="orbit"
            viewBox="0 0 600 600"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="300"
              cy="300"
              r="256"
              stroke="#153f35"
              strokeOpacity=".15"
            />
            <circle
              cx="300"
              cy="300"
              r="190"
              stroke="#153f35"
              strokeOpacity=".1"
              strokeDasharray="4 8"
            />
            <path
              d="M45 320C180 80 440 90 555 300"
              stroke="#153f35"
              strokeOpacity=".25"
              strokeDasharray="6 8"
            />
            <circle cx="505" cy="120" r="7" fill="#153f35" />
            <path
              d="M97 103v24m-12-12h24M480 460v32m-16-16h32"
              stroke="#153f35"
              strokeWidth="1.5"
            />
          </svg>
          <motion.div
            className="hero-passport"
            style={{ y, rotate }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduce ? 0 : 0.8 }}
          >
            <PassportArt />
          </motion.div>
          <motion.div
            className="scholarship-slip"
            initial={{ opacity: 0, x: 40, rotate: 8 }}
            animate={{ opacity: 1, x: 0, rotate: 8 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="slip-title">
              <span className="provider-mark lime">u.</span>
              <span>
                ONE OPPORTUNITY.
                <br />A NEW POSSIBILITY.
              </span>
              <ArrowUpRight size={18} />
            </div>
            <h3>Udaan Scholars Grant</h3>
            <p>For your next big chapter.</p>
            <div className="slip-amount">
              ₹50,000<span>annual support</span>
            </div>
            <span className="slip-label">
              <Check size={13} /> Meets your stated criteria
            </span>
          </motion.div>
          <motion.div
            className="ready-note"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <span className="note-check">
              <Check size={19} />
            </span>
            <div>
              <b>One document. Two open doors.</b>
              <small>Your next step is closer than you think.</small>
            </div>
          </motion.div>
          <span className="art-caption">LESS GUESSWORK. MORE POSSIBILITY.</span>
        </div>
      </section>
      <div className="welcome-strip">
        <span>Find your fit.</span>
        <span className="strip-star">✳</span>
        <span>Know your next step.</span>
        <span className="strip-star">✳</span>
        <span>Fund your future.</span>
        <span className="strip-star">✳</span>
        <span>Find your fit.</span>
      </div>
      <section className="intro-section" id="how">
        <div className="eyebrow">
          01 / A DIFFERENT KIND OF SCHOLARSHIP EXPERIENCE
        </div>
        <h2>
          A long list of opportunities
          <br />
          isn’t a plan.
          <br />
          <em>A clear next step is.</em>
        </h2>
        <p>
          From “Where do I even begin?” to “I know what to do next.”
          <br />
          One connected space for your possibilities, your paperwork,
          <br />
          and your progress.
        </p>
      </section>
      <Story />
      <section className="closing">
        <div>
          <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
          <h2>
            A little support.
            <br />
            <em>A world of possibility.</em>
          </h2>
        </div>
        <Link
          to="/onboarding"
          className="circle-cta"
          aria-label="Build my funding plan"
        >
          <ArrowUpRight size={40} />
        </Link>
      </section>
      <footer className="welcome-footer">
        <Logo />
        <span>A thoughtful way forward.</span>
        <small>
          Demo experience · Fictional opportunities · No real submissions
        </small>
      </footer>
    </div>
  );
}
function Story() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  const reduce = useReducedMotion();
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [-8, 0, 8]);
  const [stage, setStage] = useState(0);
  useEffect(
    () =>
      scrollYProgress.on("change", (v) =>
        setStage(v < 0.35 ? 0 : v < 0.7 ? 1 : 2),
      ),
    [scrollYProgress],
  );
  return (
    <section className="story" id="story" ref={ref}>
      <div className="story-visual">
        <motion.div style={{ rotate: reduce ? 0 : rotate }}>
          <PassportArt small />
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.div
            className="story-caption"
            key={stage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <span className="note-check">
              <Check />
            </span>
            <div>
              <b>
                {
                  [
                    "A fit you can understand.",
                    "One document. More possibilities.",
                    "Your year, a little clearer.",
                  ][stage]
                }
              </b>
              <small>
                {
                  [
                    "Every recommendation has a reason.",
                    "Prepare once. Use across applications.",
                    "See the gap. Make a plan.",
                  ][stage]
                }
              </small>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="story-steps">
        {[
          [
            "01",
            "Discover what fits.",
            "Opportunities with reasons, not mysterious match scores. Know which criteria you meet and what still needs a closer look.",
          ],
          [
            "02",
            "Turn missing pieces into next steps.",
            "One income certificate could make two applications ready to start. Your Funding Passport connects the dots.",
          ],
          [
            "03",
            "Build a clearer funding picture.",
            "Keep the money you have separate from the support you could receive. Plan your year with the full picture.",
          ],
        ].map(([n, title, copy]) => (
          <div className="story-step" key={n}>
            <span className="eyebrow">{n} / YOUR FUTURE, UNFOLDING</span>
            <h2>{title}</h2>
            <p>{copy}</p>
            <Link to="/journey" className="text-link">
              See it in action <ArrowUpRight size={18} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
const navigation = [
  ["/journey", "My Journey", RouteIcon],
  ["/discover", "Discover", Compass],
  ["/funding", "Funding Plan", Wallet],
  ["/applications", "Applications", FolderOpen],
  ["/passport", "Funding Passport", ContactRound],
] as const;
function Shell() {
  const { state, setModal } = useStore();
  const [menu, setMenu] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const location = useLocation();
  useEffect(() => setMenu(false), [location.pathname]);
  useEffect(() => {
    if (!menu) return;
    const previous = document.activeElement as HTMLElement;
    sidebarRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    return () => previous?.focus();
  }, [menu]);
  return (
    <div className="app-shell">
      <a
        href="#main"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      <aside
        ref={sidebarRef}
        className={`sidebar ${menu ? "open" : ""}`}
        role={menu ? "dialog" : undefined}
        aria-modal={menu ? true : undefined}
        aria-label="Workspace navigation"
        onKeyDown={(e) => {
          if (!menu) return;
          if (e.key === "Escape") {
            setMenu(false);
            return;
          }
          if (e.key === "Tab") {
            const nodes = Array.from(
              sidebarRef.current?.querySelectorAll<HTMLElement>("a,button") ||
                [],
            );
            const first = nodes[0],
              last = nodes[nodes.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last?.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first?.focus();
            }
          }
        }}
      >
        <Logo />
        <div className="sidebar-label">YOUR POSSIBILITIES, ORGANIZED.</div>
        <nav aria-label="Main navigation">
          {navigation.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `side-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{label}</span>
              {label === "Discover" && <small>{scholarships.length}</small>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-quote">
            <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
              <path
                d="M15 0v30M0 15h30M4 4l22 22M4 26L26 4"
                stroke="currentColor"
              />
            </svg>
            <p>
              Big dreams.
              <br />
              <i>Small, clear steps.</i>
            </p>
          </div>
          <button className="side-link" onClick={() => setModal(<Guide />)}>
            <HelpCircle size={18} /> Demo guide <ArrowUpRight size={15} />
          </button>
          <Link className="side-link" to="/">
            <LogOut size={18} /> Back to welcome
          </Link>
          <div className="profile-mini">
            <span className="avatar">
              {state.profile.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </span>
            <div>
              <b>{state.profile.name}</b>
              <small>Your future is unfolding.</small>
            </div>
            <Link to="/passport" aria-label="Edit profile">
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <button
            className="icon-btn mobile-menu"
            aria-label="Open navigation"
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            <Menu />
          </button>
          <div className="breadcrumb">
            Your workspace <ChevronRight size={13} />
            <span>
              {navigation.find(([to]) =>
                location.pathname.startsWith(to),
              )?.[1] || "Scholarship details"}
            </span>
          </div>
          <div className="demo-badge">
            <span /> Demo workspace
          </div>
          <button
            className="icon-btn"
            aria-label="Open demo guide"
            onClick={() => setModal(<Guide />)}
          >
            <HelpCircle size={19} />
          </button>
        </header>
        <main id="main" tabIndex={-1}>
          <Routes>
            <Route path="/journey" element={<Journey />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/scholarship/:id" element={<Details />} />
            <Route
              path="/apply/:id"
              element={<Apply key={location.pathname} />}
            />
            <Route path="/funding" element={<Funding />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/passport" element={<Passport />} />
            <Route
              path="*"
              element={
                <div className="page">
                  <h1>A little detour.</h1>
                  <Link to="/journey" className="btn">
                    Return to My Journey
                  </Link>
                </div>
              }
            />
          </Routes>
        </main>
        <footer className="app-footer">
          <span>YOUR FUTURE, UNFOLDING.</span>
          <span>
            Fictional scholarships · Browser-only progress · No real submissions
          </span>
        </footer>
      </div>
      {menu && (
        <button
          className="mobile-scrim"
          aria-label="Close navigation"
          onClick={() => setMenu(false)}
        />
      )}
    </div>
  );
}
function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
function FitBadge({ s }: { s: Scholarship }) {
  const { state } = useStore();
  const f = fit(s, state.profile);
  return (
    <span
      className={`badge ${f === "met" ? "green" : f === "unknown" ? "amber" : "neutral"}`}
    >
      {f === "met" ? <Check size={12} /> : <Info size={12} />}{" "}
      {f === "met"
        ? "Meets stated criteria"
        : f === "unknown"
          ? "More information needed"
          : "Does not meet a stated criterion"}
    </span>
  );
}
function Readiness({ s }: { s: Scholarship }) {
  const { state } = useStore();
  const n = missing(s, state.prepared).length;
  return (
    <span className={`readiness ${n === 0 ? "ready" : ""}`}>
      {n === 0 ? <CheckCheck size={14} /> : <FileText size={14} />}{" "}
      {n === 0 ? "Ready to start" : `${n} document${n > 1 ? "s" : ""} missing`}
    </span>
  );
}
function SaveButton({ s }: { s: Scholarship }) {
  const { state, update, toast } = useStore();
  const saved = state.saved.includes(s.id);
  return (
    <motion.button
      aria-label={`${saved ? "Unsave" : "Save"} ${s.name}`}
      aria-pressed={saved}
      whileTap={{ scale: 0.85 }}
      onClick={() => {
        update((st) => ({
          ...st,
          saved: saved
            ? st.saved.filter((x) => x !== s.id)
            : [...st.saved, s.id],
        }));
        toast(
          saved
            ? "Removed from saved opportunities."
            : "Saved to your applications workspace.",
        );
      }}
      className={`icon-btn save-btn ${saved ? "saved" : ""}`}
    >
      <Bookmark size={19} fill={saved ? "currentColor" : "none"} />
    </motion.button>
  );
}
function Opportunity({
  s,
  compare,
  onCompare,
}: {
  s: Scholarship;
  compare?: boolean;
  onCompare?: () => void;
}) {
  const { state } = useStore();
  const left = daysLeft(s, state.seed);
  return (
    <motion.article layout className="opportunity">
      <div className={`provider-mark ${s.color}`}>{s.initials}</div>
      <div className="opportunity-main">
        <span className="provider-name">{s.provider}</span>
        <Link to={`/scholarship/${s.id}`} className="opp-title">
          {s.name} <ArrowUpRight size={16} />
        </Link>
        <div className="opp-labels">
          <FitBadge s={s} />
          <Readiness s={s} />
        </div>
      </div>
      <div className="opportunity-value">
        <b>{money(s.amount)}</b>
        <small>{s.structure.toLowerCase()} support</small>
      </div>
      <div className={`deadline ${left <= 7 ? "urgent" : ""}`}>
        <Clock size={13} />
        <span>
          {left < 0 ? "Closed" : `${left} days left`}
          <small>{date(deadline(s, state.seed))}</small>
        </span>
      </div>
      <div className="opportunity-actions">
        <SaveButton s={s} />
        {onCompare && (
          <button
            className={`compare-check ${compare ? "checked" : ""}`}
            onClick={onCompare}
            aria-pressed={compare}
            aria-label={`Compare ${s.name}`}
          >
            {compare ? <Check size={13} /> : <Plus size={13} />}
            <span>Compare</span>
          </button>
        )}
      </div>
    </motion.article>
  );
}
function FundingBar({ compact = false }: { compact?: boolean }) {
  const { state } = useStore();
  const f = funding(state);
  const cost = state.profile.cost;
  const available = Math.min(state.profile.available, cost);
  const potential = Math.min(f.potential, Math.max(0, cost - available));
  const total = cost || 1;
  return (
    <div className={`funding-bar-wrap ${compact ? "compact" : ""}`}>
      <svg
        className="funding-svg"
        viewBox="0 0 600 28"
        role="img"
        aria-label={`Education cost ${money(cost)}, available ${money(state.profile.available)}, potential support ${money(f.potential)}, potential gap ${money(f.gap)}`}
      >
        <rect width="600" height="28" rx="3" fill="#e9e9df" />
        <motion.rect
          initial={false}
          animate={{ width: (available / total) * 600 }}
          height="28"
          rx="3"
          fill="#153f35"
          tabIndex={0}
        >
          <title>Available funds: {money(state.profile.available)}</title>
        </motion.rect>
        <motion.rect
          initial={false}
          animate={{
            x: (available / total) * 600,
            width: (potential / total) * 600,
          }}
          height="28"
          fill="#b4ce61"
          tabIndex={0}
        >
          <title>Potential support if awarded: {money(f.potential)}</title>
        </motion.rect>
      </svg>
      <div className="funding-legend">
        <span>
          <i className="forest-dot" /> Available{" "}
          <b>{money(state.profile.available)}</b>
        </span>
        <span>
          <i className="lime-dot" /> Potential <b>{money(f.potential)}</b>
        </span>
        <span>
          <i className="gray-dot" /> Gap <b>{money(f.gap)}</b>
        </span>
      </div>
    </div>
  );
}
function Journey() {
  const { state } = useStore();
  const groups = oneAway(state);
  const group = groups[0];
  const ready = scholarships.filter(
    (s) =>
      fit(s, state.profile) === "met" &&
      !missing(s, state.prepared).length &&
      daysLeft(s, state.seed) >= 0,
  );
  const sorted = [...scholarships].sort(
    (a, b) => priority(b, state) - priority(a, state),
  );
  const urgent = scholarships
    .filter(
      (s) => fit(s, state.profile) === "met" && daysLeft(s, state.seed) >= 0,
    )
    .sort((a, b) => a.days - b.days)
    .slice(0, 3);
  const draft = Object.entries(state.applications).find(
    ([, a]) => a.status === "Preparing",
  );
  return (
    <div className="page journey-page">
      <PageHeading
        eyebrow="A LITTLE CLARITY. A LOT OF POSSIBILITY."
        title={
          <>
            Hello, {state.profile.name.split(" ")[0]}
            <span className="heading-star">✳</span>
          </>
        }
        description="Your next chapter starts with one clear step."
        action={
          <Link to="/passport" className="text-link">
            Your Funding Passport <ArrowUpRight size={16} />
          </Link>
        }
      />
      <div className="journey-feature">
        <section className="next-step">
          <div className="eyebrow">
            <span className="live-dot" /> YOUR NEXT BEST MOVE
          </div>
          <div className="step-copy">
            <span className="step-number">01</span>
            <h2>
              {group ? (
                <>
                  One document.
                  <br />
                  <em>
                    {group[1].length === 2
                      ? "Two"
                      : group[1].length === 1
                        ? "One"
                        : group[1].length}{" "}
                    open {group[1].length === 1 ? "door" : "doors"}.
                  </em>
                </>
              ) : (
                <>
                  You’re ready.
                  <br />
                  <em>Take the next step.</em>
                </>
              )}
            </h2>
          </div>
          <p>
            {group
              ? `Prepare your ${documents[group[0]].name.toLowerCase()} to make ${group[1].length} scholarship application${group[1].length === 1 ? "" : "s"} ready to start.`
              : `You have ${ready.length} opportunities ready to start. Choose one and make it your next chapter.`}
          </p>
          <Link
            className="btn"
            to={group ? `/passport?document=${group[0]}` : "/discover"}
          >
            {group ? "Show my next step" : "Explore ready opportunities"}{" "}
            <ArrowUpRight size={17} />
          </Link>
          <div className="step-bottom">
            <span>
              <ShieldCheck size={14} /> Clear reasons. No guesswork.
            </span>
            <span>ONE DOCUMENT AWAY</span>
          </div>
          <svg
            className="step-door"
            viewBox="0 0 180 250"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M20 250V100C20 35 60 5 130 5h45v245M50 250V104c0-45 25-70 76-70h20v216M80 250V110c0-25 18-43 50-43v183"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </section>
        <section className="journey-funding">
          <div className="section-kicker">
            YOUR YEAR, AT A GLANCE <ArrowUpRight size={16} />
          </div>
          <span className="small-label">Remaining funding gap</span>
          <div className="big-amount">
            {money(Math.max(0, state.profile.cost - state.profile.available))}
            <span>/ year</span>
          </div>
          <p>A clear starting point. Let’s build from here.</p>
          <FundingBar compact />
          <div className="funding-total">
            <span>Annual education cost</span>
            <b>{money(state.profile.cost)}</b>
          </div>
          <Link to="/funding" className="text-link">
            Build your funding plan <ArrowRight size={17} />
          </Link>
          <span className="fineprint">
            Potential awards are counted only in your plan, never as money
            received.
          </span>
        </section>
      </div>
      <div className="journey-lower">
        <div>
          <div className="section-heading">
            <div>
              <span className="eyebrow">POSSIBILITIES WORTH A CLOSER LOOK</span>
              <h2>
                Your next opportunities
                <span className="count-pill">{ready.length} ready</span>
              </h2>
            </div>
            <Link to="/discover" className="text-link">
              View all <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="opp-list">
            {sorted.slice(0, 3).map((s) => (
              <Opportunity key={s.id} s={s} />
            ))}
          </div>
          <p className="recommendation-note">
            <Info size={13} /> Prioritized by stated eligibility, document
            readiness, deadline and preparation time.
          </p>
          {draft && (
            <Link to={`/apply/${draft[0]}`} className="continue-strip">
              <span className="round-icon">
                <FolderOpen size={20} />
              </span>
              <div>
                <span className="small-label">PICK UP WHERE YOU LEFT OFF</span>
                <b>{scholarships.find((s) => s.id === draft[0])?.name}</b>
              </div>
              <span className="text-link">
                Continue draft <ArrowRight size={17} />
              </span>
            </Link>
          )}
          <div className="activity-section">
            <span className="eyebrow">SMALL STEPS, REAL PROGRESS</span>
            <h3>Recently in your journey</h3>
            {state.activity.slice(0, 3).map((a, i) => (
              <div className="activity-row" key={i}>
                <span className="activity-dot" />
                <span>{a.text}</span>
                <small>{date(new Date(a.time))}</small>
              </div>
            ))}
          </div>
        </div>
        <aside className="deadline-panel">
          <div className="section-kicker">
            ON THE HORIZON <Clock size={16} />
          </div>
          <h3>
            A little sooner.
            <br />
            <i>A little attention.</i>
          </h3>
          <p>Your approaching deadlines.</p>
          {urgent.map((s) => (
            <Link
              to={`/scholarship/${s.id}`}
              className="deadline-item"
              key={s.id}
            >
              <div className="calendar-date">
                <b>{deadline(s, state.seed).getDate()}</b>
                <span>
                  {deadline(s, state.seed).toLocaleDateString("en", {
                    month: "short",
                  })}
                </span>
              </div>
              <div>
                <b>{s.name}</b>
                <small>{daysLeft(s, state.seed)} days left</small>
              </div>
              <ArrowUpRight size={16} />
            </Link>
          ))}
          <div className="deadline-note">
            <span className="scribble-star">✳</span>
            <p>
              You don’t need to do
              <br />
              everything today.
              <br />
              <b>Just the next right thing.</b>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
function Discover() {
  const { state, toast, setModal } = useStore();
  const [query, setQuery] = useState("");
  const [course, setCourse] = useState("All");
  const [region, setRegion] = useState("All");
  const [readiness, setReadiness] = useState("All");
  const [amount, setAmount] = useState("All");
  const [closing, setClosing] = useState("All");
  const [sort, setSort] = useState("Recommended");
  const [savedOnly, setSavedOnly] = useState(false);
  const [filters, setFilters] = useState(false);
  const [compare, setCompare] = useState<string[]>([]);
  const reset = () => {
    setQuery("");
    setCourse("All");
    setRegion("All");
    setReadiness("All");
    setAmount("All");
    setClosing("All");
    setSavedOnly(false);
  };
  let results = scholarships.filter(
    (s) =>
      (s.name + " " + s.provider).toLowerCase().includes(query.toLowerCase()) &&
      (course === "All" || s.course === course) &&
      (region === "All" || s.state === region) &&
      (readiness === "All" ||
        (readiness === "Ready to start"
          ? missing(s, state.prepared).length === 0
          : readiness === "One document away"
            ? missing(s, state.prepared).length === 1 &&
              fit(s, state.profile) === "met"
            : fit(s, state.profile) === "met")) &&
      (amount === "All" || s.amount >= Number(amount)) &&
      (closing === "All" ||
        (daysLeft(s, state.seed) <= Number(closing) &&
          daysLeft(s, state.seed) >= 0)) &&
      (!savedOnly || state.saved.includes(s.id)),
  );
  results.sort((a, b) =>
    sort === "Highest amount"
      ? b.amount - a.amount
      : sort === "Closing soon"
        ? a.days - b.days
        : priority(b, state) - priority(a, state),
  );
  const filterFields = (
    <>
      <label>
        Course
        <select value={course} onChange={(e) => setCourse(e.target.value)}>
          {[
            "All",
            "Any",
            "Engineering",
            "Medicine",
            "Commerce",
            "Arts & Design",
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <label>
        Location
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          {["All", "Any", "Karnataka", "Tamil Nadu"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <label>
        Readiness
        <select
          value={readiness}
          onChange={(e) => setReadiness(e.target.value)}
        >
          {[
            "All",
            "Meets stated criteria",
            "Ready to start",
            "One document away",
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <label>
        Minimum award
        <select value={amount} onChange={(e) => setAmount(e.target.value)}>
          <option value="All">Any amount</option>
          {[30000, 50000, 70000].map((x) => (
            <option key={x} value={x}>
              {money(x)}
            </option>
          ))}
        </select>
      </label>
      <label>
        Deadline
        <select value={closing} onChange={(e) => setClosing(e.target.value)}>
          <option value="All">Any deadline</option>
          <option value="7">Within 7 days</option>
          <option value="14">Within 14 days</option>
          <option value="30">Within 30 days</option>
        </select>
      </label>
    </>
  );
  return (
    <div className="page">
      <PageHeading
        eyebrow="OPPORTUNITY, WITH A LITTLE DIRECTION."
        title={
          <>
            Find your <em>fit.</em>
          </>
        }
        description="A world of possibilities. Clear reasons for every one."
      />
      <div className="discover-intro">
        <div>
          <Compass size={22} />
          <p>
            <b>Your profile does the groundwork.</b>
            <br />
            Explore{" "}
            {
              scholarships.filter((s) => fit(s, state.profile) === "met").length
            }{" "}
            opportunities that meet your stated criteria. Selection is never
            guaranteed.
          </p>
        </div>
        <Link to="/passport" className="text-link">
          Refine your profile <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="search-toolbar">
        <div className="search-field">
          <Search size={19} />
          <input
            aria-label="Search scholarships"
            placeholder="Search a scholarship or foundation…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              className="icon-btn"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <Button variant="outline" onClick={() => setFilters(!filters)}>
          <SlidersHorizontal size={17} /> Filters{" "}
          {filters ? <ChevronDown size={16} /> : <Plus size={16} />}
        </Button>
        <button
          className={`btn ${savedOnly ? "" : "outline"}`}
          aria-pressed={savedOnly}
          onClick={() => setSavedOnly(!savedOnly)}
        >
          <Bookmark size={16} /> Saved ({state.saved.length})
        </button>
      </div>
      <AnimatePresence>
        {filters && (
          <motion.div
            className="filter-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="filter-grid">{filterFields}</div>
            <div className="filter-panel-actions">
              <button className="text-link" onClick={reset}>
                Reset filters
              </button>
              <Button onClick={() => setFilters(false)}>
                Show {results.length} opportunities <Check size={16} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="filter-chips">
        {[
          [course, setCourse],
          [region, setRegion],
          [readiness, setReadiness],
          [amount, setAmount],
          [closing, setClosing],
        ].map(
          ([v, set], i) =>
            v !== "All" && (
              <button
                key={i}
                onClick={() => (set as (s: string) => void)("All")}
              >
                {i === 3
                  ? `From ${money(Number(v))}`
                  : i === 4
                    ? `Within ${v} days`
                    : String(v)}{" "}
                <X size={13} />
              </button>
            ),
        )}
      </div>
      <div className="result-bar">
        <span>
          <b>{results.length}</b> opportunities{" "}
          <span className="muted">/ fictional demo listings</span>
        </span>
        <label>
          Sort by{" "}
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {["Recommended", "Highest amount", "Closing soon"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="opp-list discover-list">
        <AnimatePresence>
          {results.map((s) => (
            <Opportunity
              s={s}
              key={s.id}
              compare={compare.includes(s.id)}
              onCompare={() => {
                if (compare.includes(s.id))
                  setCompare(compare.filter((x) => x !== s.id));
                else if (compare.length < 3) setCompare([...compare, s.id]);
                else toast("Compare up to three opportunities at a time.");
              }}
            />
          ))}
        </AnimatePresence>
      </div>
      {!results.length && (
        <Empty
          title="A little room to explore."
          text="Try a broader search or remove a filter to see more possibilities."
          action={
            <Button onClick={reset}>
              Clear filters <RotateCcw size={16} />
            </Button>
          }
        />
      )}
      <div className="discovery-footnote">
        <ShieldCheck size={20} />
        <p>
          <b>Clarity before commitment.</b> Eligibility is based on your profile
          and the listed demo criteria. A provider would make the final
          decision.
        </p>
      </div>
      <AnimatePresence>
        {compare.length > 0 && (
          <motion.div
            className="compare-tray"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
          >
            <span>
              <b>{compare.length}</b> selected for a closer look
            </span>
            <Button
              variant="light"
              onClick={() => setModal(<Comparison ids={compare} />)}
            >
              Compare opportunities <ArrowUpRight size={17} />
            </Button>
            <button
              className="icon-btn"
              aria-label="Clear comparison"
              onClick={() => setCompare([])}
            >
              <X />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
function Comparison({ ids }: { ids: string[] }) {
  const { state } = useStore();
  return (
    <Modal title="A clearer side-by-side">
      <div className="table-scroll">
        <table className="compare-table">
          <thead>
            <tr>
              <th>At a glance</th>
              {ids.map((id) => (
                <th key={id}>{scholarships.find((s) => s.id === id)!.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              "Award",
              "Deadline",
              "Eligibility",
              "Readiness",
              "Preparation",
              "Combining awards",
            ].map((row, i) => (
              <tr key={row}>
                <th>{row}</th>
                {ids.map((id) => {
                  const s = scholarships.find((s) => s.id === id)!;
                  return (
                    <td key={id}>
                      {i === 0 ? (
                        <>
                          {money(s.amount)}
                          <small>{s.structure}</small>
                        </>
                      ) : i === 1 ? (
                        date(deadline(s, state.seed))
                      ) : i === 2 ? (
                        <FitBadge s={s} />
                      ) : i === 3 ? (
                        <Readiness s={s} />
                      ) : i === 4 ? (
                        `${s.effort} minutes`
                      ) : s.combination === "Exclusive" ? (
                        `Cannot combine with another ${s.group} award`
                      ) : s.combination === "Unknown" ? (
                        "Provider confirmation needed"
                      ) : (
                        "Combination allowed in demo"
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}
function Empty({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <svg
        width="90"
        height="90"
        viewBox="0 0 90 90"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="22"
          y="12"
          width="47"
          height="65"
          rx="2"
          fill="#ddd8f4"
          transform="rotate(8 22 12)"
        />
        <path
          d="M20 73V32c0-14 9-22 24-22h21v63H20Z"
          stroke="#153f35"
          strokeWidth="2"
        />
        <path
          d="M34 73V35c0-7 5-11 14-11h4v49M8 74h70M73 8v14m-7-7h14"
          stroke="#153f35"
          strokeWidth="2"
        />
      </svg>
      <h2>{title}</h2>
      <p>{text}</p>
      {action}
    </div>
  );
}
function Details() {
  const { state } = useStore();
  const location = useLocation();
  const id = location.pathname.split("/").pop();
  const s = scholarships.find((s) => s.id === id);
  if (!s)
    return (
      <Empty
        title="This opportunity took a detour."
        text="Let’s find your next possibility."
        action={
          <Link to="/discover" className="btn">
            Back to Discover
          </Link>
        }
      />
    );
  const left = daysLeft(s, state.seed);
  return (
    <div className="page detail-page">
      <Link to="/discover" className="text-link back-link">
        <ArrowLeft size={16} /> Back to opportunities
      </Link>
      <div className="detail-hero">
        <div>
          <span className={`provider-mark ${s.color}`}>{s.initials}</span>
          <div className="eyebrow">{s.provider} / FICTIONAL PROVIDER</div>
          <h1>{s.name}</h1>
          <p>{s.description}</p>
          <div className="detail-badges">
            <FitBadge s={s} />
            <Readiness s={s} />
          </div>
        </div>
        <div className="award-panel">
          <span className="small-label">A LITTLE SUPPORT FOR A BIG FUTURE</span>
          <div>{money(s.amount)}</div>
          <p>{s.structure} support · tuition assistance</p>
          <div className="award-deadline">
            <Clock size={16} />
            {date(deadline(s, state.seed))}{" "}
            <b>{left < 0 ? "Closed" : `${left} days left`}</b>
          </div>
          {left >= 0 ? (
            <Link to={`/apply/${s.id}`} className="btn">
              {state.applications[s.id]
                ? "Open application"
                : "Start my application"}{" "}
              <ArrowUpRight size={18} />
            </Link>
          ) : (
            <Button disabled>Applications closed</Button>
          )}
          <div className="award-secondary">
            <SaveButton s={s} />
            <PlanButton s={s} />
          </div>
          <small>Demo only. No application is sent to a provider.</small>
        </div>
      </div>
      <div className="details-grid">
        <div>
          <section className="detail-section">
            <span className="eyebrow">01 / THE REASONS, MADE CLEAR</span>
            <h2>
              Why this{" "}
              {fit(s, state.profile) === "met"
                ? "fits your profile"
                : "appears for you"}
            </h2>
            <p>
              Check each criterion against your Funding Passport. You can
              explore every opportunity, including those outside your current
              profile.
            </p>
            <div className="criteria-list">
              {eligibility(s, state.profile).map((r) => (
                <div key={r.label}>
                  <span className={`criteria-icon ${r.state}`}>
                    {r.state === "met" ? (
                      <Check size={15} />
                    ) : r.state === "unmet" ? (
                      <X size={15} />
                    ) : (
                      <HelpCircle size={15} />
                    )}
                  </span>
                  <span>{r.label}</span>
                  <small>
                    {r.state === "met"
                      ? "Met"
                      : r.state === "unmet"
                        ? "Not met"
                        : "Unknown"}
                  </small>
                </div>
              ))}
            </div>
            <p className="fineprint">
              CGPA / 10 uses a simplified ×10 conversion for this demo. Real
              providers may use institution-specific rules.
            </p>
            <Link to="/passport" className="text-link">
              Review your profile <ArrowUpRight size={16} />
            </Link>
          </section>
          <section className="detail-section">
            <span className="eyebrow">02 / GET YOUR PAPERS IN ORDER</span>
            <h2>What you’ll need</h2>
            <div className="detail-docs">
              {s.docs.map((id) => (
                <Link key={id} to={`/passport?document=${id}`}>
                  <FileText size={19} />
                  <span>{documents[id].name}</span>
                  <span
                    className={
                      state.prepared.includes(id) ? "prepared-text" : "muted"
                    }
                  >
                    {state.prepared.includes(id) ? "Prepared" : "To prepare"}
                  </span>
                  <ChevronRight size={16} />
                </Link>
              ))}
            </div>
          </section>
        </div>
        <aside>
          <section className="detail-section">
            <span className="eyebrow">03 / THE PROCESS</span>
            <h3>A clear path forward</h3>
            <ol className="process-list">
              <li>
                <b>Prepare your application</b>
                <span>
                  About {s.effort} minutes, with your documents ready.
                </span>
              </li>
              <li>
                <b>Academic and financial review</b>
                <span>
                  The fictional provider reviews the listed criteria and your
                  statement.
                </span>
              </li>
              <li>
                <b>Provider decision</b>
                <span>Meeting criteria does not guarantee selection.</span>
              </li>
            </ol>
          </section>
          <section className="combination-note">
            <Info size={19} />
            <h3>Can I combine this?</h3>
            <p>
              {s.combination === "Exclusive"
                ? "This award cannot be combined with another merit-group award in the demo. Your plan will ask you to choose one."
                : s.combination === "Unknown"
                  ? "Combination rules need provider confirmation. Your plan will label this uncertainty."
                  : "This demonstration award can be combined with other awards, subject to their restrictions."}
            </p>
            <small>
              {s.structure === "Annual"
                ? "The plan includes one annual instalment for the year being planned."
                : "The plan includes this one-time award once for the year being planned."}
            </small>
          </section>
        </aside>
      </div>
    </div>
  );
}
function PlanButton({ s }: { s: Scholarship }) {
  const { state, update, toast, setModal } = useStore();
  const selected = state.selected.includes(s.id);
  const add = (remove: string[] = []) => {
    update(
      (st) => ({
        ...st,
        selected: [...st.selected.filter((id) => !remove.includes(id)), s.id],
      }),
      `${s.name} added to your funding plan.`,
    );
    toast("Added as potential support, subject to an award.");
  };
  return (
    <Button
      variant="outline"
      onClick={() => {
        if (selected) {
          update((st) => ({
            ...st,
            selected: st.selected.filter((id) => id !== s.id),
          }));
          toast("Removed from funding plan.");
          return;
        }
        const conflicts = scholarships.filter(
          (x) => state.selected.includes(x.id) && incompatible(x, s),
        );
        if (conflicts.length)
          setModal(
            <Modal title="Choose one merit award">
              <p>
                {s.name} cannot be combined with{" "}
                {conflicts.map((x) => x.name).join(", ")}. Which opportunity
                would you like in your plan?
              </p>
              <div className="modal-actions">
                <Button variant="outline" onClick={() => setModal(null)}>
                  Keep current selection
                </Button>
                <Button
                  onClick={() => {
                    add(conflicts.map((x) => x.id));
                    setModal(null);
                  }}
                >
                  Use {s.name} instead
                </Button>
              </div>
            </Modal>,
          );
        else add();
      }}
    >
      {selected ? <Check size={16} /> : <Plus size={16} />}{" "}
      {selected ? "In your plan" : "Add to plan"}
    </Button>
  );
}
function Funding() {
  const { state, update } = useStore();
  const f = funding(state);
  const [cost, setCost] = useState(String(state.profile.cost));
  const [available, setAvailable] = useState(String(state.profile.available));
  const [error, setError] = useState("");
  const save = () => {
    const c = Number(cost),
      a = Number(available);
    if (
      !cost ||
      !available ||
      !Number.isFinite(c) ||
      !Number.isFinite(a) ||
      c <= 0 ||
      a < 0 ||
      c > 10000000 ||
      a > 10000000
    ) {
      setError(
        "Enter an education cost above ₹0 and available funds of ₹0 or more, up to ₹1 crore.",
      );
      return;
    }
    update(
      (s) => ({ ...s, profile: { ...s.profile, cost: c, available: a } }),
      "Your annual funding figures were updated.",
    );
    setError("");
  };
  return (
    <div className="page">
      <PageHeading
        eyebrow="MAKE ROOM FOR YOUR NEXT CHAPTER."
        title={
          <>
            Your year.
            <br />
            <em>A clearer picture.</em>
          </>
        }
        description="See what you have, what could help, and what’s left to plan."
      />
      <div className="funding-workspace">
        <section className="funding-main">
          <div className="section-kicker">
            YOUR ANNUAL FUNDING PICTURE <Wallet size={18} />
          </div>
          <div className="funding-gap">
            <span>Remaining potential gap</span>
            <motion.b
              key={f.gap}
              initial={{ opacity: 0.5, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {money(f.gap)}
            </motion.b>
            <p>
              {f.gap === 0
                ? "Your selected support could cover the planned year if awarded."
                : "Every considered opportunity brings the picture into focus."}
            </p>
          </div>
          <FundingBar />
          <div className="funding-breakdown">
            <div>
              <span>Annual education cost</span>
              <b>{money(state.profile.cost)}</b>
            </div>
            <div>
              <span>Funds already available</span>
              <b>− {money(state.profile.available)}</b>
            </div>
            <div>
              <span>Potential awards, if received</span>
              <b>− {money(f.potential)}</b>
            </div>
            <div className="total-row">
              <span>Remaining potential gap</span>
              <b>{money(f.gap)}</b>
            </div>
          </div>
          {f.excess > 0 && (
            <div className="inline-info">
              <Info size={17} />
              <p>
                Selected funds exceed your cost by {money(f.excess)}. The gap is
                capped at zero; actual awards may be limited to eligible
                expenses.
              </p>
            </div>
          )}
          <p className="fineprint">
            Available funds are separate from possible scholarships. Saved
            opportunities do not count here unless you add them. Recorded demo
            outcomes never become confirmed money automatically.
          </p>
        </section>
        <section className="funding-inputs">
          <span className="eyebrow">START WITH WHAT YOU KNOW</span>
          <h3>The foundations</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            <label>
              Annual education cost (₹)
              <input
                type="number"
                min="1"
                max="10000000"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                required
              />
            </label>
            <small>
              Tuition, study materials and living costs for one year.
            </small>
            <label>
              Funds already available (₹)
              <input
                type="number"
                min="0"
                max="10000000"
                value={available}
                onChange={(e) => setAvailable(e.target.value)}
                required
              />
            </label>
            <small>Savings and support you can already count on.</small>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <Button type="submit">
              Update my picture <ArrowRight size={16} />
            </Button>
          </form>
          <div className="funding-year">
            <GraduationCap size={25} />
            <p>
              <b>One academic year.</b>
              <br />
              Annual awards count once. One-time awards count once. Future
              renewals aren’t included.
            </p>
          </div>
        </section>
      </div>
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            POTENTIAL SUPPORT, THOUGHTFULLY CHOSEN
          </span>
          <h2>
            Build your mix{" "}
            <span className="count-pill">{f.selected.length} selected</span>
          </h2>
        </div>
        <Link className="text-link" to="/discover">
          Explore details <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="plan-list">
        {[...scholarships]
          .sort(
            (a, b) =>
              Number(state.selected.includes(b.id)) -
              Number(state.selected.includes(a.id)),
          )
          .map((s) => (
            <div
              className={`plan-row ${state.selected.includes(s.id) ? "selected" : ""}`}
              key={s.id}
            >
              <span className={`provider-mark ${s.color}`}>{s.initials}</span>
              <div>
                <Link to={`/scholarship/${s.id}`}>
                  {s.name} <ArrowUpRight size={14} />
                </Link>
                <small>
                  {s.structure} ·{" "}
                  {s.combination === "Unknown"
                    ? "Combination rules unconfirmed"
                    : s.combination === "Exclusive"
                      ? "Choose one merit-group award"
                      : "Can combine in demo"}
                </small>
                {fit(s, state.profile) !== "met" && (
                  <span className="plan-warning">
                    {fit(s, state.profile) === "unmet"
                      ? "A stated eligibility criterion is not met."
                      : "Eligibility needs more information."}
                  </span>
                )}
              </div>
              <b>{money(s.amount)}</b>
              <PlanButton s={s} />
            </div>
          ))}
      </div>
      {f.selected.some((s) => s.combination === "Unknown") && (
        <div className="inline-info">
          <Info size={18} />
          <p>
            Your plan includes an award with unknown combination rules. The
            potential total is provisional until a provider confirms
            compatibility.
          </p>
        </div>
      )}
    </div>
  );
}
function ProfileFields({
  value,
  onChange,
  part = 0,
}: {
  value: Profile;
  onChange: (p: Profile) => void;
  part?: number;
}) {
  const field = (key: keyof Profile, v: string | number) =>
    onChange({ ...value, [key]: v });
  return (
    <div className="profile-fields">
      {part === 0 && (
        <>
          <label>
            Your name
            <input
              value={value.name}
              onChange={(e) => field("name", e.target.value)}
              required
              maxLength={60}
              autoComplete="given-name"
            />
          </label>
          <label>
            Course
            <select
              value={value.course}
              onChange={(e) => field("course", e.target.value)}
            >
              {[
                "Engineering",
                "Medicine",
                "Commerce",
                "Arts & Design",
                "Science",
              ].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Year of study
            <select
              value={value.year}
              onChange={(e) => field("year", Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((x) => (
                <option key={x} value={x}>
                  Year {x}
                </option>
              ))}
            </select>
          </label>
          <label>
            State of residence
            <select
              value={value.state}
              onChange={(e) => field("state", e.target.value)}
            >
              {[
                "Andhra Pradesh",
                "Arunachal Pradesh",
                "Assam",
                "Bihar",
                "Chhattisgarh",
                "Goa",
                "Gujarat",
                "Haryana",
                "Himachal Pradesh",
                "Jharkhand",
                "Karnataka",
                "Kerala",
                "Madhya Pradesh",
                "Maharashtra",
                "Manipur",
                "Meghalaya",
                "Mizoram",
                "Nagaland",
                "Odisha",
                "Punjab",
                "Rajasthan",
                "Sikkim",
                "Tamil Nadu",
                "Telangana",
                "Tripura",
                "Uttar Pradesh",
                "Uttarakhand",
                "West Bengal",
                "Delhi",
                "Jammu and Kashmir",
                "Ladakh",
                "Puducherry",
                "Chandigarh",
                "Andaman and Nicobar Islands",
                "Dadra and Nagar Haveli and Daman and Diu",
                "Lakshadweep",
              ].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Institution type
            <select
              value={value.institution}
              onChange={(e) => field("institution", e.target.value)}
            >
              <option>Public</option>
              <option>Private</option>
            </select>
          </label>
        </>
      )}
      {part === 1 && (
        <>
          <label>
            Academic score scale
            <select
              value={value.scale}
              onChange={(e) =>
                onChange({
                  ...value,
                  scale: e.target.value as Profile["scale"],
                  score: e.target.value === "Percentage" ? 82 : 8.2,
                })
              }
            >
              <option>Percentage</option>
              <option>CGPA / 10</option>
            </select>
          </label>
          <label>
            {value.scale === "Percentage"
              ? "Academic score (%)"
              : "CGPA (out of 10)"}
            <input
              type="number"
              min="0"
              max={value.scale === "Percentage" ? 100 : 10}
              step="0.01"
              value={value.score}
              onChange={(e) => field("score", Number(e.target.value))}
              required
            />
            <small>
              {value.scale === "CGPA / 10"
                ? "Demo conversion: CGPA × 10. Real providers may use different rules."
                : "Use your latest completed academic year or semester."}
            </small>
          </label>
          <label>
            Annual household income range
            <select
              value={
                [100000, 200000, 300000, 400000, 500000, 600000, 1000000].find(
                  (x) => x >= value.income,
                ) || 1000000
              }
              onChange={(e) => field("income", Number(e.target.value))}
            >
              {[100000, 200000, 300000, 400000, 500000, 600000].map((x) => (
                <option value={x} key={x}>
                  Up to {money(x)}
                </option>
              ))}
              <option value={1000000}>Above ₹6,00,000</option>
            </select>
            <small>
              For range-based matching, we use the upper end of your range.
            </small>
          </label>
          <label>
            First-generation college student?{" "}
            <span className="optional">Optional</span>
            <select
              value={value.firstGen}
              onChange={(e) => field("firstGen", e.target.value)}
            >
              <option>Yes</option>
              <option>No</option>
              <option>Prefer not to say</option>
            </select>
            <small>
              Some awards support the first person in a family to attend
              college. Skip this if you prefer.
            </small>
          </label>
        </>
      )}
      {part === 2 && (
        <>
          <label>
            Annual education cost (₹)
            <input
              type="number"
              min="1"
              max="10000000"
              value={value.cost}
              onChange={(e) => field("cost", Number(e.target.value))}
              required
            />
            <small>
              Include tuition, books and living costs for one academic year.
            </small>
          </label>
          <label>
            Funds already available (₹)
            <input
              type="number"
              min="0"
              max="10000000"
              value={value.available}
              onChange={(e) => field("available", Number(e.target.value))}
              required
            />
            <small>
              Money you can already count on, such as savings or family support.
            </small>
          </label>
        </>
      )}
    </div>
  );
}
function ProfileEditor() {
  const { state, update, setModal, toast } = useStore();
  const [p, setP] = useState(state.profile);
  return (
    <Modal title="Your profile, in your words">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!p.name.trim()) return;
          update(
            (s) => ({ ...s, profile: { ...p, name: p.name.trim() } }),
            "Your Funding Passport profile was updated.",
          );
          setModal(null);
          toast("Profile saved. Eligibility and recommendations recalculated.");
        }}
      >
        <ProfileFields value={p} onChange={setP} />
        <ProfileFields value={p} onChange={setP} part={1} />
        <ProfileFields value={p} onChange={setP} part={2} />
        <div className="modal-actions">
          <Button variant="outline" onClick={() => setModal(null)}>
            Cancel
          </Button>
          <Button type="submit">
            Save profile <Check size={16} />
          </Button>
        </div>
      </form>
    </Modal>
  );
}
function Onboarding() {
  const { state, update } = useStore();
  const [p, setP] = useState<Profile>({
    ...defaultProfile,
    name: "",
    firstGen: "Prefer not to say",
  });
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const titles = [
    "Let’s start with you.",
    "A little more context.",
    "Make your year clearer.",
  ];
  return (
    <div className="onboarding">
      <header>
        <Logo />
        <Link className="text-link" to="/journey">
          Skip to demo <ArrowUpRight size={16} />
        </Link>
      </header>
      <div className="onboarding-layout">
        <aside>
          <span className="eyebrow">YOUR FUTURE, UNFOLDING.</span>
          <h1>
            Big dreams.
            <br />
            <em>
              A clear
              <br />
              starting point.
            </em>
          </h1>
          <p>
            A few details help us make your opportunities more relevant. You can
            change everything later.
          </p>
          <PassportArt small />
          <span className="fineprint">
            Browser-only demo. No real application is submitted.
          </span>
        </aside>
        <section className="onboarding-form">
          <div className="step-indicator">
            {[0, 1, 2].map((n) => (
              <span className={n <= step ? "active" : ""} key={n} />
            ))}
          </div>
          <span className="eyebrow">
            STEP {step + 1} OF 3 /{" "}
            {["YOUR EDUCATION", "YOUR CONTEXT", "YOUR FUNDING"][step]}
          </span>
          <h2>{titles[step]}</h2>
          <p>
            {
              [
                "No paperwork yet. Just the basics.",
                "Only share what you feel comfortable sharing.",
                "A starting estimate is a perfectly good start.",
              ][step]
            }
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (step < 2) setStep(step + 1);
              else {
                update(
                  (s) => ({
                    ...s,
                    profile: { ...p, name: p.name.trim() },
                    selected: [],
                  }),
                  "We found your starting point. Your personalized journey is ready.",
                );
                navigate("/journey");
              }
            }}
          >
            <ProfileFields value={p} onChange={setP} part={step} />
            <div className="onboarding-actions">
              {step > 0 ? (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  <ArrowLeft size={16} /> Back
                </Button>
              ) : (
                <Link to="/" className="text-link">
                  <ArrowLeft size={16} /> Back
                </Link>
              )}
              <Button type="submit">
                {step === 2 ? "Find my starting point" : "Continue"}{" "}
                <ArrowRight size={16} />
              </Button>
            </div>
          </form>
          <div className="privacy-note">
            <ShieldCheck size={17} />
            <span>
              Your profile stays in this browser. No Aadhaar, bank account or
              sensitive identity numbers needed.
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
function Passport() {
  const {
    state,
    update,
    toast,
    setModal,
    attachments,
    attach,
    removeAttachment,
  } = useStore();
  const search = useLocation().search;
  const focusId = new URLSearchParams(search).get("document");
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (focusId)
        refs.current[focusId]?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
          block: "center",
        });
    });
    return () => cancelAnimationFrame(frame);
  }, [focusId]);
  const groups = oneAway(state);
  return (
    <div className="page">
      <PageHeading
        eyebrow="PREPARE ONCE. OPEN MORE DOORS."
        title={
          <>
            Your Funding
            <br />
            <em>Passport.</em>
          </>
        }
        description="A little organization now. A simpler next application."
        action={
          <Button variant="outline" onClick={() => setModal(<ProfileEditor />)}>
            Edit my profile <ArrowUpRight size={16} />
          </Button>
        }
      />
      <div className="passport-profile">
        <div className="passport-identity">
          <span className="small-label">GRANTLY / STUDENT EDITION</span>
          <h2>{state.profile.name}</h2>
          <p>
            {state.profile.course} · Year {state.profile.year}
            <br />
            {state.profile.state} · {state.profile.institution} institution
          </p>
          <div className="passport-identity-footer">
            <span>YOUR POSSIBILITIES START HERE</span>
            <span className="barcode">|||| ||||| || ||||</span>
          </div>
        </div>
        <div className="passport-facts">
          <div>
            <span>Academic score</span>
            <b>
              {state.profile.score}
              {state.profile.scale === "Percentage" ? "%" : " / 10"}
            </b>
          </div>
          <div>
            <span>Annual household income</span>
            <b>{money(state.profile.income)}</b>
          </div>
          <div>
            <span>Annual education cost</span>
            <b>{money(state.profile.cost)}</b>
          </div>
          <div>
            <span>Funds already available</span>
            <b>{money(state.profile.available)}</b>
          </div>
        </div>
      </div>
      {groups.length > 0 && (
        <section className="one-away-panel">
          <Sparkles size={25} />
          <div>
            <span className="eyebrow">ONE DOCUMENT AWAY</span>
            <h3>One small task. More possibilities.</h3>
            {groups.map(([id, ss]) => (
              <p key={id}>
                <button
                  className="inline-link"
                  onClick={() =>
                    refs.current[id]?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    })
                  }
                >
                  Prepare your {documents[id].name.toLowerCase()}
                </button>{" "}
                to make{" "}
                <b>
                  {ss.length} application{ss.length === 1 ? "" : "s"}
                </b>{" "}
                ready: {ss.map((s) => s.name).join(" and ")}.
              </p>
            ))}
          </div>
        </section>
      )}
      <div className="section-heading">
        <div>
          <span className="eyebrow">YOUR REUSABLE DOCUMENT CHECKLIST</span>
          <h2>Good things, in order.</h2>
        </div>
        <span className="count-pill">
          {state.prepared.filter((id) => documents[id]).length} /{" "}
          {Object.keys(documents).length} prepared
        </span>
      </div>
      <p className="document-disclaimer">
        Demo uploads stay in this browser session. Only checklist details are
        saved. Please use sample files, never sensitive personal documents.
      </p>
      <div className="document-list">
        {Object.entries(documents).map(([id, d]) => {
          const prepared = state.prepared.includes(id),
            a = attachments[id];
          const ss = scholarships.filter((s) => s.docs.includes(id));
          return (
            <div
              id={`doc-${id}`}
              ref={(el) => {
                refs.current[id] = el;
              }}
              className={`document-row ${prepared ? "is-prepared" : ""} ${focusId === id ? "highlighted" : ""}`}
              key={id}
            >
              <div className="doc-row-head">
                <span className="doc-icon">
                  <FileText size={23} />
                </span>
                <div>
                  <h3>{d.name}</h3>
                  <p>{d.help}</p>
                </div>
                {prepared && (
                  <motion.span
                    key="prepared"
                    initial={{ scale: 1.3, rotate: -12, opacity: 0 }}
                    animate={{ scale: 1, rotate: -6, opacity: 1 }}
                    className="prepared-stamp"
                  >
                    <Check size={12} /> PREPARED
                  </motion.span>
                )}
              </div>
              <div className="document-used">
                Used by {ss.length} opportunities{" "}
                <div>
                  {ss.slice(0, 3).map((s) => (
                    <Link to={`/scholarship/${s.id}`} key={s.id}>
                      {s.name} <ArrowUpRight size={12} />
                    </Link>
                  ))}
                  {ss.length > 3 && <span>+{ss.length - 3} more</span>}
                </div>
              </div>
              <div className="document-controls">
                <label className="btn outline upload-label">
                  <Upload size={15} />
                  {a ? "Replace demo file" : "Attach demo file"}
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) attach(id, f);
                      e.target.value = "";
                    }}
                  />
                </label>
                <Button
                  variant={prepared ? "ghost" : "outline"}
                  onClick={() => {
                    const affected =
                      oneAway(state).find(([d]) => d === id)?.[1].length || 0;
                    update(
                      (s) => ({
                        ...s,
                        prepared: prepared
                          ? s.prepared.filter((x) => x !== id)
                          : [...s.prepared, id],
                      }),
                      `${d.name} ${prepared ? "marked to prepare" : "marked prepared"}.`,
                    );
                    if (prepared) removeAttachment(id);
                    toast(
                      prepared
                        ? "Checklist updated. Related readiness recalculated."
                        : `${d.name} prepared.${affected ? ` ${affected} applications are now ready to start.` : ""}`,
                    );
                  }}
                >
                  {prepared ? <RotateCcw size={14} /> : <Check size={14} />}{" "}
                  {prepared ? "Mark to prepare" : "Mark prepared"}
                </Button>
                {a ? (
                  <div className="attached-file">
                    <Paperclip size={13} />
                    <a href={a.url} target="_blank" rel="noreferrer">
                      {a.name}
                    </a>
                    <small>{(a.size / 1024).toFixed(0)} KB</small>
                    <button
                      className="icon-btn"
                      aria-label={`Remove ${a.name}`}
                      onClick={() => {
                        removeAttachment(id);
                        toast(
                          "Session attachment removed. Checklist remains prepared.",
                        );
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : prepared ? (
                  <small className="reattach-note">
                    Checklist prepared ·{" "}
                    {state.documentMeta?.[id]?.name
                      ? `Previous file: ${state.documentMeta[id].name}. Reattach when applying.`
                      : "Attach a file again when applying."}
                  </small>
                ) : (
                  <small>PDF, JPG or PNG · Up to 5 MB</small>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="reset-row">
        <p>Want to walk through the original demo again?</p>
        <Button
          variant="outline"
          onClick={() =>
            setModal(
              <Modal title="Start the demo fresh?">
                <p>
                  This removes your saved profile, drafts, notes and plan from
                  this browser. The original student demo will be restored.
                </p>
                <div className="modal-actions">
                  <Button variant="outline" onClick={() => setModal(null)}>
                    Keep my progress
                  </Button>
                  <Button
                    onClick={() => {
                      Object.keys(attachments).forEach(removeAttachment);
                      update(() => initialState());
                      setModal(null);
                      toast(
                        "Original demo restored. Your next chapter is ready.",
                      );
                    }}
                  >
                    <RotateCcw size={16} /> Reset demo
                  </Button>
                </div>
              </Modal>,
            )
          }
        >
          Reset demo <RotateCcw size={15} />
        </Button>
      </div>
    </div>
  );
}
function Apply() {
  const { state, update, toast, attachments, attach } = useStore();
  const location = useLocation();
  const id = location.pathname.split("/").pop() || "";
  const s = scholarships.find((x) => x.id === id);
  const existing = state.applications[id];
  const [step, setStep] = useState(existing?.step || 0);
  const [answer, setAnswer] = useState(existing?.answer || "");
  const [notes, setNotes] = useState(existing?.notes || "");
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [dirty, setDirty] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!s) return;
    if (!existing)
      update(
        (st) => ({
          ...st,
          applications: {
            ...st.applications,
            [id]: { status: "Preparing", step: 0, answer: "", notes: "" },
          },
        }),
        `${s.name} application started.`,
      );
  }, [id]);
  if (!s)
    return (
      <Empty
        title="Opportunity not found"
        text="Choose an opportunity in Discover."
      />
    );
  const save = (next = step) => {
    update((st) => ({
      ...st,
      applications: {
        ...st.applications,
        [id]: {
          ...st.applications[id],
          status: "Preparing",
          step: next,
          answer,
          notes,
        },
      },
    }));
    setDirty(false);
  };
  const next = () => {
    if (step === 1 && answer.trim().length < 40) {
      setError("Write at least 40 characters about your learning goals.");
      return;
    }
    if (step === 2 && s.docs.some((d) => !attachments[d])) {
      setError(
        "Attach a sample file for each required document in this session.",
      );
      return;
    }
    setError("");
    save(step + 1);
    setStep(step + 1);
  };
  if (
    existing?.status === "Demo submitted" ||
    existing?.status === "Outcome recorded"
  )
    return (
      <div className="page submission-page">
        <motion.div
          className="submission-mark"
          initial={{ scale: 0.5, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
        >
          <Check size={40} />
        </motion.div>
        <span className="eyebrow">A CLEAR STEP FORWARD</span>
        <h1>
          Your next chapter
          <br />
          <em>is on its way.</em>
        </h1>
        <p>
          You completed the demo application for <b>{s.name}</b>.
        </p>
        <div className="submission-receipt">
          <div>
            <span>Demo reference</span>
            <b>{existing.reference}</b>
          </div>
          <div>
            <span>Completed</span>
            <b>
              {existing.submitted
                ? new Date(existing.submitted).toLocaleString("en-IN")
                : ""}
            </b>
          </div>
          <div>
            <span>Status</span>
            <b>{existing.status}</b>
          </div>
        </div>
        <div className="inline-info">
          <Info size={19} />
          <p>
            This was a demonstration. Nothing was sent to a scholarship provider
            and no funding has been awarded.
          </p>
        </div>
        <Link to="/applications" className="btn">
          View my applications <ArrowRight size={17} />
        </Link>
      </div>
    );
  return (
    <div className="page application-page">
      <Link to={`/scholarship/${id}`} className="text-link back-link">
        <ArrowLeft size={16} /> Back to scholarship
      </Link>
      <PageHeading
        eyebrow="ONE STEP AT A TIME."
        title={s.name}
        description="Your details, your story, your next possibility."
        action={
          <Button
            variant="outline"
            onClick={() => {
              save();
              toast("Draft saved. You can return whenever you’re ready.");
            }}
          >
            <Bookmark size={15} /> Save draft
          </Button>
        }
      />
      <div className="application-layout">
        <aside className="application-steps">
          {[
            "Your profile",
            "Your story",
            "Your documents",
            "Review & complete",
          ].map((label, i) => (
            <div
              key={label}
              className={step === i ? "active" : step > i ? "done" : ""}
            >
              <span>
                {step > i ? (
                  <Check size={14} />
                ) : (
                  String(i + 1).padStart(2, "0")
                )}
              </span>
              <div>
                <b>{label}</b>
                <small>
                  {
                    [
                      "A familiar starting point",
                      "A little about your ambition",
                      "The supporting pieces",
                      "One final look",
                    ][i]
                  }
                </small>
              </div>
            </div>
          ))}
          <p>
            <ShieldCheck size={17} /> Demo application.
            <br />
            No real submission.
          </p>
          <span className="draft-status">
            {dirty ? "Unsaved edits" : "Saved just now"}
          </span>
        </aside>
        <section className="application-form">
          <div className="eyebrow">STEP {step + 1} OF 4</div>
          <h2>
            {
              [
                "Start with what you know.",
                "Tell your story.",
                "Bring the pieces together.",
                "A final look, then forward.",
              ][step]
            }
          </h2>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -15, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {step === 0 && (
                <>
                  <p>These details come from your reusable Funding Passport.</p>
                  <dl className="review-profile">
                    <div>
                      <dt>Name</dt>
                      <dd>{state.profile.name}</dd>
                    </div>
                    <div>
                      <dt>Education</dt>
                      <dd>
                        {state.profile.course} · Year {state.profile.year}
                      </dd>
                    </div>
                    <div>
                      <dt>Residence</dt>
                      <dd>{state.profile.state}</dd>
                    </div>
                    <div>
                      <dt>Academic score</dt>
                      <dd>
                        {state.profile.score}
                        {state.profile.scale === "Percentage" ? "%" : " / 10"}
                      </dd>
                    </div>
                  </dl>
                  <Link to="/passport" className="text-link">
                    Edit in Funding Passport <ArrowUpRight size={15} />
                  </Link>
                  <div className="inline-info">
                    <Info size={18} />
                    <p>
                      {fit(s, state.profile) === "met"
                        ? "Your profile meets the stated demo criteria. The provider would make the final selection."
                        : "Some criteria are unmet or unknown. You can practice the application, but this does not establish eligibility."}
                    </p>
                  </div>
                </>
              )}
              {step === 1 && (
                <>
                  <label>
                    How would this scholarship help your learning journey?
                    <textarea
                      rows={7}
                      maxLength={1500}
                      value={answer}
                      onChange={(e) => {
                        setAnswer(e.target.value);
                        setDirty(true);
                        if (error) setError("");
                      }}
                      placeholder="Tell us what you’re studying, what you hope to achieve, and how the support could help."
                    />
                    <small>
                      {answer.length} / 1,500 characters · minimum 40
                    </small>
                  </label>
                  <label>
                    Your private preparation notes{" "}
                    <span className="optional">Optional</span>
                    <textarea
                      rows={3}
                      value={notes}
                      maxLength={2000}
                      onChange={(e) => {
                        setNotes(e.target.value);
                        setDirty(true);
                      }}
                      placeholder="Questions to ask, details to check…"
                    />
                  </label>
                </>
              )}
              {step === 2 && (
                <>
                  <p>
                    Use sample documents only. Files stay in this browser
                    session and must be reattached after a reload.
                  </p>
                  {s.docs.map((id) => (
                    <div className="apply-doc" key={id}>
                      <FileText size={18} />
                      <div>
                        <b>{documents[id].name}</b>
                        <small>
                          {attachments[id]?.name ||
                            "No file attached in this session"}
                        </small>
                        {attachments[id] && (
                          <a
                            href={attachments[id].url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Preview attachment <ExternalLink size={12} />
                          </a>
                        )}
                        <button
                          className="sample-file"
                          onClick={() =>
                            attach(id, demoFile(documents[id].name))
                          }
                        >
                          Use a safe sample PDF <ArrowUpRight size={12} />
                        </button>
                      </div>
                      <label className="btn outline upload-label">
                        <Upload size={14} />
                        {attachments[id] ? "Replace" : "Attach"}
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) attach(id, f);
                            e.target.value = "";
                          }}
                        />
                      </label>
                    </div>
                  ))}
                  <small>PDF, JPG or PNG · Up to 5 MB per file</small>
                </>
              )}
              {step === 3 && (
                <>
                  <div className="review-block">
                    <span className="small-label">APPLICANT</span>
                    <h3>{state.profile.name}</h3>
                    <p>
                      {state.profile.course} · {state.profile.state}
                    </p>
                  </div>
                  <div className="review-block">
                    <span className="small-label">YOUR STORY</span>
                    <p className="preserve-text">{answer}</p>
                  </div>
                  <div className="review-block">
                    <span className="small-label">SUPPORTING DOCUMENTS</span>
                    {s.docs.map((id) => (
                      <div className="review-file" key={id}>
                        {attachments[id] ? (
                          <Check size={14} />
                        ) : (
                          <Info size={14} />
                        )}{" "}
                        {documents[id].name}
                        <small>
                          {attachments[id]?.name ||
                            "Please reattach for this session"}
                        </small>
                      </div>
                    ))}
                  </div>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                    />{" "}
                    I understand this is a demo and no application will be sent
                    to a provider.
                  </label>
                </>
              )}
            </motion.div>
          </AnimatePresence>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <div className="application-form-footer">
            <Button
              variant="outline"
              onClick={() => {
                if (step > 0) {
                  save(step - 1);
                  setStep(step - 1);
                  setError("");
                } else navigate(`/scholarship/${id}`);
              }}
            >
              <ArrowLeft size={15} /> Back
            </Button>
            {step < 3 ? (
              <Button onClick={next}>
                Continue <ArrowRight size={16} />
              </Button>
            ) : (
              <Button
                onClick={() => {
                  if (!consent) {
                    setError("Please acknowledge that this is a demo.");
                    return;
                  }
                  if (
                    answer.trim().length < 40 ||
                    s.docs.some((d) => !attachments[d])
                  ) {
                    setError(
                      "Your story or attachments need attention. Go back to complete them.",
                    );
                    return;
                  }
                  update(
                    (st) => ({
                      ...st,
                      applications: {
                        ...st.applications,
                        [id]: {
                          status: "Demo submitted",
                          step: 3,
                          answer,
                          notes,
                          reference: `GR-DEMO-${Date.now().toString(36).toUpperCase()}`,
                          submitted: new Date().toISOString(),
                        },
                      },
                    }),
                    `${s.name} demo submission completed. Nothing was sent to a provider.`,
                  );
                  toast("Demo completed. No real submission was made.");
                }}
              >
                Complete demo submission <Check size={16} />
              </Button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
function ApplicationNotes({ id }: { id: string }) {
  const { state, update, toast } = useStore();
  const a = state.applications[id];
  const [notes, setNotes] = useState(a?.notes || "");
  const [outcome, setOutcome] = useState(a?.outcome || "Awarded (simulated)");
  const s = scholarships.find((s) => s.id === id)!;
  return (
    <Modal title={s.name}>
      <p className="fineprint">
        Notes and outcomes are user-entered demo information.
      </p>
      <label>
        Preparation notes
        <textarea
          rows={4}
          maxLength={2000}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </label>
      <Button
        onClick={() => {
          update((st) => ({
            ...st,
            applications: {
              ...st.applications,
              [id]: { ...st.applications[id], notes },
            },
          }));
          toast("Notes saved.");
        }}
      >
        Save notes <Check size={15} />
      </Button>
      {a?.status !== "Preparing" && (
        <div className="outcome-form">
          <label>
            Record a simulated outcome
            <select
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
            >
              <option>Awarded (simulated)</option>
              <option>Not selected (simulated)</option>
              <option>Waitlisted (simulated)</option>
            </select>
          </label>
          <Button
            variant="outline"
            onClick={() => {
              update(
                (st) => ({
                  ...st,
                  applications: {
                    ...st.applications,
                    [id]: {
                      ...st.applications[id],
                      status: "Outcome recorded",
                      outcome,
                    },
                  },
                }),
                `${s.name}: ${outcome}.`,
              );
              toast(
                "Simulated outcome recorded. No funds added to confirmed money.",
              );
            }}
          >
            Record demo outcome <Check size={15} />
          </Button>
        </div>
      )}
      <div className="modal-history">
        <span className="small-label">ACTIVITY HISTORY</span>
        {state.activity
          .filter((x) => x.text.includes(s.name))
          .map((x, i) => (
            <p key={i}>
              {x.text}
              <small>{new Date(x.time).toLocaleString("en-IN")}</small>
            </p>
          ))}
      </div>
    </Modal>
  );
}
function Applications() {
  const { state, setModal } = useStore();
  const [board, setBoard] = useState(true);
  const statuses = ["Saved", "Preparing", "Demo submitted", "Outcome recorded"];
  const ids = [
    ...new Set([...state.saved, ...Object.keys(state.applications)]),
  ];
  const items = scholarships.filter((s) => ids.includes(s.id));
  const status = (s: Scholarship) =>
    state.applications[s.id]?.status || "Saved";
  const card = (s: Scholarship) => {
    const a = state.applications[s.id];
    const m = missing(s, state.prepared);
    return (
      <article className="application-card" key={s.id}>
        <div className="application-card-top">
          <span className={`provider-mark ${s.color}`}>{s.initials}</span>
          <SaveButton s={s} />
        </div>
        <span className="provider-name">{s.provider}</span>
        <Link to={`/scholarship/${s.id}`}>
          <h3>{s.name}</h3>
        </Link>
        <b className="application-card-amount">
          {money(s.amount)} <small>{s.structure.toLowerCase()}</small>
        </b>
        <div className="application-card-status">
          <span>{status(s)}</span>
          <span>{Math.max(0, daysLeft(s, state.seed))} days left</span>
        </div>
        <div className="thin-progress">
          <span
            style={{
              width: `${a?.status === "Demo submitted" || a?.status === "Outcome recorded" ? 100 : ((s.docs.length - m.length) / s.docs.length) * 100}%`,
            }}
          />
        </div>
        <p>
          <b>Next task</b>
          <br />
          {a?.status === "Outcome recorded"
            ? a.outcome
            : a?.status === "Demo submitted"
              ? "Record a simulated outcome"
              : m.length
                ? `Prepare ${documents[m[0]].name.toLowerCase()}`
                : "Continue your application"}
        </p>
        <span className="fineprint">
          {s.docs.length - m.length}/{s.docs.length} checklist documents
          prepared
        </span>
        <div className="application-card-actions">
          <Link to={`/apply/${s.id}`} className="btn outline">
            {a?.status === "Demo submitted" || a?.status === "Outcome recorded"
              ? "View receipt"
              : a
                ? "Resume draft"
                : "Start application"}{" "}
            <ArrowUpRight size={15} />
          </Link>
          {a && (
            <button
              className="icon-btn"
              aria-label={`Notes and status for ${s.name}`}
              onClick={() => setModal(<ApplicationNotes id={s.id} />)}
            >
              <FileText size={17} />
            </button>
          )}
        </div>
      </article>
    );
  };
  return (
    <div className="page">
      <PageHeading
        eyebrow="SMALL STEPS. VISIBLE PROGRESS."
        title={
          <>
            Your next chapters,
            <br />
            <em>taking shape.</em>
          </>
        }
        description="From a saved possibility to a completed demo. It all lives here."
        action={
          <div className="view-toggle">
            <button
              aria-label="Board view"
              aria-pressed={board}
              className={board ? "active" : ""}
              onClick={() => setBoard(true)}
            >
              <LayoutGrid size={17} />
            </button>
            <button
              aria-label="List view"
              aria-pressed={!board}
              className={!board ? "active" : ""}
              onClick={() => setBoard(false)}
            >
              <List size={17} />
            </button>
          </div>
        }
      />
      {items.length ? (
        board ? (
          <div className="application-board">
            {statuses.map((st) => (
              <section key={st}>
                <div className="board-heading">
                  <span
                    className={`status-dot status-${statuses.indexOf(st)}`}
                  />
                  <h2>{st}</h2>
                  <span>{items.filter((s) => status(s) === st).length}</span>
                </div>
                {items.filter((s) => status(s) === st).map(card)}
                {!items.some((s) => status(s) === st) && (
                  <div className="board-empty">
                    {st === "Saved"
                      ? "Save a possibility that catches your eye."
                      : st === "Preparing"
                        ? "Your next application starts here."
                        : st === "Demo submitted"
                          ? "Completed demos will appear here."
                          : "Record a simulated outcome after completing a demo."}
                  </div>
                )}
              </section>
            ))}
          </div>
        ) : (
          <div className="applications-list">{items.map(card)}</div>
        )
      ) : (
        <Empty
          title="Your next chapter is waiting."
          text="Explore a scholarship and save it here to begin."
          action={
            <Link to="/discover" className="btn">
              Discover opportunities <ArrowRight size={16} />
            </Link>
          }
        />
      )}
      <div className="inline-info">
        <Info size={18} />
        <p>
          To progress an application, use its step-by-step workspace. After demo
          completion, open its notes control to record a simulated outcome.
          Nothing is sent to a real provider.
        </p>
      </div>
    </div>
  );
}
export default App;
