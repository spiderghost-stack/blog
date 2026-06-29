"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/src/contexts/auth-context";
import { isFirebaseConfigured } from "@/src/lib/firebase/config";
import { Loader2, Mail, Lock, UserRound, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

const schema = z.object({
    name: z.string().optional(),
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Au moins 6 caractères"),
});

type FormValues = z.infer<typeof schema>;

const getFirebaseErrorMessage = (error: unknown) => {
    if (typeof error === "object" && error !== null && "code" in error) {
        const code = String((error as { code?: string }).code);
        switch (code) {
            case "auth/email-already-in-use":
                return "Cet email existe déjà. Connectez-vous ou utilisez un autre email.";
            case "auth/wrong-password":
                return "Mot de passe incorrect. Vérifiez votre mot de passe et réessayez.";
            case "auth/user-not-found":
                return "Aucun compte trouvé pour cet email. Créez un compte ou vérifiez l'email.";
            case "auth/invalid-email":
                return "L'adresse email n'est pas valide.";
            case "auth/too-many-requests":
                return "Trop de tentatives. Réessayez plus tard.";
            default:
                return error instanceof Error ? error.message : "Une erreur est survenue.";
        }
    }
    return error instanceof Error ? error.message : "Une erreur est survenue.";
};

export function AuthForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const requestedMode = searchParams.get("mode");
        if (requestedMode === "signup") {
            setMode("signup");
        } else {
            setMode("login");
        }
    }, [searchParams]);

    const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (values: FormValues) => {
        setLoading(true);
        setMessage("");
        try {
            if (!isFirebaseConfigured) {
                throw new Error("Firebase n’est pas encore configuré. Suivez la procédure ci-dessous pour activer l’inscription et la connexion.");
            }
            if (mode === "login") {
                await signIn(values.email, values.password);
                router.push("/dashboard"); // Redirection directe vers le dashboard global
            } else {
                if (!values.name || values.name.length < 2) {
                    throw new Error("Le nom est requis pour s'inscrire (min 2 caractères).");
                }
                await signUp(values.email, values.password, values.name);
                router.push("/dashboard"); // Redirection directe vers le dashboard global
            }
        } catch (error) {
            setMessage(getFirebaseErrorMessage(error));
        } {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setLoading(true);
        setMessage("");
        try {
            if (!isFirebaseConfigured) {
                throw new Error("Firebase n’est pas encore configuré. Activez Google Auth dans votre projet Firebase.");
            }
            await signInWithGoogle();
            router.push("/dashboard"); // Redirection directe après connexion Google réussie
        } catch (error) {
            setMessage(getFirebaseErrorMessage(error));
            setLoading(false);
        }
    };

    const handleReset = async () => {
        setLoading(true);
        setMessage("");
        try {
            const email = getValues("email");
            if (!email) {
                throw new Error("Saisissez votre email avant de demander la réinitialisation.");
            }
            if (!isFirebaseConfigured) {
                throw new Error("Firebase n’est pas encore configuré. Configurez l’email de réinitialisation dans votre projet Firebase.");
            }
            await resetPassword(email);
            setMessage("Email de réinitialisation envoyé avec succès.");
        } catch (error) {
            setMessage(getFirebaseErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    // Détermine si le message est une erreur ou un succès
    const isSuccessMessage = message.includes("envoyé") || message.includes("réussie");

    return (
        <div className="mx-auto flex max-w-2xl flex-col gap-6 rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-indigo-600 p-3 text-white">
                    <Sparkles className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-950 dark:text-white">{mode === "login" ? "Connexion à MindLog" : "Créer un compte"}</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Accédez à votre espace auteur et publiez vos idées.</p>
                </div>
            </div>

            {/* AUDIT : MESSAGES DE RETOUR ET D'ERREUR PLACÉS EN HAUT */}
            {message ? (
                <div className={`p-4 rounded-2xl border text-sm flex items-start gap-3 transition-all ${
                    isSuccessMessage 
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-900/60 dark:text-emerald-200" 
                        : "bg-red-50 border-red-200 text-red-800 dark:bg-red-500/10 dark:border-red-900/60 dark:text-red-200"
                }`}>
                    {isSuccessMessage ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                    )}
                    <span>{message}</span>
                </div>
            ) : null}

            {!isFirebaseConfigured ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-500/10 dark:text-amber-200">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <div className="space-y-2">
                            <p className="font-medium">Firebase n’est pas encore configuré.</p>
                            <ol className="list-decimal space-y-1 pl-5">
                                <li>Créez un projet Firebase.</li>
                                <li>Activez l’authentification email et Google.</li>
                                <li>Ajoutez les variables dans le fichier .env.local.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            ) : null}

            <div className="flex gap-2 rounded-full bg-zinc-100 p-1 dark:bg-zinc-800">
                <button type="button" onClick={() => setMode("login")} className={`flex-1 rounded-full px-4 py-2 text-sm font-medium ${mode === "login" ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-900 dark:text-white" : "text-zinc-500"}`}>
                    Se connecter
                </button>
                <button type="button" onClick={() => setMode("signup")} className={`flex-1 rounded-full px-4 py-2 text-sm font-medium ${mode === "signup" ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-900 dark:text-white" : "text-zinc-500"}`}>
                    S’inscrire
                </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                {mode === "signup" && (
                    <label className="block space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <span className="flex items-center gap-2"><UserRound className="h-4 w-4" />Nom complet</span>
                        <input {...register("name")} className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none dark:border-zinc-700 dark:bg-zinc-950" placeholder="Votre nom" />
                        {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                    </label>
                )}

                <label className="block space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="flex items-center gap-2"><Mail className="h-4 w-4" />Email</span>
                    <input type="email" {...register("email")} className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none dark:border-zinc-700 dark:bg-zinc-950" placeholder="vous@example.com" />
                    {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                </label>

                <label className="block space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="flex items-center gap-2"><Lock className="h-4 w-4" />Mot de passe</span>
                    <input type="password" {...register("password")} className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none dark:border-zinc-700 dark:bg-zinc-950" placeholder="••••••••" />
                    {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
                </label>

                <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-700" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {mode === "login" ? "Se connecter" : "Créer mon compte"}
                </button>
            </form>

            <button type="button" onClick={handleGoogle} className="flex w-full items-center justify-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-900" disabled={loading}>
                {/* LOGO GOOGLE OFFICIEL EN COULEURS AVEC SVG */}
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                Continuer avec Google
            </button>
            
            <div className="text-center">
                <button type="button" onClick={handleReset} className="text-sm font-medium text-indigo-600 hover:underline">Mot de passe oublié ?</button>
            </div>
        </div>
    );
}