"use client";

import { useEffect } from "react";

export function StudioMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-reveal", "visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    elements.forEach(element => {
      if (element.getBoundingClientRect().top > window.innerHeight) element.setAttribute("data-reveal", "pending");
      observer.observe(element);
    });
    return () => { observer.disconnect(); elements.forEach(element => element.setAttribute("data-reveal", "visible")); };
  }, []);
  return null;
}
