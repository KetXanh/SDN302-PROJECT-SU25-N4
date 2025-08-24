import React from "react";
import { links } from "../../constants/index";
import LinkItem from "./LinkItem";

const Sidebar = () => {
  return (
    <aside className="w-40 h-screen bg-white dark:bg-gray-900 border-r border-gray-200">
      <div className="h-full px-2 pb-4 overflow-y-auto text-gray-900 dark:text-white">
        <ul className="space-y-2 font-medium">
          {links.map((link, index) => (
            <LinkItem key={index} {...link} />
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
