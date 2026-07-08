export function TrustedBy() {
  return (
    <section className="py-12 border-y border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 md:px-6">
        <p className="text-center text-sm font-medium text-slate-500 mb-8 uppercase tracking-wider">
          Trusted by innovative schools and parents worldwide
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {/* Placeholder Logos */}
          <div className="flex items-center gap-2 text-xl font-bold font-heading text-slate-800 dark:text-slate-200">
            <div className="w-8 h-8 rounded bg-primary-blue/20"></div>
            EduTech
          </div>
          <div className="flex items-center gap-2 text-xl font-bold font-heading text-slate-800 dark:text-slate-200">
            <div className="w-8 h-8 rounded-full bg-primary-green/20"></div>
            GlobalSchools
          </div>
          <div className="flex items-center gap-2 text-xl font-bold font-heading text-slate-800 dark:text-slate-200">
            <div className="w-8 h-8 rotate-45 bg-accent-orange/20"></div>
            FutureKids
          </div>
          <div className="flex items-center gap-2 text-xl font-bold font-heading text-slate-800 dark:text-slate-200">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20"></div>
            TechAcademy
          </div>
          <div className="hidden md:flex items-center gap-2 text-xl font-bold font-heading text-slate-800 dark:text-slate-200">
            <div className="w-8 h-8 rounded-full border-[4px] border-rose-500/20"></div>
            ParentOrg
          </div>
        </div>
      </div>
    </section>
  )
}
