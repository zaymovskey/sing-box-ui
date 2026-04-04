import { useTransitionRouter } from "next-view-transitions";

export const usePageTransitionAnimations = () => {
  const router = useTransitionRouter();

  const onClickLink = (url: string) => {
    router.push(url, {
      onTransitionReady: pageFadeAnimation,
    });
  };

  return { onClickLink };
};

const pageFadeAnimation = () => {
  document.documentElement.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: 140,
    easing: "ease-out",
    fill: "forwards",
    pseudoElement: "::view-transition-old(page-content)",
  });

  document.documentElement.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: 180,
    easing: "ease-out",
    fill: "forwards",
    pseudoElement: "::view-transition-new(page-content)",
  });
};
