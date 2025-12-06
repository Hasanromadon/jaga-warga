import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-10 text-xs text-blue-900/60 text-center">
      &copy; {new Date().getFullYear()} Jaga Warga. All rights reserved.
    </footer>
  );
};

export default Footer;
