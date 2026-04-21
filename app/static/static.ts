import { act } from "react";

  export const colors = [
    "#065f46",
    "#92400e",
    "#9a3412",
    "#7f1d1d",
    "#581c87",
    "#047857",
    "#a16207",
    "#b45309",
    "#dc2626",
    "#7e22ce",
    "#10b981",
    "#fbbf24",
    "#fb923c",
    "#f87171",
    "#c084fc",
    "#1e3a8a",
    "#0f766e",
    "#365314",
    "#701a1a",
    "#374151",
    "#2563eb",
    "#0891b2",
    "#4d7c0f",
    "#be185d",
    "#6b7280",
    "#60a5fa",
    "#67e8f9",
    "#a3e635",
    "#f472b6",
    "#9ca3af",
  ];

  export const options = [
  { label: "Open card", icon: "/images/opencard.svg" , action: "open" },
  { label: "Edit labels", icon: "/images/label.svg" , action: "Edit labels" },
  { label: "Change members", icon: "/images/user.svg", action: "Change Members" },
  { label: "Change cover", icon: "/images/image.svg" },
  { label: "Edit dates", icon: "/images/clock.svg" },
  { label: "Move", icon: "/images/right-arrow.png" },
  { label: "Copy card", icon: "/images/copy.svg" },
  { label: "Copy link", icon: "/images/link.svg" },
  { label: "Mirror", icon: "/images/opencard.svg" },
  { label: "Archive", icon: "/images/archive.svg" },
];

 export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};


