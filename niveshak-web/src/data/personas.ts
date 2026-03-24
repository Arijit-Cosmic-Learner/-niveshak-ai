export interface Persona {
  id: string;
  nameEn: string;
  nameHi: string;
  metaEn: string;
  metaHi: string;
  avatarInitials: string;
  colorClass: string; // Tailwind bg class for avatar
}

export const personas: Persona[] = [
  {
    id: 'arun',
    nameEn: 'Arun Jadav \u2014 Auto Driver \u2014 Ranchi',
    nameHi: '\u0905\u0930\u0941\u0923 \u091C\u093E\u0926\u0935 \u2014 \u0911\u091F\u094B \u091A\u093E\u0932\u0915 \u2014 \u0930\u093E\u0902\u091A\u0940',
    metaEn: '\u20B92,500/mo \u2014 Beti ki padhai \u2014 Sukanya + Post Office',
    metaHi: '\u20B92,500/\u092E\u093E\u0939 \u2014 \u092C\u0947\u091F\u0940 \u0915\u0940 \u092A\u095D\u093E\u0908 \u2014 \u0938\u0941\u0915\u0928\u094D\u092F\u093E + \u0921\u093E\u0915\u0918\u0930',
    avatarInitials: 'AJ',
    colorClass: 'bg-lime',
  },
  {
    id: 'priya',
    nameEn: 'Priya Sharma \u2014 Teacher \u2014 Bhopal',
    nameHi: '\u092A\u094D\u0930\u093F\u092F\u093E \u0936\u0930\u094D\u092E\u093E \u2014 \u0936\u093F\u0915\u094D\u0937\u093F\u0915\u093E \u2014 \u092D\u094B\u092A\u093E\u0932',
    metaEn: '\u20B912,000/mo \u2014 Retirement \u2014 NPS + PPF + Gold SIP',
    metaHi: '\u20B912,000/\u092E\u093E\u0939 \u2014 \u0938\u0947\u0935\u093E\u0928\u093F\u0935\u0943\u0924\u094D\u0924\u093F \u2014 NPS + PPF + \u0938\u094B\u0928\u093E SIP',
    avatarInitials: 'PS',
    colorClass: 'bg-lime-light',
  },
  {
    id: 'subhash',
    nameEn: 'Subhash Mukherjee \u2014 PM \u2014 Bengaluru',
    nameHi: '\u0938\u0941\u092D\u093E\u0937 \u092E\u0941\u0916\u0930\u094D\u091C\u0940 \u2014 PM \u2014 \u092C\u0947\u0902\u0917\u0932\u0941\u0930\u0941',
    metaEn: '\u20B960,000/mo \u2014 Wealth growth \u2014 ELSS + Nifty 50 + InvIT',
    metaHi: '\u20B960,000/\u092E\u093E\u0939 \u2014 \u0938\u0902\u092A\u0924\u094D\u0924\u093F \u0935\u0943\u0926\u094D\u0927\u093F \u2014 ELSS + Nifty 50 + InvIT',
    avatarInitials: 'SM',
    colorClass: 'bg-lime-pale',
  },
];
