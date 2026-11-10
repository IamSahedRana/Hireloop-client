/** Shared dashboard page header: breadcrumb + title + subtitle (22px Inter Semi Bold #ededef). */
export function DashboardPageHeader({
    section,
    title,
    subtitle,
}: {
    section: string
    title: string
    subtitle: string
}) {
    return (
        <>
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm">
                <span className="text-white/50">{section}</span>
                <span aria-hidden className="text-white/30">/</span>
                <span className="text-white/90">{title}</span>
            </nav>

            <header className="mb-8 flex flex-col gap-1.5">
                <h1 className="font-heading text-[28px] leading-[1.15] font-bold tracking-[-0.02em] text-white">
                    {title}
                </h1>
                <p className="text-sm text-white/60">{subtitle}</p>
            </header>
        </>
    )
}
