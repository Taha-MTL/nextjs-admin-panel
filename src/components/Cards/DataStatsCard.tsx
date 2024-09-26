import React from "react";
import { IconType } from "react-icons";
import { Card, CardContent } from "./index";

interface StatCardProps {
  icon: IconType;
  color: string;
  title: string;
  value: string;
}

const DataStatsCard: React.FC<StatCardProps> = ({
  icon: Icon,
  color,
  title,
  value,
}) => (
  <Card>
    <CardContent className="flex items-center justify-between">
      <div>
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-full ${color}`}
        >
          <Icon className="h-6 w-6 text-white" />
        </span>
        <h3 className="text-title-sm mt-4 font-bold text-black dark:text-white">
          {title}
        </h3>
      </div>
      <h4 className="text-title-md font-bold text-black dark:text-white">
        {value}
      </h4>
    </CardContent>
  </Card>
);

export default DataStatsCard;
