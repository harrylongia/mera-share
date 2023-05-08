import React, { useState } from "react";

const supportedLanguages = [
  "java",
  "cpp",
  "javascript",
  "python",
  "json",
  "html",
  "markdown",
];

// https://github.com/wooorm/refractor#syntaxes

const DropDown = ({
  updateObject,
  shareText,
  language,
  setLanguage,
}: {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  updateObject: (text: string, lang?: string) => Promise<void>;
  shareText: string;
}) => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  return (
    <div className="relative inline-block text-xs text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center capitalize w-full rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          id="menu-button"
          aria-expanded={isDropDownOpen}
          aria-haspopup="true"
          onClick={() => setIsDropDownOpen(!isDropDownOpen)}
        >
          {language}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.707a1 1 0 011.414 0L10 10.586l2.293-2.293a1 1 0 011.414 0l.707.707a1 1 0 010 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414l.707-.707z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      {isDropDownOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex={-1}
          >
            {supportedLanguages.map((eachLanguage: string) => {
              return (
                <div
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                  tabIndex={-1}
                  id="menu-item-0"
                  onClick={() => {
                    setLanguage(eachLanguage);
                    setIsDropDownOpen(false);
                    updateObject(shareText, eachLanguage);
                  }}
                >
                  {eachLanguage}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropDown;
