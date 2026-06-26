import hestiaLogo from '../../assets/hestia.svg';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-4">
      <div className="absolute top-6 left-6">
        <img 
          src={hestiaLogo} 
          alt="Hestia" 
          className="h-10 w-auto object-contain" 
        />
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-2xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text">{title}</h1>
            {subtitle && (
              <p className="text-sm text-text-secondary mt-1">{subtitle}</p>
            )}
          </div>

          {children}
        </div>

        <p className="text-center text-xs text-slate-500 mt-8">
          &copy; {new Date().getFullYear()} Hestia. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;