import { LucideIcon } from 'lucide-react';

interface FeatureHighlightProps {
  icon: LucideIcon;
  text: string;
  color: 'blue' | 'green' | 'yellow' | 'orange';
}

const FeatureHighlight: React.FC<FeatureHighlightProps> = ({
  icon: Icon,
  text,
  color,
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-100 text-blue-900',
    green: 'bg-green-50 border-green-100 text-green-900',
    yellow: 'bg-yellow-50 border-yellow-100 text-yellow-900',
    orange: 'bg-orange-50 border-orange-100 text-orange-900',
  };

  const iconColorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    orange: 'text-orange-600',
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-lg p-3 border ${colorClasses[color]}`}
    >
      <Icon className={`w-5 h-5 ${iconColorClasses[color]}`} />
      <span className="text-xs">{text}</span>
    </div>
  );
};

export default FeatureHighlight;
