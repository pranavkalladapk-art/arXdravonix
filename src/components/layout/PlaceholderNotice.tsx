"use client";

import { useState } from "react";
import { HiOutlineExclamationTriangle, HiChevronDown, HiChevronUp } from "react-icons/hi2";

export default function PlaceholderNotice() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed inset-x-0 top-0 z-[1000]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-7 w-full items-center justify-center gap-2 border-b border-amber-400/20 bg-[#171204] px-4 text-center"
      >
        <HiOutlineExclamationTriangle className="shrink-0 text-amber-400" size={12} />
        <span className="truncate font-mono text-[10px] uppercase tracking-wide text-amber-200/90 sm:text-[11px]">
          Preview only — placeholder content, pending your approval
        </span>
        {open ? (
          <HiChevronUp className="shrink-0 text-amber-400/70" size={12} />
        ) : (
          <HiChevronDown className="shrink-0 text-amber-400/70" size={12} />
        )}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-7 max-h-[70vh] overflow-y-auto border-b border-amber-400/20 bg-[#130f04] px-6 py-4 text-xs leading-relaxed text-amber-100/80 sm:px-10">
          <p className="mb-3">
            This website is currently under development by Dravonix Media. All
            logos, images, brand colors, icons, contact details, email
            addresses, phone numbers, business information, and other
            visual/content elements displayed on this preview are temporary
            placeholders for demonstration purposes only. The final website
            will be updated with your official branding, content, images, and
            business details once they are provided and approved.
          </p>
          <p className="border-t border-amber-400/10 pt-3" lang="ml">
            ഈ വെബ്സൈറ്റ് നിലവിൽ Dravonix Media വികസിപ്പിച്ചുകൊണ്ടിരിക്കുകയാണ്. ഇപ്പോൾ
            കാണുന്ന ലോഗോകൾ, ചിത്രങ്ങൾ, ബ്രാൻഡ് നിറങ്ങൾ, ഐക്കണുകൾ, ഫോൺ നമ്പർ, ഇമെയിൽ
            വിലാസം, വിലാസം, ബിസിനസ് വിവരങ്ങൾ, മറ്റ് ഉള്ളടക്കങ്ങൾ എന്നിവ ഡെമോ
            ആവശ്യങ്ങൾക്കായി മാത്രം ഉപയോഗിച്ചിരിക്കുന്ന താൽക്കാലിക
            പ്ലേസ്‌ഹോൾഡറുകളാണ്. നിങ്ങളുടെ ഔദ്യോഗിക ബ്രാൻഡിംഗ്, ചിത്രങ്ങൾ, ഉള്ളടക്കം,
            ബിസിനസ് വിവരങ്ങൾ എന്നിവ ലഭിക്കുകയും അംഗീകരിക്കുകയും ചെയ്തതിന് ശേഷം,
            വെബ്സൈറ്റ് അതനുസരിച്ച് അപ്ഡേറ്റ് ചെയ്ത് അന്തിമ രൂപത്തിൽ
            പ്രസിദ്ധീകരിക്കുന്നതാണ്.
          </p>
        </div>
      )}
    </div>
  );
}
