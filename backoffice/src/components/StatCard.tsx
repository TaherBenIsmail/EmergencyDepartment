// components/StatCard.tsx
"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: number;
  Icon: LucideIcon;
  color: "blue" | "green" | "red";
};

const colorClasses: Record<StatCardProps["color"], { text: string; border: string }> = {
  blue: {
    text: "text-blue-600",
    border: "border-blue-500",
  },
  green: {
    text: "text-green-600",
    border: "border-green-500",
  },
  red: {
    text: "text-red-600",
    border: "border-red-500",
  },
};

const StatCard: React.FC<StatCardProps> = ({ title, value, Icon, color }) => {
  const { text, border } = colorClasses[color];

  return (
    <div
      className={`group bg-white p-6 rounded-lg shadow-lg border-l-4 ${border} transition-transform transform hover:scale-105 hover:shadow-xl duration-300 ease-in-out animate-fade-in`}
    >
      <div className="flex items-center gap-4">
        <Icon className={`${text} w-10 h-10 group-hover:rotate-12 transition-transform duration-300`} />
        <div>
          <p className="text-sm text-gray-500 uppercase">{title}</p>
          <p className={`text-3xl font-bold ${text}`}>{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
