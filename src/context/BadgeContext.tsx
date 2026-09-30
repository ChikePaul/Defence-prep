import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Badge, BadgeId } from "../types/siwes";
import { getBadges, unlockBadge } from "../utils/badgeSystem";

interface BadgeContextType {
  badges: Badge[];
  unlockedCount: number;
  awardBadge: (id: BadgeId) => void;
  activeNotification: Badge | null;
  dismissNotification: () => void;
}

const BadgeContext = createContext<BadgeContextType | undefined>(undefined);

export const BadgeProvider: React.FC<{ studentId?: string; children: React.ReactNode }> = ({
  studentId = "default",
  children,
}) => {
  const [badges, setBadges] = useState<Badge[]>(() => getBadges(studentId));
  const [activeNotification, setActiveNotification] = useState<Badge | null>(null);

  useEffect(() => {
    setBadges(getBadges(studentId));
  }, [studentId]);

  const awardBadge = (id: BadgeId) => {
    const { newlyUnlocked, badge } = unlockBadge(id, studentId);
    if (newlyUnlocked) {
      setBadges(getBadges(studentId));
      setActiveNotification(badge);

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.2, x: 0.85 },
      });

      setTimeout(() => {
        setActiveNotification((curr) => (curr?.id === badge.id ? null : curr));
      }, 5000);
    }
  };

  const dismissNotification = () => {
    setActiveNotification(null);
  };

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <BadgeContext.Provider
      value={{
        badges,
        unlockedCount,
        awardBadge,
        activeNotification,
        dismissNotification,
      }}
    >
      {children}
    </BadgeContext.Provider>
  );
};

export function useBadges() {
  const context = useContext(BadgeContext);
  if (!context) {
    throw new Error("useBadges must be used within a BadgeProvider");
  }
  return context;
}
