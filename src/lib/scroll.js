export function scroll(node, { onEnter, onLeave }) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        onEnter();
      } else {
        onLeave();
      }
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, // Trigger when 50% of the element is visible
    }
  );

  observer.observe(node);

  return {
    destroy() {
      observer.unobserve(node);
    },
  };
}