'use client';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import CanvasManager from './components/CanvasManager';
import { gsap } from 'gsap';
import { ScrollTrigger, Power3, Power4 } from 'gsap/all';
import SplitType from 'split-type';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: string;
  name: string;
  image: string;
  overview: string;
  galleryImages: string[];
  contributions: string[];
}

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const nameRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const footerRef = useRef<HTMLDivElement>(null);
  const sloganRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const modalTitleRef = useRef<HTMLDivElement>(null);
  const modalOverviewRef = useRef<HTMLDivElement>(null);
  const footerLeftRef = useRef<HTMLDivElement>(null);
  const footerCenterRef = useRef<HTMLDivElement>(null);
  const footerRightRef = useRef<HTMLDivElement>(null);
  const preloaderLeftRef = useRef<HTMLDivElement>(null);
  const preloaderRightRef = useRef<HTMLDivElement>(null);
  const preloaderProgressRef = useRef<HTMLDivElement>(null);
  const preloaderContainerRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const underlineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const contributionsRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const ctaButtonRef = useRef<HTMLDivElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  // Projects array (unchanged)
  const projects = [
    {
      id: 'pga',
      name: 'PGA TOUR Superstore',
      image: '/screenshots/pga.png',
      overview: 'I built a React app for PGA TOUR Superstore, integrating with Salesforce Commerce Cloud to let users book fittings and lessons through the Uschedule API. The responsive UI, styled with Bootstrap, streamlined the booking process and boosted conversions.',
      galleryImages: [
        '/screenshots/pga.png',
        '/projects/pga.png',
        '/projects/pga-4.png',
        '/projects/pga-5.png',
      ],
      contributions: [
        'Crafted a dynamic React booking flow with real-time API calls',
        'Integrated Uschedule API for scheduling',
        'Designed a responsive, accessible UI with Bootstrap',
      ],
    },
    {
      id: 'ugg',
      name: 'UGG',
      image: '/screenshots/ugg.png',
      overview: 'As lead engineer, I shaped UGG’s Salesforce Commerce Cloud storefront, building dynamic PDPs, PLPs, and navigation. My optimizations and leadership with vendors cut page load times by 30%, enhancing user experience across Deckers’ brands.',
      galleryImages: [
        '/screenshots/ugg.png',
        '/projects/ugg.png',
        '/projects/ugg-1.png',
      ],
      contributions: [
        'Developed responsive PDPs and PLPs',
        'Optimized navigation with mega-menus',
        'Guided third-party vendors for seamless integration',
      ],
    },
    {
      id: 'asics',
      name: 'ASICS',
      image: '/screenshots/asics.png',
      overview: 'I developed global contact and warranty forms for ASICS’ Next.js site, powered by Contentstack CMS, supporting regions like Australia and Europe. Using Material-UI CSS and React Hook Forms, I ensured a polished, validated UI, reducing form errors by 40%.',
      galleryImages: [
        '/screenshots/asics.png',
        '/projects/asics.png',
        '/projects/asics-1.png',
        '/projects/asics-2.png',
      ],
      contributions: [
        'Built dynamic forms with Next.js, React Hook Forms, and Material-UI',
        'Integrated Contentstack for content',
        'Enabled region-specific form customizations',
      ],
    },
    {
      id: 'prana',
      name: 'prAna',
      image: '/screenshots/prana.png',
      overview: 'I led prAna’s migration from Magento to Salesforce Commerce Cloud, enhancing PDPs and PLPs and integrating AEM components.',
      galleryImages: [
        '/screenshots/prana.png',
        '/projects/prana.png',
        '/projects/prana-1.png',
        '/projects/prana-2.png',
        '/projects/prana-3.png',
      ],
      contributions: [
        'Migrated Magento storefront to SFCC',
        'Developed checkout, microsites, and shopping tools',
        'Implemented Optimizely for A/B testing',
      ],
    },
    {
      id: 'disney',
      name: 'Disney',
      image: '/screenshots/disney.png',
      overview: 'I revamped Disney Store’s front-end, creating personalized PDPs and optimized navigation, and led Apple Pay integration.',
      galleryImages: [
        '/screenshots/disney.png',
        '/projects/disney.png',
        '/projects/disney-1.png',
        '/projects/disney-2.png',
        '/projects/disney-3.png',
        '/projects/disney-4.png',
      ],
      contributions: [
        'Built personalized PDPs',
        'Integrated Apple Pay for checkout',
        'Led rebranding with a new style guide',
      ],
    },
    {
      id: 'sackcloth',
      name: 'Sackcloth & Ashes',
      image: '/screenshots/sackcloth.png',
      overview: 'I crafted a custom Shopify storefront for Sackcloth & Ashes using Liquid templates, adding micro-interactions and custom Shopify apps for their CMS.',
      galleryImages: [
        '/screenshots/sackcloth.png',
        '/projects/sackcloth.png',
        '/projects/sackcloth-1.png',
        '/projects/sackcloth-2.png',
        '/projects/sackcloth-3.png',
      ],
      contributions: [
        'Developed custom Shopify theme with Liquid',
        'Built out content management system',
        'Revamped style guide',
      ],
    },
  ];

  // Portfolio data (unchanged)
  const portfolioItems = [
    '15x Salesforce B2C Commerce',
    '4x Shopify Implementions',
    '2x Published Apps',
  ];

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant',
    });
  }, []);

  // Preloader Animation (unchanged)
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          gsap.to(preloaderLeftRef.current, {
            x: '-100%',
            duration: 1,
            ease: Power3.easeOut,
          });
          gsap.to(preloaderRightRef.current, {
            x: '100%',
            duration: 1,
            ease: Power3.easeOut,
            onComplete: () => {
              gsap.to(preloaderContainerRef.current, {
                opacity: 0,
                duration: 0.5,
                ease: Power3.easeOut,
                onComplete: () => {
                  setLoading(false);
                },
              });
            },
          });
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(progressInterval);
  }, []);

  // Autoplay for Slider with Underline Animation (unchanged)
  useEffect(() => {
    if (loading) return;

    const autoplayInterval = setInterval(() => {
      if (!isUserInteracting) {
        setActiveSlide((prev) => {
          const nextSlide = (prev + 1) % projects.length;
          window.scrollTo({
            top: slidesRef.current[nextSlide].offsetTop,
            behavior: 'smooth',
          });
          return nextSlide;
        });
      }
    }, 5000);

    const animateUnderline = () => {
      underlineRefs.current.forEach((underline, idx) => {
        if (underline) {
          if (idx === activeSlide) {
            gsap.to(underline, {
              scaleX: 1,
              duration: 0.3,
              ease: 'none',
              transformOrigin: 'left',
            });
          } else if (idx === (activeSlide + 1) % projects.length && !isUserInteracting) {
            gsap.to(underline, {
              scaleX: 1,
              duration: 5,
              ease: 'none',
              transformOrigin: 'left',
              onComplete: () => {
                if (idx !== activeSlide) {
                  gsap.to(underline, {
                    scaleX: 0,
                    duration: 0,
                    ease: 'none',
                    transformOrigin: 'left',
                  });
                }
              },
            });
          } else {
            gsap.to(underline, {
              scaleX: 0,
              duration: 0.3,
              ease: 'none',
              transformOrigin: 'left',
            });
          }
        }
      });
    };

    animateUnderline();

    const unsubscribe = () => {
      gsap.killTweensOf(underlineRefs.current);
    };

    unsubscribe();
    animateUnderline();

    let interactionTimeout: NodeJS.Timeout | null = null;
    const resetInteraction = () => {
      if (interactionTimeout) clearTimeout(interactionTimeout);
      interactionTimeout = setTimeout(() => {
        setIsUserInteracting(false);
      }, 5000);
    };

    const handleInteraction = () => {
      setIsUserInteracting(true);
      resetInteraction();
      const nextIdx = (activeSlide + 1) % projects.length;
      if (underlineRefs.current[nextIdx]) {
        gsap.to(underlineRefs.current[nextIdx], {
          scaleX: 0,
          duration: 0.3,
          ease: 'none',
          transformOrigin: 'left',
        });
      }
    };

    window.addEventListener('scroll', handleInteraction);
    window.addEventListener('click', handleInteraction);

    return () => {
      clearInterval(autoplayInterval);
      if (interactionTimeout) clearTimeout(interactionTimeout);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      unsubscribe();
    };
  }, [loading, isUserInteracting, activeSlide, projects.length]);

  // GSAP Animations and Scroll-Based Slider (unchanged)
  useEffect(() => {
    if (loading) return;
  
    if (nameRef.current) {
      gsap.fromTo(
        nameRef.current,
        { opacity: 0, y: -50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: Power3.easeOut,
          delay: 0.5,
          immediateRender: false,
        }
      );
    }
  
    if (sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: Power3.easeOut,
          delay: 1.2,
          immediateRender: false,
        }
      );
    }
  
    if (skillsRef.current) {
      gsap.fromTo(
        skillsRef.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: Power3.easeOut,
          delay: 1.2,
          immediateRender: false,
        }
      );
    }
  
    if (sloganRef.current) {
      gsap.fromTo(
        sloganRef.current,
        { opacity: 0, y: -30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: Power3.easeOut,
          delay: 0.7,
          immediateRender: false,
        }
      );
    }
  
    if (footerLeftRef.current) {
      gsap.fromTo(footerLeftRef.current, { opacity: 0, y: 20 }, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 2,
        ease: Power3.easeOut,
        immediateRender: false,
      });
    }
  
    if (footerCenterRef.current) {
      gsap.fromTo(footerCenterRef.current, { opacity: 0, y: 20 }, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 2.2,
        ease: Power3.easeOut,
        immediateRender: false,
      });
    }
  
    if (footerRightRef.current) {
      gsap.fromTo(footerRightRef.current, { opacity: 0, y: 20 }, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 2.4,
        ease: Power3.easeOut,
        immediateRender: false,
      });
    }
  
    if (heroRef.current) {
      gsap.to(heroRef.current, {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.6,
        ease: Power4.easeOut,
        delay: 1.5,
        onComplete: () => {
          setAnimationComplete(true);
        },
      });
    }
  
    slidesRef.current.forEach((slide, index) => {
      ScrollTrigger.create({
        trigger: slide,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          setActiveSlide(index);
          setIsUserInteracting(true);
        },
        onEnterBack: () => {
          setActiveSlide(index);
          setIsUserInteracting(true);
        },
      });
    });
  
    ScrollTrigger.create({
      trigger: sliderRef.current,
      start: 'top top',
      end: 'bottom bottom',
      snap: {
        snapTo: 1 / (projects.length - 1),
        duration: { min: 0.2, max: 0.8 },
        ease: Power3.easeOut,
      },
    });
  
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [loading, projects.length]);

  // Smooth scrolling for navigation clicks (unchanged)
  const handleNavClick = (projectIndex: number) => {
    setActiveSlide(projectIndex);
    window.scrollTo({
      top: slidesRef.current[projectIndex].offsetTop,
      behavior: 'smooth',
    });
    setIsUserInteracting(true);
  };

  // Open Modal (unchanged)
  const openModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Modal Animations (unchanged)
  useEffect(() => {
    if (isModalOpen && modalTitleRef.current && modalOverviewRef.current) {
      const titleSplit = new SplitType(modalTitleRef.current, {
        types: 'lines,words',
        lineClass: 'modal-line',
      });

      const overviewSplit = new SplitType(modalOverviewRef.current, {
        types: 'lines',
        lineClass: 'modal-line',
      });

      gsap.set('.modal-line', { opacity: 0, y: 50, skewY: 8 });

      const tl = gsap.timeline({ delay: 0.2 });

      tl.to(titleSplit.lines, {
        opacity: 1,
        y: 0,
        skewY: 0,
        duration: 1.1,
        ease: Power4.easeOut,
        stagger: 0.08,
      })
      .to(
        overviewSplit.lines,
        {
          opacity: 1,
          y: 0,
          skewY: 0,
          duration: 1,
          ease: Power4.easeOut,
          stagger: 0.06,
        },
        '-=0.6'
      );
    }
  }, [isModalOpen]);

  // Modal Scroll Animations (unchanged)
  useEffect(() => {
    if (isModalOpen && contributionsRef.current && dividerRef.current && ctaButtonRef.current && modalContainerRef.current) {
      const contributions = contributionsRef.current;
      const divider = dividerRef.current;
      const ctaButton = ctaButtonRef.current;
      const scroller = modalContainerRef.current;

      gsap.fromTo(
        contributions.querySelector('h3'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: Power3.easeOut,
          scrollTrigger: {
            scroller: scroller,
            trigger: contributions,
            start: 'top 85%',
            end: 'top 65%',
            scrub: false,
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        contributions.querySelectorAll('li'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: Power3.easeOut,
          scrollTrigger: {
            scroller: scroller,
            trigger: contributions,
            start: 'top 85%',
            end: 'top 65%',
            scrub: false,
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        divider,
        { scaleX: 0, transformOrigin: 'left' },
        {
          scaleX: 1,
          duration: 1,
          ease: Power3.easeOut,
          scrollTrigger: {
            scroller: scroller,
            trigger: divider,
            start: 'top 85%',
            end: 'top 65%',
            scrub: false,
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        ctaButton.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: Power3.easeOut, // Fixed typo from "Power3.ease Hildegard"
          scrollTrigger: {
            scroller: scroller,
            trigger: ctaButton,
            start: 'top 85%',
            end: 'top 65%',
            scrub: false,
            toggleActions: 'play none none reverse',
          },
        }
      );

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (
            trigger.trigger === contributions ||
            trigger.trigger === divider ||
            trigger.trigger === ctaButton
          ) {
            trigger.kill();
          }
        });
      };
    }
  }, [isModalOpen]);

  // Modal Close (unchanged)
  useEffect(() => {
    if (!isModalOpen) {
      const timer = setTimeout(() => {
        setSelectedProject(null);
        document.body.style.overflow = 'auto';
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  // Tooltip Logic (unchanged)
  useEffect(() => {
    if (loading) return;

    const checkMouseOverSlide = (e: MouseEvent | null) => {
      const mouseX = e ? e.clientX : window.innerWidth / 2;
      const mouseY = e ? e.clientY : window.innerHeight / 2;

      let isOverSlide = false;
      slidesRef.current.forEach((slide) => {
        if (slide) {
          const imageContainer = slide.querySelector('.cursor-pointer');
          if (imageContainer) {
            const rect = imageContainer.getBoundingClientRect();
            if (
              mouseX >= rect.left &&
              mouseX <= rect.right &&
              mouseY >= rect.top &&
              mouseY <= rect.bottom
            ) {
              isOverSlide = true;
              setTooltipVisible(true);
              setTooltipPosition({ x: mouseX + 10, y: mouseY + 10 });
            }
          }
        }
      });

      if (!isOverSlide) {
        setTooltipVisible(false);
      }
    };

    checkMouseOverSlide(null);
    window.addEventListener('mousemove', checkMouseOverSlide);

    return () => {
      window.removeEventListener('mousemove', checkMouseOverSlide);
    };
  }, [loading]);

  // Handle mouse move for tooltip (unchanged)
  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPosition({ x: e.clientX + 10, y: e.clientY + 10 });
  };

  return (
    <>
      {/* Preloader (unchanged) */}
      {loading && (
        <div ref={preloaderContainerRef} className="fixed inset-0 z-50 overflow-hidden">
          <div ref={preloaderLeftRef} className="absolute top-0 left-0 w-1/2 h-full bg-[#1A1A1A]" />
          <div ref={preloaderRightRef} className="absolute top-0 right-0 w-1/2 h-full bg-[#1A1A1A]" />
          <div ref={preloaderProgressRef} className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl text-gray-300">{loadProgress}%</div>
          </div>
        </div>
      )}

      {/* Tooltip (unchanged) */}
      {(tooltipVisible && animationComplete) && (
        <div
          className="fixed z-50 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded"
          style={{ top: tooltipPosition.y, left: tooltipPosition.x }}
        >
          View Case Study
        </div>
      )}

      {/* Main Content */}
      <div className={`min-h-screen bg-[#1A1A1A] text-white font-custom overflow-x-hidden ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Canvas Background (unchanged) */}
        <CanvasManager />

        {/* Header: Name and Slogan */}
        <div className="fixed top-4 left-0 right-0 z-20 flex justify-between items-center px-4 sm:px-6">
          <div ref={nameRef} className="opacity-0">
            <h1 className="text-[32px] sm:text-[56px] font-extralight tracking-tight">Dillon Marinez</h1>
          </div>
          <div ref={sloganRef} className="text-right opacity-0">
            <p className="text-sm sm:text-lg font-extralight text-white">
              Crafting Exceptional<br />Experiences
            </p>
          </div>
        </div>

        {/* Slider Section */}
        <div ref={sliderRef} className="relative">
          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={(el) => {
                if (el) slidesRef.current[index] = el;
              }}
              className="h-screen flex items-center justify-center px-4 snap-start"
            >
              {/* Desktop Sidebar (Hidden on Mobile) */}
              <div
                ref={sidebarRef}
                className="hidden sm:block fixed top-1/2 left-6 transform -translate-y-1/2 z-20 opacity-0"
              >
                <h3 className="text-lg font-extralight text-white mb-3">
                  Selected Works ({projects.length})
                </h3>
                <ul>
                  {projects.map((proj, idx) => (
                    <li key={proj.id} className="relative text-sm/7">
                      <button
                        onClick={() => handleNavClick(idx)}
                        className={`selected-link relative inline-block text-sm font-extralight tracking-wide ${
                          activeSlide === idx ? 'text-white' : 'text-gray-400'
                        }`}
                      >
                        {proj.name}
                        <span
                          ref={(el) => {
                            underlineRefs.current[idx] = el;
                          }}
                          className="absolute bottom-0 left-0 w-full h-[1px] bg-white transform scale-x-0 origin-left"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Skills Section (Hidden on Mobile) */}
              <div
                ref={skillsRef}
                className="hidden sm:block fixed top-1/2 right-6 transform -translate-y-1/2 z-20 opacity-0"
              >
                <h3 className="text-lg font-extralight mb-3">
                  Projects Launched
                </h3>
                <ul>
                  {portfolioItems.map((portfolioItem, idx) => (
                    <li key={idx} className="text-sm/7">
                      <span className="text-sm font-extralight text-gray-400">{portfolioItem}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Slide Content */}
              <div
                ref={index === 0 ? heroRef : null}
                className={`relative flex flex-col items-center justify-center w-full max-w-4xl p-8 z-10 ${index === 0 ? 'opacity-0 scale-[0.95]' : null}`}
              >
                <div
                  className="relative w-full h-[300px] sm:h-[500px] mb-6 cursor-pointer"
                  onClick={() => openModal(project)}
                  onMouseEnter={() => setTooltipVisible(true)}
                  onMouseLeave={() => setTooltipVisible(false)}
                  onMouseMove={handleMouseMove}
                >
                  <Image
                    src={project.image}
                    alt={`${project.name} screenshot`}
                    fill
                    style={{ objectFit: 'cover', objectPosition: index === 5 || index === 4 ?  'center center' : 'left center' , opacity: 0.9 }} 
                    priority
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && selectedProject && (
            <motion.div
              key="modal"
              ref={modalContainerRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-b from-black/80 via-[#0A0A0A] to-[#1A1A1A]"
            >
              <motion.div
                key="modal-content"
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 80, opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative min-h-screen flex flex-col items-center justify-start py-12 px-4 sm:px-12"
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer modal-close fixed top-4 right-4 text-gray-400 hover:text-white z-50 transition-colors duration-300"
                >
                  <svg
                    className="w-10 h-10 sm:w-12 sm:h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div className="w-full max-w-6xl">
                  <span className="modal-line-wrapper text-center" ref={modalTitleRef}>
                    <h2
                      className="text-5xl sm:text-8xl font-extralight tracking-tight mb-12 sm:mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-teal-400"
                    >
                      {selectedProject.name}
                    </h2>
                  </span>
                  <div className="w-full mb-16 sm:mb-20 text-center">
                    <p
                      ref={modalOverviewRef}
                      className="text-base sm:text-xl font-extralight text-gray-300 leading-relaxed max-w-3xl mx-auto"
                    >
                      {selectedProject.overview}
                    </p>
                  </div>
                  <div className="w-full mb-16 sm:mb-20 space-y-12 sm:space-y-16">
                    {selectedProject.galleryImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="w-full relative h-[40vh] sm:h-[90vh] rounded-xl overflow-hidden shadow-2xl"
                      >
                        <Image
                          src={img}
                          alt={`${selectedProject.name} screenshot ${idx + 1}`}
                          style={{ objectPosition: 'center center' }} 
                          fill
                          className="object-cover opacity-95 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                      </div>
                    ))}
                  </div>
                  <div ref={contributionsRef} className="w-full mb-16 sm:mb-20">
                    <h3 className="text-xl sm:text-3xl font-extralight uppercase text-teal-400 mb-8 sm:mb-10 tracking-widest">
                      Key Contributions
                    </h3>
                    <ul className="grid grid-cols-1 gap-6 sm:gap-8">
                      {selectedProject.contributions.map((contribution, idx) => (
                        <li
                          key={idx}
                          className="text-base sm:text-xl font-extralight text-gray-200 leading-relaxed relative pl-8"
                        >
                          <span className="absolute left-0 top-2.5 w-3 h-3 bg-teal-400 rounded-full" />
                          {contribution}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div ref={dividerRef} className="w-full h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent mb-16 sm:mb-20" />
                  <div ref={ctaButtonRef} className="text-center mb-16 sm:mb-20">
                    <p className="text-base sm:text-xl font-extralight text-gray-300 mb-8 sm:mb-10">
                      Check out more of my projects!
                    </p>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="cursor-pointer modal-cta-button relative px-10 sm:px-12 py-4 sm:py-5 bg-transparent border border-teal-400 text-white text-xs sm:text-sm font-extralight uppercase tracking-widest transition-all duration-500 overflow-hidden group"
                    >
                      <span className="relative z-10">Discover More Projects</span>
                      <span className="absolute inset-0 bg-teal-400/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer
          ref={footerRef}
          className="fixed bottom-6 left-6 right-6 flex flex-col sm:flex-row justify-between text-gray-400 text-xs z-20 space-y-6 sm:space-y-0"
        >
          <div ref={footerLeftRef} className="flex flex-col space-y-2 opacity-0">
            <div>
              <h4 className="text-xs font-extralight text-gray-400 mb-1">About</h4>
              <p className="text-sm font-extralight text-white">
                Senior frontend developer based in California. <br />Focused on building engaging user interfaces.
              </p>
            </div>
          </div>
          <div className="flex max-sm:flex-row max-sm:gap-4 flex-col md:justify-end">
          <div ref={footerCenterRef} className="flex flex-col space-y-2 opacity-0 sm:order-1 sm:flex-1 sm:text-center md:mx-auto md:left-0 md:right-0 md:absolute md:justify-end md:bottom-6 md:fixed">
            <h4 className="text-xs font-extralight text-gray-400 mb-1">Hire Me (Available May 2025)</h4>
            <p className="text-sm font-extralight text-white">
              <a
                href="mailto:dillonmarinez@gmail.com"
                className="text-white relative group"
              >
                dillonmarinez@gmail.com
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gray-400 transition-all duration-300 group-hover:w-full" />
              </a>
            </p>
          </div>
          <div ref={footerRightRef} className="flex flex-col justify-end space-y-2 opacity-0 sm:order-2">
            <h4 className="text-xs font-extralight text-gray-400 mb-1">Social Media</h4>
            <div className="flex space-x-4">
              <Link href="https://instagram.com/dillonmarinez" className="text-xs font-extralight text-white relative group">
                Instagram
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gray-400 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/dillon-marinez-9810b6114/"
                className="text-xs font-extralight text-white relative group"
              >
                LinkedIn
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gray-400 transition-all duration-300 group-hover:w-full" />
              </Link>
            </div>
          </div>
          </div>
        </footer>
      </div>
    </>
  );
}