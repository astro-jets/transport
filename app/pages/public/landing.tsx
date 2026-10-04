import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowUpRight,
  BusFront,
  MapPin,
  ShieldCheck,
  Clock3,
  Menu,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const destinations = [
  "Blantyre",
  "Lilongwe",
  "Mzuzu",
  "Zomba",
  "Mangochi",
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      tl.from(".nav-item", {
        y: -20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
      })
        .from(
          titleRef.current,
          {
            y: 100,
            opacity: 0,
            duration: 1.2,
          },
          "-=0.4",
        )
        .from(
          ".hero-copy",
          {
            y: 40,
            opacity: 0,
            duration: 0.9,
          },
          "-=0.6",
        )
        .from(
          ".hero-action",
          {
            y: 30,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.5",
        )
        .from(
          imageRef.current,
          {
            scale: 1.15,
            opacity: 0,
            duration: 1.5,
          },
          "-=1",
        )
        .from(
          lineRef.current,
          {
            scaleX: 0,
            transformOrigin: "left",
            duration: 1,
          },
          "-=0.7",
        );

      gsap.to(imageRef.current, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero-title-word", {
        yPercent: -25,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".scroll-indicator", {
        y: 12,
        opacity: 0,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "20% top",
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="bg-[#080808] text-white overflow-hidden">
      {/* NAVIGATION */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-6 lg:px-10">
          <motion.div
            whileHover={{ scale: 1.04 }}
            className="nav-item flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center bg-white text-black">
              <BusFront size={21} strokeWidth={2.5} />
            </div>

            <div className="leading-none">
              <div className="text-sm font-black tracking-[0.22em]">
                YOUR
              </div>
              <div className="text-sm font-black tracking-[0.22em]">
                COMPANY
              </div>
            </div>
          </motion.div>

          <nav className="hidden items-center gap-10 lg:flex">
            {["Routes", "Fleet", "About", "Corporate"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="nav-item text-xs font-semibold uppercase tracking-[0.18em] text-white/70 transition hover:text-white"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <motion.a
              href="#booking"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="nav-item hidden bg-white px-5 py-3 text-xs font-bold uppercase tracking-widest text-black sm:block"
            >
              Book a Journey
            </motion.a>

            <button className="nav-item flex h-11 w-11 items-center justify-center border border-white/20 lg:hidden">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen items-end overflow-hidden"
      >
        {/* IMAGE */}
        <div
          ref={imageRef}
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(0,0,0,.9) 0%, rgba(0,0,0,.55) 45%, rgba(0,0,0,.18) 100%), linear-gradient(0deg, rgba(0,0,0,.85) 0%, transparent 65%), url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2200&q=90')",
          }}
        />

        {/* Decorative grain */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:url('https://grainy-gradients.vercel.app/noise.svg')]" />

        <div className="relative z-10 mx-auto w-full max-w-[1500px] px-6 pb-20 pt-40 lg:px-10 lg:pb-28">
          <div className="max-w-5xl">
            <div className="hero-copy mb-7 flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-white/60">
              <span className="h-px w-12 bg-white/60" />
              Travel differently
            </div>

            <h1
              ref={titleRef}
              className="overflow-hidden text-[clamp(4rem,10vw,10rem)] font-black uppercase leading-[0.8] tracking-[-0.07em]"
            >
              <span className="hero-title-word block">Move</span>
              <span className="hero-title-word block text-white/45">
                With
              </span>
              <span className="hero-title-word block">Confidence.</span>
            </h1>

            <p className="hero-copy mt-9 max-w-xl text-base leading-7 text-white/70 md:text-lg">
              Reliable journeys. Professional service. Modern travel
              experiences connecting people and places across Malawi.
            </p>

            <div className="hero-action mt-9 flex flex-wrap gap-3">
              <motion.a
                href="#booking"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-4 bg-white px-7 py-4 text-xs font-black uppercase tracking-widest text-black"
              >
                Book your journey
                <ArrowUpRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </motion.a>

              <motion.a
                href="#routes"
                whileHover={{ backgroundColor: "rgba(255,255,255,.12)" }}
                className="flex items-center gap-3 border border-white/25 px-7 py-4 text-xs font-black uppercase tracking-widest"
              >
                Explore routes
              </motion.a>
            </div>
          </div>

          <div
            ref={lineRef}
            className="mt-20 h-px w-full bg-white/20"
          />

          <div className="mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">
              <span>Safe journeys</span>
              <span>Daily departures</span>
              <span>Professional service</span>
            </div>

            <div className="scroll-indicator flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">
              Scroll to explore
              <ArrowDown size={14} />
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="relative bg-white px-6 py-28 text-black lg:px-10 lg:py-40">
        <div className="mx-auto grid max-w-375 gap-16 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="mb-8 text-xs font-black uppercase tracking-[0.3em] text-black/40">
              More than transportation
            </p>

            <h2 className="max-w-4xl text-[clamp(3rem,6vw,7rem)] font-black uppercase leading-[0.86] tracking-[-0.06em]">
              The journey
              <br />
              <span className="text-black/30">starts here.</span>
            </h2>
          </div>

          <div className="flex flex-col justify-end">
            <p className="max-w-xl text-xl leading-8 text-black/65 md:text-2xl">
              From the moment you book to the moment you arrive, every part
              of your journey should feel simple, reliable and professional.
            </p>

            <a
              href="#about"
              className="mt-10 flex w-fit items-center gap-4 border-b border-black pb-3 text-xs font-black uppercase tracking-[0.2em]"
            >
              Discover our story
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[#111111] px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-[1500px] grid-cols-2 border-l border-white/10 md:grid-cols-4">
          {[
            ["25+", "Routes"],
            ["50K+", "Passengers"],
            ["15+", "Destinations"],
            ["24/7", "Support"],
          ].map(([number, label]) => (
            <div
              key={label}
              className="border-r border-white/10 px-6 py-10 lg:px-12"
            >
              <div className="text-4xl font-black tracking-tight md:text-6xl">
                {number}
              </div>
              <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ROUTES */}
      <section
        id="routes"
        className="bg-[#080808] px-6 py-28 lg:px-10 lg:py-40"
      >
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-20 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="mb-6 text-xs font-black uppercase tracking-[0.3em] text-white/35">
                Explore the network
              </p>

              <h2 className="text-[clamp(3.5rem,7vw,8rem)] font-black uppercase leading-[0.82] tracking-[-0.06em]">
                Wherever
                <br />
                <span className="text-white/30">you're going.</span>
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-6 text-white/45">
              Discover routes, departure points and destinations through a
              simple digital experience designed around the passenger.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
            {destinations.map((destination, index) => (
              <motion.div
                key={destination}
                whileHover="hover"
                className="group relative min-h-[280px] overflow-hidden bg-[#111111] p-7"
              >
                <div className="absolute right-7 top-7 flex h-10 w-10 items-center justify-center border border-white/10">
                  <MapPin size={16} className="text-white/50" />
                </div>

                <div className="absolute bottom-7 left-7">
                  <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
                    0{index + 1} / Destination
                  </div>

                  <h3 className="text-3xl font-black uppercase tracking-tight">
                    {destination}
                  </h3>

                  <motion.div
                    variants={{
                      hover: { width: 80 },
                    }}
                    initial={{ width: 35 }}
                    className="mt-5 h-px bg-white"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FLEET */}
      <section id="fleet" className="bg-[#e8e8e3] px-6 py-28 text-black lg:px-10 lg:py-40">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="mb-6 text-xs font-black uppercase tracking-[0.3em] text-black/35">
                The fleet
              </p>

              <h2 className="text-[clamp(3.5rem,7vw,8rem)] font-black uppercase leading-[0.82] tracking-[-0.07em]">
                Travel
                <br />
                <span className="text-black/30">in comfort.</span>
              </h2>
            </div>

            <p className="max-w-xl text-lg leading-8 text-black/55">
              Showcase your fleet with professional photography, detailed
              specifications and the information passengers need before
              they travel.
            </p>
          </div>

          <div className="mt-20 overflow-hidden bg-black">
            <div
              className="min-h-[500px] bg-cover bg-center md:min-h-[650px]"
              style={{
                backgroundImage:
                  "linear-gradient(0deg, rgba(0,0,0,.85), transparent 60%), url('https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=2000&q=90')",
              }}
            >
              <div className="flex min-h-[500px] flex-col justify-end p-7 text-white md:min-h-[650px] md:p-12">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
                  Featured coach
                </div>

                <div className="mt-3 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                  <h3 className="text-5xl font-black uppercase tracking-[-0.04em] md:text-7xl">
                    Executive
                  </h3>

                  <button className="flex w-fit items-center gap-3 border border-white/30 px-6 py-3 text-xs font-black uppercase tracking-widest">
                    View fleet
                    <ArrowUpRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING */}
      <section
        id="booking"
        className="bg-white px-6 py-28 text-black lg:px-10 lg:py-40"
      >
        <div className="mx-auto max-w-[1200px]">
          <div className="text-center">
            <p className="mb-6 text-xs font-black uppercase tracking-[0.3em] text-black/35">
              Your journey starts here
            </p>

            <h2 className="text-[clamp(3.5rem,7vw,8rem)] font-black uppercase leading-[0.82] tracking-[-0.07em]">
              Where will
              <br />
              <span className="text-black/25">we take you?</span>
            </h2>
          </div>

          <div className="mt-16 border border-black/10 p-4 md:p-6">
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
              <BookingField label="From" value="Blantyre" />
              <BookingField label="To" value="Lilongwe" />
              <BookingField label="Date" value="Select date" />
              <BookingField label="Passengers" value="1 Passenger" />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="mt-2 flex w-full items-center justify-center gap-3 bg-black py-5 text-xs font-black uppercase tracking-[0.2em] text-white"
            >
              Search journeys
              <ArrowUpRight size={16} />
            </motion.button>
          </div>
        </div>
      </section>

      {/* CORPORATE */}
      <section
        id="corporate"
        className="relative overflow-hidden bg-[#151515] px-6 py-28 lg:px-10 lg:py-40"
      >
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-16 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              <p className="mb-6 text-xs font-black uppercase tracking-[0.3em] text-white/30">
                For business
              </p>

              <h2 className="text-[clamp(3.5rem,7vw,8rem)] font-black uppercase leading-[0.82] tracking-[-0.07em]">
                Transport
                <br />
                <span className="text-white/25">for business.</span>
              </h2>
            </div>

            <div className="flex flex-col justify-end">
              <p className="text-lg leading-8 text-white/50">
                A dedicated digital experience for corporate clients,
                institutions, NGOs, group bookings and long-term transport
                partnerships.
              </p>

              <motion.a
                href="#contact"
                whileHover={{ x: 8 }}
                className="mt-10 flex w-fit items-center gap-4 text-xs font-black uppercase tracking-[0.2em]"
              >
                Discuss corporate transport
                <ArrowUpRight size={17} />
              </motion.a>
            </div>
          </div>

          <div className="mt-20 grid gap-px bg-white/10 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Reliable",
                text: "Professional transport solutions built around reliability.",
              },
              {
                icon: Clock3,
                title: "Flexible",
                text: "Solutions designed around your organization's schedule.",
              },
              {
                icon: BusFront,
                title: "Scalable",
                text: "From individual journeys to large group transportation.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-[#151515] p-8 lg:p-12">
                <Icon size={26} className="mb-14 text-white/50" />

                <h3 className="text-2xl font-black uppercase">{title}</h3>

                <p className="mt-4 max-w-xs text-sm leading-6 text-white/40">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white px-6 py-32 text-black lg:px-10 lg:py-48">
        <div className="mx-auto max-w-[1500px]">
          <p className="mb-8 text-xs font-black uppercase tracking-[0.3em] text-black/30">
            Start your journey
          </p>

          <h2 className="max-w-6xl text-[clamp(4rem,9vw,11rem)] font-black uppercase leading-[0.78] tracking-[-0.08em]">
            Let's
            <br />
            <span className="text-black/20">move.</span>
          </h2>

          <div className="mt-16 flex flex-col justify-between gap-10 border-t border-black/10 pt-8 md:flex-row md:items-end">
            <p className="max-w-md text-black/50">
              Professional transport. Better journeys. A digital experience
              built around your passengers and your business.
            </p>

            <a
              href="#booking"
              className="group flex items-center gap-5 text-sm font-black uppercase tracking-[0.2em]"
            >
              Book a journey
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white transition-transform group-hover:rotate-45">
                <ArrowUpRight size={18} />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black px-6 py-10 text-white lg:px-10">
        <div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="text-xs font-black uppercase tracking-[0.25em]">
            YOUR COMPANY
          </div>

          <div className="flex gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Contact</span>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
            © 2026
          </div>
        </div>
      </footer>
    </main>
  );
}

function BookingField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <motion.div
      whileHover={{ backgroundColor: "#f5f5f5" }}
      className="border border-black/10 p-5"
    >
      <div className="text-[9px] font-black uppercase tracking-[0.25em] text-black/35">
        {label}
      </div>

      <div className="mt-3 text-lg font-bold">{value}</div>
    </motion.div>
  );
}