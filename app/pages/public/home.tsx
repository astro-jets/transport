import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BusFront,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  Menu,
  ShieldCheck,
  Users,
  X,
  Sparkles,
  Wifi,
  Zap,
  Coffee,
  Armchair,
  Ticket,
  ChevronRight,
  SlidersHorizontal,
  Compass,
  CheckCircle2,
  Share2,
  QrCode,
  RotateCcw,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// CONSTANTS & MOCK DATA
// ==========================================
const FRAME_COUNT = 60;
const framePath = (index: number) =>
  `/images/frames/${String(index + 1).padStart(2, "0")}.webp`;

const destinations = [
  {
    id: "blantyre",
    name: "Blantyre",
    code: "BLZ",
    number: "01",
    tagline: "Commercial Capital",
    description: "The bustling economic heartbeat nestled against Mount Soche.",
    image:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=85",
    fare: 28000,
    travelTime: "4h 30m",
    departures: "6 Daily",
  },
  {
    id: "lilongwe",
    name: "Lilongwe",
    code: "LLW",
    number: "02",
    tagline: "The Garden Capital",
    description: "Tree-lined boulevards and modern cultural centers.",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=85",
    fare: 32000,
    travelTime: "5h 15m",
    departures: "8 Daily",
  },
  {
    id: "mzuzu",
    name: "Mzuzu",
    code: "ZZU",
    number: "03",
    tagline: "Northern Gateway",
    description: "Cool highlands, pine forests, and coffee plantations.",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85",
    fare: 45000,
    travelTime: "8h 00m",
    departures: "4 Daily",
  },
  {
    id: "zomba",
    name: "Zomba",
    code: "ZOM",
    number: "04",
    tagline: "Historic Plateau",
    description: "Colonial architecture and dramatic mountain waterfalls.",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=85",
    fare: 18000,
    travelTime: "2h 45m",
    departures: "5 Daily",
  },
  {
    id: "mangochi",
    name: "Mangochi",
    code: "MNG",
    number: "05",
    tagline: "Lakeshore Retreat",
    description: "Golden sand beaches along the crystal waters of Lake Malawi.",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=85",
    fare: 35000,
    travelTime: "4h 00m",
    departures: "3 Daily",
  },
];

const fleet = [
  {
    id: "executive",
    name: "Aero Cruiser Executive",
    class: "First Class Suite",
    capacity: "28 Premium Seats",
    wifi: "Starlink High-Speed Wi-Fi",
    power: "220V & USB-C Power Ports",
    recline: "145° Leather Recliner",
    image:
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1800&q=90",
    features: ["Panoramiic Skylight", "Onboard Beverage Bar", "Active Air Filtration", "Extra Legroom"],
  },
  {
    id: "express",
    name: "Velox Express Coach",
    class: "Business Class",
    capacity: "44 Ergonomic Seats",
    wifi: "High-Speed 5G Wi-Fi",
    power: "Individual USB Ports",
    recline: "120° Comfort Recline",
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1800&q=90",
    features: ["Dual Climate Control", "Overhead Storage", "Reading Lights", "GPS Live Tracking"],
  },
  {
    id: "shuttle",
    name: "Sprint Shuttle Pro",
    class: "Rapid Express",
    capacity: "16 VIP Seats",
    wifi: "4G LTE Wi-Fi",
    power: "USB Charging",
    recline: "Standard Recline",
    image:
      "https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?auto=format&fit=crop&w=1800&q=90",
    features: ["Direct Airport Express", "Leather Trim", "Instant Luggage Bay", "Quiet Cabin"],
  },
];

const services = [
  {
    number: "01",
    title: "Precision Timetables",
    description:
      "Predictive departure tech with real-time GPS telemetry so you never waste a minute waiting.",
    icon: Clock3,
    badge: "99.4% On-time",
  },
  {
    number: "02",
    title: "First-Class Comfort",
    description:
      "Ergonomic Italian leather seating with expansive legroom, climate zones, and quiet acoustics.",
    icon: BusFront,
    badge: "VIP Cabin",
  },
  {
    number: "03",
    title: "Unrivaled Safety",
    description:
      "Continuous telematics monitoring, multi-tiered driver rotation, and advanced collision avoidance.",
    icon: ShieldCheck,
    badge: "ISO Certified",
  },
];

