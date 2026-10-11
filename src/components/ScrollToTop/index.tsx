import { useEffect, useState } from "react";
import LiquidButton from "@/components/ui/LiquidButton";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Top: 0 takes us all the way back to the top of the page
  // Behavior: smooth keeps it smooth!
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // Button is displayed after scrolling for 500 pixels
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="fixed right-8 bottom-8 z-99">
      {isVisible && (
        <LiquidButton onClick={scrollToTop} padding="16px" radius={999}>
          <span className="flex h-5 w-5 items-center justify-center">
            <span className="mt-[3px] block h-2.5 w-2.5 rotate-45 border-t-2 border-l-2 border-black dark:border-white"></span>
          </span>
        </LiquidButton>
      )}
    </div>
  );
}
