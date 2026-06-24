import React from 'react';

const Loader = ({ fullPage = false, message = 'Loading...' }) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600"></div>
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex min-h-[250px] w-full items-center justify-center py-12">
      {spinner}
    </div>
  );
};

export default Loader;
