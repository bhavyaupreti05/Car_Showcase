import React from 'react';
import { Menu, X, Heart } from 'lucide-react';

export const Navbar = ({ selectedCount, onCompareClick }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#browse" className="text-lg font-semibold text-gray-900">
          Car<span className="text-gray-600">Hub</span>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          <a href="#browse" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Browse
          </a>
          <a href="#ai-recommend" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Recommendations
          </a>
          <a href="#compare" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Compare
          </a>
        </div>

        <div className="flex items-center gap-3">
          {selectedCount > 0 && (
            <button
              onClick={onCompareClick}
              className="hidden items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:flex"
            >
              <Heart className="h-4 w-4" />
              Compare ({selectedCount})
            </button>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-md p-2 hover:bg-gray-100 md:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <a href="#browse" className="text-sm font-medium text-gray-700">
              Browse
            </a>
            <a href="#ai-recommend" className="text-sm font-medium text-gray-700">
              Recommendations
            </a>
            <a href="#compare" className="text-sm font-medium text-gray-700">
              Compare
            </a>
            {selectedCount > 0 && (
              <button
                onClick={onCompareClick}
                className="mt-2 flex items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700"
              >
                <Heart className="h-4 w-4" />
                Compare ({selectedCount})
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
