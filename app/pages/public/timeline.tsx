import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    Disc,
    Calendar,
    Music,
    MessageSquare,
    Heart,
    Sun,
    Moon,
    Loader2,
    Flame,
    Share2,
    Bookmark,
    MoreHorizontal,
    Volume2,
    VolumeX,
} from "lucide-react";
import { Link } from "react-router";
import DefaultLoader from "~/components/layouts/DefaultLoader";
import DefaultLayout from "~/components/layouts/DefaultLayout";

gsap.registerPlugin(ScrollTrigger);

export interface TimelineFeedItem {
    id: string;
    item_type: "release" | "event" | "playlist" | "post";
    created_at: string;
    title: string;
    subtitle: string | null;
    media_url: string | null;
    metadata: Record<string, any>;
}

export default function TimelinePage() {
    const [items, setItems] = useState<TimelineFeedItem[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState<"dark" | "light">("dark");

    const feedContainerRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

    const { ref: loadMoreRef, inView } = useInView({ threshold: 0.2 });

    // Fetch paginated data
    const fetchFeed = async (pageNum: number) => {
        if (loading) return;
        setLoading(true);

        try {
            const res = await fetch(`http://localhost:3001/timeline?page=${pageNum}&limit=8`);
            const data = await res.json();

            if (data.items) {
                setItems((prev) => [...prev, ...data.items]);
                setHasMore(data.hasMore);
            }
        } catch (err) {
            console.error("Failed to load timeline items", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed(page);
    }, [page]);

    useEffect(() => {
        if (inView && hasMore && !loading) {
            setPage((prev) => prev + 1);
        }
    }, [inView, hasMore, loading]);

    // GSAP Top Feed Scroll Progress Bar (Red Accent)
    useEffect(() => {
        if (!feedContainerRef.current || !progressBarRef.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                progressBarRef.current,
                { scaleX: 0 },
                {
                    scaleX: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: feedContainerRef.current,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: true,
                    },
                }
            );
        }, feedContainerRef);

        return () => ctx.revert();
    }, [items]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    const isDark = theme === "dark";

    return (
        <DefaultLayout>
            <div
                className={`min-h-screen transition-colors duration-300 font-sans ${isDark ? "bg-black text-white" : "bg-white text-black"
                    }`}
            >
                {/* Top Scroll Progress Line (GSAP) */}
                <div className="fixed top-0 left-0 right-0 h-1 bg-neutral-900 z-50">
                    <div
                        ref={progressBarRef}
                        className="h-full bg-red-600 origin-left shadow-[0_0_10px_#dc2626]"
                    />
                </div>

                <DefaultLoader />

                {/* Main Feed Container */}
                <main className="max-w-xl mx-auto px-2 md:px-0 py-6" ref={feedContainerRef}>
                    {/* Stories / Spotlight Bar (TikTok/FB Feature) */}
                    {/* <div className="mb-6 overflow-x-auto no-scrollbar flex items-center gap-4 py-2 px-2 border-b border-neutral-800/40">
                    {["Live Studio", "Releases", "Events", "Vip Tape", "Behind Scenes"].map((story, i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
                            <div className="p-0.5 rounded-full bg-gradient-to-tr from-red-600 via-neutral-500 to-white group-hover:scale-105 transition-transform">
                                <div className={`p-1 rounded-full ${isDark ? "bg-black" : "bg-white"}`}>
                                    <div className="w-14 h-14 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-red-500 font-bold text-xs uppercase overflow-hidden">
                                        {story.slice(0, 2)}
                                    </div>
                                </div>
                            </div>
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 group-hover:text-red-500 transition-colors">
                                {story}
                            </span>
                        </div>
                    ))}
                </div> */}

                    {/* Stream of Cards */}
                    <div className="space-y-6">
                        <AnimatePresence>
                            {items.map((item, index) => (
                                <SocialFeedCard key={`${item.id}-${index}`} item={item} theme={theme} />
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Endless Scroll Trigger Indicator */}
                    <div ref={loadMoreRef} className="py-10 flex justify-center items-center">
                        {loading && (
                            <div className="flex items-center gap-2 text-red-600 font-bold uppercase text-xs tracking-widest">
                                <Loader2 className="w-5 h-5 animate-spin text-red-600" />
                                <span>Loading Stream...</span>
                            </div>
                        )}
                        {!hasMore && (
                            <p className="text-neutral-500 text-xs font-mono uppercase tracking-widest">
                                — End of Transmission —
                            </p>
                        )}
                    </div>
                </main>
            </div>
        </DefaultLayout>
    );
}

interface SocialFeedCardProps {
    item: TimelineFeedItem;
    theme: "dark" | "light";
}

function SocialFeedCard({ item, theme }: SocialFeedCardProps) {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(item.metadata?.likes || 0);
    const [muted, setMuted] = useState(true);
    const [bookmarked, setBookmarked] = useState(false);
    const item_link = () => {
        switch (item.item_type) {
            case "event": return (`/events/${item.id}`);
            case "playlist": return (`/playlists/${item.id}`);
            default:
                return ('');
        }
    }

    const isDark = theme === "dark";

    const handleLike = () => {
        setLiked(!liked);
        setLikeCount((prev: number) => (liked ? prev - 1 : prev + 1));
    };

    const renderTypeBadge = () => {
        switch (item.item_type) {
            case "release":
                return (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/40">
                        <Disc className="w-3 h-3 text-red-500 animate-spin" style={{ animationDuration: "6s" }} /> Release
                    </span>
                );
            case "event":
                return (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-900 text-white border border-neutral-700">
                        <Calendar className="w-3 h-3 text-red-500" /> Event
                    </span>
                );
            case "playlist":
                return (
                    <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-white text-black font-extrabold">
                        <Music className="w-3 h-3 text-red-600" /> Playlist
                    </span>
                );
            default:
                return (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                        <MessageSquare className="w-3 h-3 text-red-500" /> Post
                    </span>
                );
        }
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className={`rounded-xl border overflow-hidden transition-all ${isDark
                ? "bg-neutral-950 border-neutral-900 hover:border-red-950/80"
                : "bg-white border-neutral-200 hover:border-red-200 shadow-sm"
                }`}
        >
            {/* Card Header */}
            <div className="p-4 flex items-center justify-between border-b border-neutral-900/40">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-neutral-900 border border-red-600 flex items-center justify-center font-black text-white text-sm">
                            {item.subtitle ? item.subtitle.slice(0, 2).toUpperCase() : "SX"}
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold tracking-tight">{item.title}</h3>
                            {renderTypeBadge()}
                        </div>
                        {item.subtitle && (
                            <p className="text-xs text-neutral-400 font-medium">{item.subtitle}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-[11px] text-neutral-500 font-mono">
                        {new Date(item.created_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                        })}
                    </span>
                    <button
                        className={`p-1 rounded hover:bg-neutral-800/50 ${isDark ? "text-neutral-400" : "text-neutral-600"
                            }`}
                    >
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Post Text Body */}
            {item.item_type === "post" && item.metadata?.content && (
                <div className="px-4 py-3 text-sm text-neutral-200 leading-relaxed font-sans">
                    {item.metadata.content}
                </div>
            )}

            {/* Media Display (TikTok / Facebook Focused Visuals) */}
            {item.media_url && (
                <Link to={item_link()} className="relative h-20 aspect-video bg-black overflow-hidden group">
                    <img
                        src={item.media_url.startsWith('/uploads') ? item.media_url : `/uploads/images/${item.media_url}`}
                        alt={item.title}
                        className="w-full h-full max-h-72 object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* TikTok-style overlay audio control button */}
                    <button
                        onClick={() => setMuted(!muted)}
                        className="absolute bottom-3 right-3 p-2 rounded-full bg-black/70 backdrop-blur-md text-white hover:bg-red-600 transition-colors"
                    >
                        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                </Link>
            )}

            {/* Event Details Card Callout */}
            {item.item_type === "event" && item.metadata?.start_time && (
                <div className="mx-4 my-3 p-3 rounded-lg bg-neutral-900 border-l-4 border-red-600 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">
                            Event Date & Time
                        </p>
                        <p className="text-xs font-mono font-bold text-white mt-0.5">
                            {new Date(item.metadata.start_time).toLocaleString()}
                        </p>
                    </div>
                    <Link to={`/events/${item.id}`} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded transition-colors">
                        View
                    </Link>
                </div>
            )}

            {/* Action Bar (Facebook & TikTok style interactions) */}
            <div
                className={`px-4 py-3 flex items-center justify-between border-t text-xs ${isDark ? "border-neutral-900 bg-neutral-950" : "border-neutral-100 bg-neutral-50"
                    }`}
            >
                <div className="flex items-center gap-6">
                    {/* Like */}
                    <button
                        onClick={handleLike}
                        className="flex items-center gap-2 transition-colors group"
                    >
                        <Heart
                            className={`w-5 h-5 transition-transform group-active:scale-125 ${liked ? "fill-red-600 text-red-600" : "text-neutral-400 group-hover:text-red-600"
                                }`}
                        />
                        <span
                            className={`font-mono font-semibold ${liked ? "text-red-600" : "text-neutral-400"
                                }`}
                        >
                            {likeCount}
                        </span>
                    </button>

                    {/* Comment */}
                    <button className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                        <MessageSquare className="w-5 h-5 hover:text-red-500" />
                        <span className="font-mono font-semibold">{item.metadata?.comments || 0}</span>
                    </button>

                    {/* Share */}
                    <button className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                        <Share2 className="w-5 h-5 hover:text-red-500" />
                    </button>
                </div>

                {/* Bookmark */}
                <button
                    onClick={() => setBookmarked(!bookmarked)}
                    className="text-neutral-400 hover:text-white transition-colors"
                >
                    <Bookmark
                        className={`w-5 h-5 ${bookmarked ? "fill-white text-white" : "hover:text-red-500"
                            }`}
                    />
                </button>
            </div>
        </motion.article>
    );
}