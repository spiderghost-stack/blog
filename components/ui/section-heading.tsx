interface SectionHeadingProps {
    eyebrow: string;
    title: string;
    description: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
    return (
        <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">{eyebrow}</p>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">{title}</h2>
            <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400">{description}</p>
        </div>
    );
}
