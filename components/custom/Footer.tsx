import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-footer text-muted-foreground py-4 mt-12">
      <div className="container mx-auto px-4 flex justify-between items-center text-sm">
        <span>© Eventify</span>
        <span>{new Date().getFullYear()}</span>
        <a href="mailto:support@eventify.website">support@eventify.website</a>
      </div>
    </footer>
  );
}
