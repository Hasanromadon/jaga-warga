import Image from 'next/image';

interface HeaderProps {
  logoSrc?: string;
  title?: string;
  description?: string;
}

const Header: React.FC<HeaderProps> = ({
  logoSrc = '/logo.svg',
  title = 'Jaga Warga',
  description = 'Aplikasi pengelolaan dan pengecekan iuran lingkungan untuk warga perumahan.',
}) => (
  <div className="w-full max-w-sm flex flex-col items-center mt-10 mb-6">
    <div className="p-3 flex items-center justify-center">
      <Image
        src={logoSrc}
        alt="Logo Jaga Warga"
        width={56}
        height={56}
        className="rounded-full"
      />
    </div>
    <h1 className="text-2xl font-bold text-blue-900 mb-1 text-center">
      {title}
    </h1>
    <p className="text-xs text-blue-900 text-center mb-2">{description}</p>
  </div>
);

export default Header;
