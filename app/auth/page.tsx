import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form"; // Ajuste le chemin si nécessaire

export default function AuthPage() {
    
    return (
        <main className="flex min-h-screen items-center justify-center p-4">
            <Suspense fallback={
                <div className="flex items-center justify-center p-8 bg-white dark:bg-zinc-900 rounded-[2rem] w-full max-w-2xl h-80 border border-zinc-200 dark:border-zinc-800">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
                </div>
            }>
                <AuthForm />
            </Suspense>
        </main>
    );
}