"use client";
import React from "react";

interface NotificationPanelProps {
  messages: string[];
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ messages }) => (
  <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded mt-4 shadow">
    <h3 className="font-bold mb-2">AI Suggestions</h3>
    {messages.length > 0 ? (
      <ul className="list-disc list-inside">
        {messages.map((msg, i) => (
          <li key={i} className="text-sm text-gray-700">{msg}</li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-gray-500">No new AI suggestions</p>
    )}
  </div>
);

export default NotificationPanel;