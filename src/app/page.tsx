'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import CanvasManager from './components/CanvasManager';
import {
  capabilities,
  experience,
  projects,
  proofPoints,
  type Project,
} from './data';

const ease = [0.16, 1, 0.3, 1] as const;

function CloseButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group fixed right-4 top-4 z-[70] grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-black/20 text-white backdrop-blur-md transition hover:border-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8fffe8] sm:right-7 sm:top-7"
    >
      <span className="absolute h-px w-5 rotate-45 bg-current transition-transform duration-500 group-hover:rotate-[135deg]" />
      <span className="absolute h-px w-5 -rotate-45 bg-current transition-transform duration-500 group-hover:rotate-45" />
    </button>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`project-${project.id}-title`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease }}
      className="fixed inset-0 z-[60] overflow-y-auto bg-[#101010]/98 text-white"
    >
      <CloseButton onClick={onClose} label={`Close ${project.name} case study`} />

      <div className="mx-auto min-h-screen max-w-[1500px] px-5 pb-24 pt-24 sm:px-10 sm:pt-28 lg:px-16">
        <motion.div
          initial={{ y: 42, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease }}
        >
          <div className="mb-7 flex items-center justify-between border-b border-white/15 pb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 sm:text-xs">
            <span>Case {project.index}</span>
            <span>{project.year}</span>
          </div>

          <h2
            id={`project-${project.id}-title`}
            className="max-w-6xl text-[clamp(3.2rem,10vw,9.5rem)] font-extralight leading-[0.82] tracking-[-0.065em]"
          >
            {project.name}
          </h2>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20">
            <div>
              <p className="max-w-3xl text-xl font-extralight leading-relaxed text-white/72 sm:text-3xl">
                {project.overview}
              </p>
              <p className="mt-10 max-w-3xl text-2xl font-extralight leading-snug text-[#a6ffed] sm:text-4xl">
                {project.outcome}
              </p>
            </div>

            <dl className="grid content-start gap-6 border-l border-white/15 pl-5 sm:grid-cols-2 lg:grid-cols-1 lg:pl-8">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.22em] text-white/40">Role</dt>
                <dd className="mt-2 text-sm text-white/90">{project.role}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.22em] text-white/40">Context</dt>
                <dd className="mt-2 text-sm text-white/90">{project.context}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.22em] text-white/40">Stack</dt>
                <dd className="mt-2 text-sm leading-relaxed text-white/90">
                  {project.stack.join(' / ')}
                </dd>
              </div>
            </dl>
          </div>
        </motion.div>

        <div className="mt-20 space-y-6 sm:mt-28 sm:space-y-10">
          {project.galleryImages.map((src, index) => (
            <motion.figure
              key={src}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.8, ease }}
              className="relative aspect-[16/10] overflow-hidden bg-white/5 sm:aspect-[16/9]"
            >
              <Image
                src={src}
                alt={`${project.name} interface view ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 1400px"
                className="object-cover"
              />
              <figcaption className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/55 mix-blend-difference sm:bottom-5 sm:left-5">
                {project.index}.{String(index + 1).padStart(2, '0')}
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <div className="mt-20 grid gap-12 border-t border-white/15 pt-10 sm:mt-28 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#8fffe8]">Selected contribution</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/45">{project.credit}</p>
          </div>
          <ol className="space-y-8">
            {project.contributions.map((contribution, index) => (
              <li key={contribution} className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-white/10 pb-8">
                <span className="font-mono text-xs text-white/35">0{index + 1}</span>
                <span className="text-xl font-extralight leading-snug sm:text-3xl">{contribution}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-24 flex flex-col items-start justify-between gap-8 border-t border-white/15 pt-10 sm:flex-row sm:items-end">
          <p className="max-w-2xl text-[clamp(2.2rem,6vw,5.5rem)] font-extralight leading-[0.95] tracking-[-0.05em]">
            Have a complex idea?
            <br />
            Let&apos;s make it clear.
          </p>
          <a
            href="mailto:dillonmarinez@gmail.com?subject=Project%20inquiry"
            className="group inline-flex items-center gap-3 border-b border-[#8fffe8] pb-2 text-sm uppercase tracking-[0.2em] text-[#8fffe8]"
          >
            Start a conversation
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function ProfileModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease }}
      className="fixed inset-0 z-[60] overflow-y-auto bg-[#e8fffa] text-[#111]"
    >
      <CloseButton onClick={onClose} label="Close profile" />

      <div className="mx-auto max-w-[1500px] px-5 pb-20 pt-24 sm:px-10 sm:pt-28 lg:px-16">
        <div className="border-b border-black/20 pb-5 font-mono text-[10px] uppercase tracking-[0.22em] text-black/55 sm:text-xs">
          Profile / California + Miami / 2026
        </div>

        <motion.h2
          id="profile-title"
          initial={{ y: 42, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease }}
          className="mt-8 max-w-7xl text-[clamp(3.4rem,9vw,9rem)] font-extralight leading-[0.84] tracking-[-0.065em]"
        >
          Engineer by discipline.
          <br />
          <span className="text-black/28">Creative by instinct.</span>
        </motion.h2>

        <div className="mt-16 grid grid-cols-2 border-y border-black/20 sm:grid-cols-4">
          {proofPoints.map((point) => (
            <div key={point.label} className="border-black/20 px-3 py-7 odd:border-r sm:border-r sm:last:border-r-0 sm:px-6">
              <div className="text-4xl font-extralight tracking-[-0.05em] sm:text-6xl">{point.value}</div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-black/45">{point.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
          <div className="text-xs uppercase tracking-[0.22em] text-black/45">About</div>
          <div>
            <p className="max-w-4xl text-2xl font-extralight leading-snug sm:text-4xl">
              Senior software engineer and technical lead with 10+ years building commerce platforms, internal tools, mobile applications, and digital products for major brands and growing organizations.
            </p>
            <p className="mt-8 max-w-3xl text-base leading-relaxed text-black/58 sm:text-lg">
              I work across product thinking, frontend architecture, CMS platforms, APIs, performance, and delivery—turning complicated requirements into software that feels straightforward to use and maintain.
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-12 border-t border-black/20 pt-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
          <div className="text-xs uppercase tracking-[0.22em] text-black/45">Capabilities</div>
          <ul className="grid sm:grid-cols-2">
            {capabilities.map((capability, index) => (
              <li key={capability} className="flex items-center gap-5 border-b border-black/15 py-5 text-xl font-extralight sm:text-2xl">
                <span className="font-mono text-[10px] text-black/35">0{index + 1}</span>
                {capability}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-20 grid gap-12 border-t border-black/20 pt-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
          <div className="text-xs uppercase tracking-[0.22em] text-black/45">Selected experience</div>
          <div>
            {experience.map((item) => (
              <div key={`${item.company}-${item.years}`} className="grid gap-2 border-b border-black/15 py-6 sm:grid-cols-[7rem_1fr_1fr] sm:gap-6">
                <span className="font-mono text-[10px] tracking-[0.12em] text-black/38">{item.years}</span>
                <div>
                  <div className="text-lg">{item.company}</div>
                  <div className="mt-1 text-sm text-black/48">{item.role}</div>
                </div>
                <div className="text-sm leading-relaxed text-black/55">{item.focus}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 grid gap-12 border-t border-black/20 pt-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
          <div className="text-xs uppercase tracking-[0.22em] text-black/45">Independent practice</div>
          <div>
            <p className="max-w-4xl text-2xl font-extralight leading-snug sm:text-4xl">
              Principal Consultant at Evara Group LLC, established 2025.
            </p>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-black/55 sm:text-base">
              Independent consulting engagements, contracts, and payments are handled through Evara Group LLC.
            </p>
          </div>
        </div>

        <div className="mt-24 flex flex-col justify-between gap-8 border-t border-black/20 pt-10 sm:flex-row sm:items-end">
          <p className="text-[clamp(2.8rem,7vw,7rem)] font-extralight leading-[0.86] tracking-[-0.06em]">
            Build something
            <br />
            worth remembering.
          </p>
          <div className="flex flex-col items-start gap-3 text-sm">
            <a className="border-b border-black pb-1" href="mailto:dillonmarinez@gmail.com">dillonmarinez@gmail.com</a>
            <a href="https://www.linkedin.com/in/dillon-marinez-9810b6114/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a href="https://github.com/dimarinez/" target="_blank" rel="noreferrer">GitHub ↗</a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [introProgress, setIntroProgress] = useState(0);
  const [cursorLabel, setCursorLabel] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setIntroProgress(100);
      setIntroVisible(false);
      return;
    }

    const interval = window.setInterval(() => {
      setIntroProgress((current) => Math.min(current + 5, 100));
    }, 20);
    const timeout = window.setTimeout(() => setIntroVisible(false), 900);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number((visible.target as HTMLElement).dataset.index);
        if (!Number.isNaN(index)) setActiveSlide(index);
      },
      { threshold: [0.35, 0.55, 0.75] },
    );

    sectionRefs.current.forEach((section) => section && observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const overlayOpen = Boolean(selectedProject) || profileOpen;
    document.body.style.overflow = overlayOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject, profileOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setSelectedProject(null);
      setProfileOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const scrollToProject = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <AnimatePresence>
        {introVisible && (
          <motion.div
            aria-hidden="true"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#171717] text-white"
          >
            <motion.div
              exit={{ x: '-100%' }}
              transition={{ duration: 0.55, ease }}
              className="absolute inset-y-0 left-0 w-1/2 bg-[#171717]"
            />
            <motion.div
              exit={{ x: '100%' }}
              transition={{ duration: 0.55, ease }}
              className="absolute inset-y-0 right-0 w-1/2 bg-[#171717]"
            />
            <div className="relative z-10 flex items-baseline gap-2 font-mono">
              <span className="text-4xl font-light tabular-nums sm:text-6xl">{String(introProgress).padStart(3, '0')}</span>
              <span className="text-xs text-white/40">/100</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="min-h-screen overflow-x-hidden bg-[#171717] text-white"
        aria-hidden={selectedProject || profileOpen ? true : undefined}
        inert={selectedProject || profileOpen ? true : undefined}
      >
        <CanvasManager />

        <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-start justify-between px-4 pt-4 sm:px-6 sm:pt-5">
          <div className="pointer-events-auto text-left">
            <h1 className="text-[30px] font-extralight leading-none tracking-[-0.05em] lg:text-[52px]">Dillon Marinez</h1>
            <button
              type="button"
              onClick={() => scrollToProject(0)}
              className="mt-2 hidden font-mono text-[9px] uppercase tracking-[0.22em] text-white/42 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8fffe8] lg:block"
            >
              California + Miami / Available for select projects
            </button>
          </div>

          <div className="pointer-events-auto flex items-start gap-5 sm:gap-8">
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="group text-right text-[10px] uppercase tracking-[0.2em] text-white/65 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8fffe8] sm:text-xs"
            >
              <span className="block">Profile</span>
              <span className="mt-1 hidden h-px w-full origin-right scale-x-0 bg-[#8fffe8] transition-transform duration-300 group-hover:scale-x-100 sm:block" />
            </button>
            <p className="hidden text-right text-sm font-extralight leading-tight text-white/80 lg:block">
              Senior Software Engineer
              <br />
              Creative Technologist
            </p>
          </div>
        </header>

        <nav aria-label="Selected work" className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
          <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.22em] text-white/36">Selected work</p>
          <ol className="space-y-2.5">
            {projects.map((project, index) => (
              <li key={project.id}>
                <button
                  type="button"
                  onClick={() => scrollToProject(index)}
                  aria-current={activeSlide === index ? 'true' : undefined}
                  className={`group flex items-center gap-3 text-left text-sm font-extralight transition ${activeSlide === index ? 'text-white' : 'text-white/35 hover:text-white/70'}`}
                >
                  <span className={`h-px transition-all duration-500 ${activeSlide === index ? 'w-6 bg-[#8fffe8]' : 'w-2 bg-white/25 group-hover:w-4'}`} />
                  {project.name}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <aside className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 text-right lg:block">
          <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.22em] text-white/36">Proof in practice</p>
          <div className="space-y-3">
            <p><span className="text-2xl font-extralight">10+</span><span className="ml-2 text-xs text-white/38">years</span></p>
            <p><span className="text-2xl font-extralight">15+</span><span className="ml-2 text-xs text-white/38">commerce launches</span></p>
            <p><span className="text-2xl font-extralight">4</span><span className="ml-2 text-xs text-white/38">published apps</span></p>
            <p className="text-[10px] uppercase tracking-[0.17em] text-[#8fffe8]">Salesforce certified</p>
          </div>
        </aside>

        <main className="relative z-10 snap-y snap-mandatory">
          {projects.map((project, index) => (
            <section
              key={project.id}
              ref={(element) => {
                sectionRefs.current[index] = element;
              }}
              data-index={index}
              className="relative flex min-h-[100svh] snap-start items-center justify-center px-4 pb-24 pt-24 sm:px-20 sm:pb-20 sm:pt-28 lg:px-48"
            >
              <motion.div
                initial={false}
                animate={activeSlide === index ? { opacity: 1, scale: 1 } : { opacity: 0.22, scale: 0.965 }}
                transition={{ duration: 0.65, ease }}
                className="w-full max-w-5xl"
              >
                <div className="mb-4 flex items-end justify-between sm:mb-5">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#8fffe8]">Case {project.index} / {project.year}</p>
                    <h2 className="mt-2 text-[clamp(2rem,5vw,4.8rem)] font-extralight leading-none tracking-[-0.055em]">{project.name}</h2>
                  </div>
                  <p className="hidden max-w-[18rem] text-right text-xs leading-relaxed text-white/42 sm:block">{project.role}<br />{project.context}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  onMouseEnter={() => setCursorLabel(true)}
                  onMouseLeave={() => setCursorLabel(false)}
                  onMouseMove={(event) => setCursorPosition({ x: event.clientX, y: event.clientY })}
                  className="group relative block aspect-[4/4.35] w-full overflow-hidden bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8fffe8] sm:aspect-[16/9]"
                  aria-label={`Open ${project.name} case study`}
                >
                  <Image
                    src={project.image}
                    alt={`${project.name} featured interface`}
                    fill
                    priority={index < 2}
                    sizes="(max-width: 640px) 100vw, 1024px"
                    className="object-cover opacity-90 transition duration-1000 ease-out group-hover:scale-[1.025] group-hover:opacity-100"
                    style={{ objectPosition: index >= 4 ? 'center' : 'left center' }}
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/5" />
                  <span className="absolute bottom-4 left-4 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white sm:hidden">
                    View case study <span aria-hidden="true">↗</span>
                  </span>
                </button>

                <div className="mt-4 flex items-start justify-between gap-5 sm:mt-5">
                  <p className="max-w-xl text-sm font-extralight leading-relaxed text-white/65 sm:text-base">{project.overview}</p>
                  <p className="hidden shrink-0 font-mono text-[9px] uppercase tracking-[0.16em] text-white/35 sm:block">{project.stack.join(' / ')}</p>
                </div>
              </motion.div>
            </section>
          ))}
        </main>

        <div className="pointer-events-none fixed inset-x-6 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-30 flex items-end justify-between gap-6 sm:bottom-5">
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="pointer-events-auto flex min-h-11 shrink-0 items-center whitespace-nowrap text-left text-[10px] uppercase tracking-[0.18em] text-white/55 transition hover:text-white lg:hidden"
          >
            <span className="hidden min-[360px]:inline">10+ years / </span>Profile
          </button>
          <div className="hidden max-w-xs text-xs font-extralight leading-relaxed text-white/45 lg:block">
            Commerce platforms, digital products, and systems built for real-world complexity.
          </div>
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 font-mono text-[9px] tracking-[0.18em] text-white/40 sm:flex">
            <span className="text-white">{String(activeSlide + 1).padStart(2, '0')}</span>
            <span className="h-px w-8 bg-white/20"><span className="block h-full bg-[#8fffe8] transition-all duration-500" style={{ width: `${((activeSlide + 1) / projects.length) * 100}%` }} /></span>
            <span>{String(projects.length).padStart(2, '0')}</span>
          </div>
          <a
            href="mailto:dillonmarinez@gmail.com?subject=Project%20inquiry"
            className="pointer-events-auto flex min-h-11 shrink-0 items-center whitespace-nowrap text-[10px] uppercase tracking-[0.18em] text-white/55 transition hover:text-[#8fffe8]"
          >
            <span className="hidden min-[360px]:inline">Let&apos;s talk</span>
            <span className="min-[360px]:hidden">Contact</span> ↗
          </a>
        </div>

        <AnimatePresence>
          {cursorLabel && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="pointer-events-none fixed z-40 hidden h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#8fffe8] text-center font-mono text-[9px] uppercase tracking-[0.14em] text-black sm:grid"
              style={{ left: cursorPosition.x, top: cursorPosition.y }}
            >
              View<br />case
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
        {profileOpen && <ProfileModal onClose={() => setProfileOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