export default function TransportationPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef(0);

  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedFleetIndex, setSelectedFleetIndex] = useState(0);

  // Booking Form State
  const [from, setFrom] = useState("Blantyre");
  const [to, setTo] = useState("Lilongwe");
  const [travelDate, setTravelDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [passengers, setPassengers] = useState("1");
  const [ticketClass, setTicketClass] = useState<"Executive" | "Express">("Executive");
  const [bookingTicket, setBookingTicket] = useState<any | null>(null);

  const reduceMotion = useReducedMotion();

  // Calculate dynamic estimated fare
  const computedFare = useMemo(() => {
    const fromDest = destinations.find((d) => d.name === from);
    const toDest = destinations.find((d) => d.name === to);
    const base = (fromDest?.fare || 25000) * 0.5 + (toDest?.fare || 25000) * 0.5;
    const multiplier = ticketClass === "Executive" ? 1.35 : 1.0;
    const count = parseInt(passengers) || 1;
    return Math.round(base * multiplier * count);
  }, [from, to, passengers, ticketClass]);

  // Swap origin & destination with dynamic animation
  const handleSwapDestinations = () => {
    setFrom(to);
    setTo(from);
  };

  // ==========================================
  // CANVAS FRAME ANIMATION & SCROLL SCRUB
  // ==========================================
  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let disposed = false;
    let trigger: ScrollTrigger | undefined;

    // Render current frame or high-end procedural motion fallback
    const drawFrame = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const currentImg = imagesRef.current[frameRef.current];

      // If preloaded image frame exists and is valid, draw it!
      if (currentImg && currentImg.complete && currentImg.naturalWidth > 0) {
        ctx.clearRect(0, 0, width, height);
        const scale = Math.max(
          width / currentImg.naturalWidth,
          height / currentImg.naturalHeight
        );
        const drawWidth = currentImg.naturalWidth * scale;
        const drawHeight = currentImg.naturalHeight * scale;

        ctx.drawImage(
          currentImg,
          (width - drawWidth) / 2,
          (height - drawHeight) / 2,
          drawWidth,
          drawHeight
        );
      } else {
        // PROCEDURAL CANVAS SCROLL FALLBACK
        // Generates a stunning cinematic perspective road with glowing particle lights
        ctx.fillStyle = "#0d0d0c";
        ctx.fillRect(0, 0, width, height);

        const progress = frameRef.current / (FRAME_COUNT - 1);
        const horizon = height * 0.42;
        const cx = width * 0.5;

        // Draw animated starry grid horizon
        ctx.strokeStyle = "rgba(214, 255, 98, 0.08)";
        ctx.lineWidth = 1;
        for (let i = -10; i <= 10; i++) {
          ctx.beginPath();
          ctx.moveTo(cx + i * (width * 0.08), horizon);
          ctx.lineTo(cx + i * (width * 0.35), height);
          ctx.stroke();
        }

        // Perspective Road Lines
        const roadTopWidth = width * 0.15;
        const roadBottomWidth = width * 0.85;

        // Road Surface
        ctx.fillStyle = "#141412";
        ctx.beginPath();
        ctx.moveTo(cx - roadTopWidth / 2, horizon);
        ctx.lineTo(cx + roadTopWidth / 2, horizon);
        ctx.lineTo(cx + roadBottomWidth / 2, height);
        ctx.lineTo(cx - roadBottomWidth / 2, height);
        ctx.closePath();
        ctx.fill();

        // Animated Center Dashed Lines
        const speedOffset = (progress * 800) % 60;
        ctx.strokeStyle = "#d6ff62";
        ctx.lineWidth = 3;
        ctx.setLineDash([20, 20]);
        ctx.lineDashOffset = -speedOffset;
        ctx.beginPath();
        ctx.moveTo(cx, horizon);
        ctx.lineTo(cx, height);
        ctx.stroke();
        ctx.setLineDash([]); // reset

        // Light trails simulating high-speed coach travel
        const lightY = horizon + (height - horizon) * (0.3 + progress * 0.5);
        const glow = ctx.createRadialGradient(cx, lightY, 10, cx, lightY, 280);
        glow.addColorStop(0, "rgba(214, 255, 98, 0.4)");
        glow.addColorStop(0.5, "rgba(214, 255, 98, 0.08)");
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cx, lightY, 280, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const resize = () => {
      drawFrame();
      ScrollTrigger.refresh();
    };

    const setupScroll = () => {
      if (disposed) return;
      drawFrame();

      if (reduceMotion) {
        setLoaded(true);
        return;
      }

      trigger = ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: () => `+=${window.innerHeight * 3.5}`,
        pin: true,
        scrub: 0.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = Math.min(self.progress / 0.85, 1);
          frameRef.current = Math.round(progress * (FRAME_COUNT - 1));

          drawFrame();

          if (heroContentRef.current) {
            const fade = gsap.utils.interpolate(
              1,
              0,
              gsap.utils.clamp(0, 1, (self.progress - 0.12) / 0.35)
            );

            gsap.set(heroContentRef.current, {
              opacity: self.progress > 0.85 ? 0 : fade,
              y: -self.progress * 120,
              scale: 1 - self.progress * 0.08,
            });
          }
        },
      });

      setLoaded(true);
    };

    const loadFrames = async () => {
      let loadedCount = 0;
      const images = await Promise.all(
        Array.from({ length: FRAME_COUNT }, (_, index) =>
          new Promise<HTMLImageElement | null>((resolve) => {
            const img = new Image();
            img.decoding = "async";
            img.onload = () => {
              loadedCount++;
              setLoadProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
              resolve(img);
            };
            img.onerror = () => {
              loadedCount++;
              setLoadProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
              resolve(null);
            };
            img.src = framePath(index);
          })
        )
      );

      if (disposed) return;

      imagesRef.current = images.filter(
        (img): img is HTMLImageElement => img !== null
      );

      setupScroll();
    };

    window.addEventListener("resize", resize);
    loadFrames();

    return () => {
      disposed = true;
      window.removeEventListener("resize", resize);
      trigger?.kill();
    };
  }, [reduceMotion]);

  // Submit & Generate Boarding Ticket
  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (from === to) return;

    const fromData = destinations.find((d) => d.name === from) || destinations[0];
    const toData = destinations.find((d) => d.name === to) || destinations[1];

    setBookingTicket({
      ticketNo: `MW-${Math.floor(100000 + Math.random() * 900000)}`,
      from: fromData,
      to: toData,
      date: travelDate,
      passengers,
      ticketClass,
      fare: computedFare,
      seat: `${Math.floor(Math.random() * 8) + 1}${["A", "B", "C", "D"][Math.floor(Math.random() * 4)]}`,
      gate: "G-03",
      boardingTime: "06:30 AM",
    });
  };

  return (
    <main className="relative min-h-screen bg-[#0a0a09] font-sans text-[#f4f3ef] antialiased selection:bg-[#d6ff62] selection:text-black">
      {/* NOISE & OVERLAY GRAPHICS */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.035] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* FIXED NAVIGATION */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-[#0a0a09]/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 md:px-10 md:py-5">
          <a href="#home" className="group flex items-center gap-3.5">
            <div className="relative flex h-11 w-11 items-center justify-center bg-[#d6ff62] text-black transition-all duration-500 group-hover:rotate-[-12deg] group-hover:shadow-[0_0_25px_rgba(214,255,98,0.5)]">
              <BusFront size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <span className="block text-xs font-black uppercase leading-none tracking-[0.22em]">
                VWAZA
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#d6ff62]">
                EXPRESS
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-10 lg:flex">
            {[
              { name: "Destinations", href: "#routes" },
              { name: "Fleet Specs", href: "#fleet" },
              { name: "Experience", href: "#about" },
              { name: "Charter Services", href: "#corporate" },
            ].map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 transition-colors duration-300 hover:text-[#d6ff62] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#d6ff62] after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Header CTA */}
          <div className="flex items-center gap-4">
            <a
              href="#booking"
              className="group relative hidden overflow-hidden rounded-none bg-[#d6ff62] px-6 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-black transition-all duration-300 hover:bg-white sm:flex sm:items-center sm:gap-2.5"
            >
              <span>Book Journey</span>
              <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-11 w-11 items-center justify-center border border-white/20 bg-white/5 text-white transition hover:border-[#d6ff62] hover:text-[#d6ff62] lg:hidden"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-white/10 bg-[#0c0c0b] px-6 py-8 lg:hidden"
            >
              <div className="flex flex-col gap-6">
                {[
                  { name: "Destinations", href: "#routes" },
                  { name: "Fleet Specs", href: "#fleet" },
                  { name: "Experience", href: "#about" },
                  { name: "Charter Services", href: "#corporate" },
                  { name: "Book Ticket", href: "#booking" },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between text-base font-black uppercase tracking-widest text-white/80 transition-colors hover:text-[#d6ff62]"
                  >
                    <span>{item.name}</span>
                    <ArrowUpRight size={18} />
                  </a>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* ==========================================
          HERO SECTION (CANVAS VIDEO SCROLL ANIMATION)
          ========================================== */}
      <section
        id="home"
        ref={heroRef}
        className="relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-[#0c0c0b]"
      >
        {/* FRAME ANIMATION CANVAS */}
        <canvas
          ref={canvasRef}
          aria-label="Cinematic video scroll animation"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* PRELOADER OVERLAY */}
        {!loaded && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0a0a09]">
            <div className="relative mb-6 flex h-16 w-16 items-center justify-center">
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-white/10 border-t-[#d6ff62]" />
              <BusFront size={24} className="text-[#d6ff62]" />
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-white/80">
              Initializing Engine
            </p>
            <div className="mt-4 h-1 w-48 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-[#d6ff62] transition-all duration-200"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <span className="mt-2 font-mono text-[10px] text-white/40">
              {loadProgress}%
            </span>
          </div>
        )}

        {/* GRADIENT OVERLAYS FOR DRIBBBLE CINEMATIC DEPTH */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0a09]/80 via-transparent to-[#0a0a09]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0a0a09]/90 via-black/20 to-transparent" />

        {/* HERO SCRUBBED CONTENT */}
        <div
          ref={heroContentRef}
          className="absolute inset-0 z-20 flex items-center px-6 pt-24 md:px-12 lg:px-20"
        >
          <div className="mx-auto w-full max-w-[1600px]">
            <div className="max-w-5xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-black/40 px-4 py-2 backdrop-blur-md"
              >
                <span className="h-2 w-2 rounded-full bg-[#d6ff62] animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d6ff62]">
                  Next-Gen Intercity Transit
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.35 }}
                className="mt-6 text-[clamp(3.8rem,11vw,10.5rem)] font-black uppercase leading-[0.78] tracking-[-0.08em] text-white"
              >
                Every <br />
                Journey <br />
                <span className="text-transparent [webkit-text-stroke:1.5px_rgba(255,255,255,0.35)]">
                  Elevated.
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"
              >
                <p className="max-w-md text-sm leading-relaxed text-white/70 md:text-base">
                  Re-imagining highway movement with high-frequency luxury coaches,
                  panoramic executive suites, and precision scheduling across Malawi.
                </p>

                <div className="flex items-center gap-4">
                  <a
                    href="#booking"
                    className="group flex items-center gap-4 border border-[#d6ff62] bg-[#d6ff62] px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-black transition-all duration-300 hover:bg-white hover:border-white hover:shadow-[0_0_30px_rgba(214,255,98,0.4)]"
                  >
                    <span>Reserve Seats</span>
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* HERO BOTTOM BAR */}
        <div className="absolute bottom-8 left-6 right-6 z-20 flex items-center justify-between md:bottom-10 md:left-12 md:right-12">
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">
            <Compass size={14} className="text-[#d6ff62]" />
            <span>Malawi Route Network</span>
            <span className="text-white/20">|</span>
            <span className="hidden sm:inline text-white/80">Scroll To Scrub Video</span>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/50 px-4 py-2 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
            <span>Scroll Frame Scrub</span>
            <ArrowDown size={14} className="animate-bounce text-[#d6ff62]" />
          </div>
        </div>
      </section>

      {/* ==========================================
          STATS & STATEMENT SECTION
          ========================================== */}
      <section className="relative bg-[#f5f4ef] px-6 py-28 text-[#111110] md:px-12 md:py-36 lg:px-20">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <span className="mb-6 inline-block text-[10px] font-black uppercase tracking-[0.35em] text-black/50">
                // Redefining Mobility
              </span>
              <h2 className="text-[clamp(3.2rem,7.5vw,7.5rem)] font-black uppercase leading-[0.82] tracking-[-0.075em]">
                The standard <br />
                <span className="text-black/30">you deserve.</span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-base leading-relaxed text-black/70 md:text-xl">
                We combine aerospace-inspired seating design, live telemetry tracking,
                and direct point-to-point express routes to make road travel the highlight of your day.
              </p>
            </div>
          </div>

          {/* DRIBBBLE METRIC CARDS */}
          <div className="mt-20 grid grid-cols-2 gap-4 border-t border-black/15 pt-12 md:grid-cols-4 md:gap-8">
            {[
              { val: "25+", label: "Express Routes", detail: "Connecting Major Cities" },
              { val: "99.8%", label: "On-Time Departures", detail: "Punctuality Guarantee" },
              { val: "120K+", label: "Happy Passengers", detail: "Traveled Last Year" },
              { val: "100%", label: "Safety Record", detail: "Real-time Telemetry" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="group relative overflow-hidden bg-white/80 p-8 border border-black/10 transition-all duration-300 hover:border-black hover:shadow-xl"
              >
                <p className="text-4xl font-black tracking-tight text-black md:text-6xl">
                  {stat.val}
                </p>
                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-black">
                  {stat.label}
                </p>
                <p className="mt-1 text-xs text-black/50">{stat.detail}</p>
                <div className="absolute top-0 right-0 h-1 w-0 bg-[#d6ff62] transition-all duration-500 group-hover:w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          DESTINATIONS & ROUTE BENTO GRID
          ========================================== */}
      <section id="routes" className="bg-[#0a0a09] px-6 py-28 md:px-12 md:py-36 lg:px-20">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#d6ff62]">
                <MapPin size={12} />
                <span>Primary Network</span>
              </div>
              <h2 className="text-[clamp(3rem,7vw,7rem)] font-black uppercase leading-[0.82] tracking-[-0.075em] text-white">
                Find your <br />
                <span className="text-white/30">destination.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-white/50 md:text-base">
              Explore key commercial hubs, serene lakefronts, and highland gateways served multiple times daily.
            </p>
          </div>

          {/* ROUTE CARDS GRID */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((dest, idx) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group relative flex flex-col justify-between overflow-hidden border border-white/10 bg-[#1212119c] p-8 transition-all duration-500 hover:border-[#d6ff62]"
              >
                {/* Background Image on Hover */}
                <div className="absolute inset-0 opacity-20 transition-all duration-700 group-hover:scale-110 group-hover:opacity-40">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="h-full w-full object-cover"
                  />
                  {/* <div className="absolute inset-0 bg-gradient-to-t from-[#121211] via-[#121211]/80 to-transparent" /> */}
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#d6ff62]">
                      {dest.number} / {dest.code}
                    </span>
                    <span className="rounded-full border border-white/15 bg-black/60 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white/70 backdrop-blur-md">
                      {dest.departures}
                    </span>
                  </div>

                  <h3 className="mt-12 text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
                    {dest.name}
                  </h3>
                  <p className="mt-2 text-xs font-semibold tracking-wide text-[#d6ff62]">
                    {dest.tagline}
                  </p>
                  <p className="mt-4 text-xs leading-relaxed text-white/60">
                    {dest.description}
                  </p>
                </div>

                <div className="relative z-10 mt-10 flex items-center justify-between border-t border-white/10 pt-6">
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-white/40">
                      Express Fare From
                    </span>
                    <span className="text-lg font-black text-white">
                      MWK {dest.fare.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setTo(dest.name);
                      const bookingElem = document.getElementById("booking");
                      bookingElem?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-all duration-300 group-hover:border-[#d6ff62] group-hover:bg-[#d6ff62] group-hover:text-black"
                  >
                    <ArrowUpRight size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          INTERACTIVE FLEET INSPECTOR SECTION
          ========================================== */}
      <section id="fleet" className="bg-[#121211] px-6 py-28 text-white md:px-12 md:py-36 lg:px-20">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="mb-4 inline-block text-[10px] font-black uppercase tracking-[0.35em] text-[#d6ff62]">
                // Engineering & Specs
              </span>
              <h2 className="text-[clamp(3rem,7vw,6.5rem)] font-black uppercase leading-[0.82] tracking-[-0.075em]">
                The Fleet <br />
                <span className="text-white/30">Standards.</span>
              </h2>
            </div>

            {/* Fleet Switcher Tabs */}
            <div className="flex flex-wrap gap-2 rounded-full border border-white/10 bg-black/40 p-1.5 backdrop-blur-lg">
              {fleet.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedFleetIndex(idx)}
                  className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${selectedFleetIndex === idx
                    ? "bg-[#d6ff62] text-black shadow-lg"
                    : "text-white/60 hover:text-white"
                    }`}
                >
                  {item.class}
                </button>
              ))}
            </div>
          </div>

          {/* ACTIVE FLEET SHOWCASE */}
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Image Preview Container */}
            <div className="relative overflow-hidden border border-white/10 bg-black lg:col-span-7">
              <div className="aspect-[16/10] w-full overflow-hidden">
                <img
                  src={fleet[selectedFleetIndex].image}
                  alt={fleet[selectedFleetIndex].name}
                  className="h-full w-full object-cover transition-all duration-700 hover:scale-105"
                />
              </div>

              {/* Badges */}
              <div className="absolute top-6 left-6 flex items-center gap-3">
                <span className="bg-black/80 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#d6ff62] backdrop-blur-md border border-white/10">
                  {fleet[selectedFleetIndex].name}
                </span>
              </div>
            </div>

            {/* Spec Details Card */}
            <div className="lg:col-span-5">
              <div className="border border-white/10 bg-black/60 p-8 md:p-10 backdrop-blur-xl">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d6ff62]">
                  Specifications & Amenities
                </span>
                <h3 className="mt-2 text-3xl font-black uppercase tracking-tight md:text-4xl">
                  {fleet[selectedFleetIndex].name}
                </h3>

                <div className="mt-8 space-y-6">
                  <div className="flex items-start gap-4 border-b border-white/10 pb-4">
                    <Armchair size={20} className="text-[#d6ff62] shrink-0 mt-1" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Seating Layout</p>
                      <p className="text-sm font-semibold text-white">{fleet[selectedFleetIndex].capacity} • {fleet[selectedFleetIndex].recline}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 border-b border-white/10 pb-4">
                    <Wifi size={20} className="text-[#d6ff62] shrink-0 mt-1" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Connectivity</p>
                      <p className="text-sm font-semibold text-white">{fleet[selectedFleetIndex].wifi}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 border-b border-white/10 pb-4">
                    <Zap size={20} className="text-[#d6ff62] shrink-0 mt-1" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">In-Seat Power</p>
                      <p className="text-sm font-semibold text-white">{fleet[selectedFleetIndex].power}</p>
                    </div>
                  </div>
                </div>

                {/* Feature Chips */}
                <div className="mt-8 flex flex-wrap gap-2">
                  {fleet[selectedFleetIndex].features.map((feat) => (
                    <span
                      key={feat}
                      className="inline-flex items-center gap-1.5 border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/80"
                    >
                      <CheckCircle2 size={12} className="text-[#d6ff62]" />
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          INTERACTIVE TICKET BOOKING ENGINE
          ========================================== */}
      <section id="booking" className="relative bg-[#d6ff62] px-6 py-28 text-black md:px-12 md:py-36 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <span className="mb-4 inline-block text-[10px] font-black uppercase tracking-[0.35em] text-black/60">
                // Instant Digital Reservation
              </span>
              <h2 className="text-[clamp(3.2rem,7.5vw,7.5rem)] font-black uppercase leading-[0.8] tracking-[-0.08em]">
                Book your <br />
                <span className="text-black/40">Departure.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-black/70">
              Select your departure point, destination, date, and preferred seating tier to generate your digital boarding ticket instantly.
            </p>
          </div>

          {/* MAIN BOOKING FORM CARD */}
          <form
            onSubmit={handleBooking}
            className="border-2 border-black bg-[#fbfbfa] p-6 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] md:p-10"
          >
            {/* TIER TOGGLES */}
            <div className="mb-8 flex items-center gap-4 border-b border-black/15 pb-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-black/50">
                Service Class:
              </span>
              {(["Executive", "Express"] as const).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setTicketClass(tier)}
                  className={`px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${ticketClass === tier
                    ? "border-2 border-black bg-black text-[#d6ff62]"
                    : "border border-black/20 bg-transparent text-black hover:border-black"
                    }`}
                >
                  {tier} Suite
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Origin Dropdown */}
              <div className="relative border-2 border-black bg-white p-5">
                <label className="mb-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-black/50">
                  <MapPin size={14} className="text-black" /> Origin
                </label>
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full bg-transparent text-lg font-black uppercase tracking-tight text-black outline-none"
                >
                  {destinations.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Origin/Destination Button */}
              <div className="relative border-2 border-black bg-white p-5 flex items-center justify-between">
                <div className="w-full">
                  <label className="mb-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-black/50">
                    <MapPin size={14} className="text-black" /> Destination
                  </label>
                  <select
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full bg-transparent text-lg font-black uppercase tracking-tight text-black outline-none"
                  >
                    {destinations.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleSwapDestinations}
                  title="Swap locations"
                  className="ml-2 flex h-10 w-10 shrink-0 items-center justify-center border border-black bg-[#d6ff62] text-black transition hover:bg-black hover:text-[#d6ff62]"
                >
                  <RotateCcw size={16} />
                </button>
              </div>

              {/* Date Selection */}
              <div className="border-2 border-black bg-white p-5">
                <label className="mb-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-black/50">
                  <CalendarDays size={14} className="text-black" /> Date
                </label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full bg-transparent text-base font-black uppercase tracking-tight text-black outline-none"
                />
              </div>

              {/* Passengers Selection */}
              <div className="border-2 border-black bg-white p-5">
                <label className="mb-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-black/50">
                  <Users size={14} className="text-black" /> Seats
                </label>
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                  className="w-full bg-transparent text-lg font-black uppercase tracking-tight text-black outline-none"
                >
                  {[1, 2, 3, 4, 6, 8].map((num) => (
                    <option key={num} value={String(num)}>
                      {num} {num === 1 ? "Passenger" : "Passengers"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dynamic Fare & Submit */}
            <div className="mt-8 flex flex-col items-center justify-between gap-6 border-t border-black/15 pt-6 sm:flex-row">
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-black/50">
                  Total Estimated Fare
                </span>
                <span className="text-3xl font-black tracking-tight text-black md:text-4xl">
                  MWK {computedFare.toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-4 border-2 border-black bg-black px-10 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-[#d6ff62] transition-all duration-300 hover:bg-[#d6ff62] hover:text-black sm:w-auto"
              >
                <span>Generate Boarding Ticket</span>
                <Ticket size={18} className="transition-transform duration-300 group-hover:scale-110" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ==========================================
          BOARDING PASS TICKET MODAL
          ========================================== */}
      <AnimatePresence>
        {bookingTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl overflow-hidden border-2 border-white/20 bg-[#141413] text-white shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 bg-black p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center bg-[#d6ff62] text-black">
                    <BusFront size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-white">VWAZA EXPRESS</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#d6ff62]">BOARDING PASS</p>
                  </div>
                </div>
                <button
                  onClick={() => setBookingTicket(null)}
                  className="flex h-10 w-10 items-center justify-center border border-white/20 text-white hover:border-[#d6ff62] hover:text-[#d6ff62]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Ticket Body */}
              <div className="p-8">
                <div className="grid grid-cols-2 gap-8 border-b border-white/10 pb-8">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">From</span>
                    <p className="text-3xl font-black uppercase text-white">{bookingTicket.from.name}</p>
                    <p className="font-mono text-xs text-[#d6ff62]">{bookingTicket.from.code}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">To</span>
                    <p className="text-3xl font-black uppercase text-white">{bookingTicket.to.name}</p>
                    <p className="font-mono text-xs text-[#d6ff62]">{bookingTicket.to.code}</p>
                  </div>
                </div>

                {/* Ticket Meta Details */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-white/40">Date</span>
                    <span className="text-sm font-bold text-white">{bookingTicket.date}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-white/40">Seat No</span>
                    <span className="text-sm font-bold text-[#d6ff62]">{bookingTicket.seat}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-white/40">Boarding</span>
                    <span className="text-sm font-bold text-white">{bookingTicket.boardingTime}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-white/40">Class</span>
                    <span className="text-sm font-bold text-white">{bookingTicket.ticketClass}</span>
                  </div>
                </div>

                {/* Ticket Footer / Barcode */}
                <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-dashed border-white/20 pt-6 sm:flex-row">
                  <div>
                    <p className="font-mono text-xs text-white/60">TICKET NO: {bookingTicket.ticketNo}</p>
                    <p className="text-[10px] text-white/40">Present this QR code at terminal gate {bookingTicket.gate}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-3">
                    <QrCode size={40} className="text-black" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#0a0a09] px-6 py-16 text-white/60 md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center bg-[#d6ff62] text-black">
              <BusFront size={18} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-white">VWAZA EXPRESS MALAWI</span>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-white/40">
            © {new Date().getFullYear()} Vwaza Express Inc. Designed for High-Performance Mobility.
          </p>
        </div>
      </footer>
    </main>
  );
}