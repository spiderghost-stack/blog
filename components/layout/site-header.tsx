"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, Search, Sparkles, X, User, LogOut, LayoutDashboard, AlertTriangle } from "lucide-react";
import { useAuth } from "@/src/contexts/auth-context";

const links = [
    { label: "Accueil", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Catégories", href: "/categories" },
];

export function SiteHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const { theme, resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // État du pop-up 2026
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
        setIsProfileOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const { user, logout } = useAuth();

    const handleSearch = () => {
        setIsMenuOpen(false);
        router.push("/search");
    };

    const handleLogout = async () => {
        try {
            await logout();
            setIsMenuOpen(false);
            setIsProfileOpen(false);
            setShowLogoutConfirm(false);
            router.push("/");
        } catch (error) {
            console.error("Erreur lors de la déconnexion", error);
        }
    };

    return (
        <>
            <header className="sticky top-0 z-[60] border-b border-zinc-200/80 bg-white/95 dark:border-zinc-800 dark:bg-zinc-950/95 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight" onClick={() => setIsMenuOpen(false)}>
                        <div className="rounded-xl bg-indigo-600 p-2 text-white">
                            <Sparkles className="h-4 w-4" />
                        </div>
                        <span>MindLog</span>
                    </Link>

                    <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-600 md:flex dark:text-zinc-300">
                        {links.map((link) => (
                            <Link key={link.href} href={link.href} className="transition hover:text-zinc-950 dark:hover:text-white">
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleSearch}
                            aria-label="Rechercher"
                            className="rounded-full border border-zinc-200 p-2 text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-white"
                        >
                            <Search className="h-4 w-4" />
                        </button>

                        {user ? (
                            <div className="relative hidden md:block" ref={dropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="rounded-full border border-zinc-200 p-2 text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-white bg-zinc-50 dark:bg-zinc-900"
                                >
                                    <User className="h-4 w-4" />
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-900 focus:outline-none animate-in fade-in slide-in-from-top-1 duration-100">
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                                        >
                                            <LayoutDashboard className="h-4 w-4 text-indigo-500" />
                                            Tableau de bord
                                        </Link>
                                        <hr className="my-1 border-zinc-200 dark:border-zinc-800" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsProfileOpen(false);
                                                setShowLogoutConfirm(true); // Ouvre le pop-up
                                            }}
                                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 transition-colors"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Se déconnecter
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/auth"
                                className="hidden md:flex items-center justify-center px-4 py-1.5 bg-green-600 hover:bg-green-500 dark:bg-green-600 dark:hover:bg-green-500 text-white text-sm font-medium rounded-full transition-colors shadow-sm"
                            >
                                Connexion
                            </Link>
                        )}

                        <button
                            type="button"
                            onClick={() => setIsMenuOpen((value) => !value)}
                            className="rounded-full border border-zinc-200 p-2 text-zinc-600 md:hidden dark:border-zinc-800 dark:text-zinc-300"
                        >
                            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* MOBILE MENU */}
            {isMenuOpen && (
                <div className="fixed inset-x-0 top-[73px] z-[55] border-b border-zinc-200 bg-white/95 px-4 py-4 shadow-sm md:hidden dark:border-zinc-800 dark:bg-zinc-950/95">
                    <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                        {links.map((link) => (
                            <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="rounded-2xl px-3 py-2 transition hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-white">
                                {link.label}
                            </Link>
                        ))}
                        
                        {user ? (
                            <>
                                <Link 
                                    href="/dashboard" 
                                    onClick={() => setIsMenuOpen(false)} 
                                    className="rounded-2xl px-3 py-2 transition hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-white font-semibold text-indigo-600 dark:text-indigo-400"
                                >
                                    Mon Tableau de Bord
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => setShowLogoutConfirm(true)}
                                    className="mt-2 w-full rounded-2xl border border-rose-600 bg-rose-600 px-3 py-3 text-left text-sm font-semibold text-white transition hover:bg-rose-500 dark:border-rose-500 dark:bg-rose-500 dark:hover:bg-rose-400"
                                >
                                    Se déconnecter
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/auth"
                                onClick={() => setIsMenuOpen(false)}
                                className="mt-2 w-full text-center rounded-2xl bg-emerald-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-green-600 hover:bg-green-500"
                            >
                                Connexion
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {/* POP-UP DE CONFIRMATION DE DÉCONNEXION  */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    {/* Backdrop flouté ultra-premium */}
                    <div 
                        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xl dark:bg-zinc-950/60"
                        onClick={() => setShowLogoutConfirm(false)}
                    />
                    
                    {/* Fenêtre de dialogue */}
                    <div className="relative w-full max-w-md transform overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white/90 p-8 shadow-2xl backdrop-blur-md transition-all dark:border-zinc-800 dark:bg-zinc-900/90 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center">
                            {/* Icône animée */}
                            <div className="mb-5 rounded-2xl bg-rose-50 p-4 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                                <AlertTriangle className="h-6 w-6 animate-pulse" />
                            </div>
                            
                            <h3 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                                Confirmer la déconnexion
                            </h3>
                            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                                Êtes-vous sûr de vouloir quitter votre session ? Vous devrez vous réauthentifier pour accéder à votre espace auteur.
                            </p>
                        </div>

                        {/* Boutons d'action épurés */}
                        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:gap-3">
                            <button
                                type="button"
                                onClick={() => setShowLogoutConfirm(false)}
                                className="flex-1 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex-1 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-rose-500 shadow-sm shadow-rose-600/10"
                            >
                                Se déconnecter
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}