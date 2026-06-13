import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white shadow-md rounded-xl p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children }) {
  return <div className="mt-2">{children}</div>;
}

<Card className="my-4">
  <h2>Title</h2>
  <CardContent>
    <p>Some content here.</p>
  </CardContent>
</Card>;
