import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  href: string;
  icon: LucideIcon;
  text: string;
  color: 'blue' | 'green';
}

const ActionButton: React.FC<ActionButtonProps> = ({
  href,
  icon: Icon,
  text,
  color,
}) => {
  const colorClasses = {
    blue: 'hover:bg-blue-50 border-blue-100 text-blue-600',
    green: 'hover:bg-green-50 border-green-100 text-green-600',
  };

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-4 rounded-xl shadow bg-white text-base font-semibold transition border ${colorClasses[color]}`}
    >
      <Icon className="w-6 h-6" />
      {text}
    </Link>
  );
};

export default ActionButton;
