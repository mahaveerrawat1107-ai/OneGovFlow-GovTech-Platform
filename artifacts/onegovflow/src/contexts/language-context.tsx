import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  getStoredSession,
  loadLanguagePreference,
  refreshStoredSession,
  saveLanguagePreference,
} from '@/lib/supabase-client';

export type Language = 'en' | 'hi';

const STORAGE_KEY = 'onegovflow.preferred_language';

const translations: Record<string, string> = {
  'Citizen workspace': 'नागरिक कार्यक्षेत्र',
  Overview: 'अवलोकन',
  'My profile': 'मेरी प्रोफ़ाइल',
  'Document vault': 'दस्तावेज़ वॉल्ट',
  Services: 'सेवाएँ',
  Eligibility: 'पात्रता',
  Applications: 'आवेदन',
  GovGuide: 'GovGuide',
  Settings: 'सेटिंग्स',
  'Need a little help?': 'थोड़ी मदद चाहिए?',
  'Ask GovGuide to find your next step.': 'अपना अगला कदम खोजने के लिए GovGuide से पूछें।',
  'Citizen account': 'नागरिक खाता',
  'Search your services...': 'अपनी सेवाएँ खोजें...',
  Notifications: 'सूचनाएँ',
  'Close menu': 'मेनू बंद करें',
  'Close navigation': 'नेविगेशन बंद करें',
  'Open navigation': 'नेविगेशन खोलें',
  'Welcome to OneGovFlow': 'OneGovFlow में आपका स्वागत है',
  'Choose your preferred language to continue': 'जारी रखने के लिए अपनी पसंदीदा भाषा चुनें',
  English: 'अंग्रेज़ी',
  'Continue securely': 'सुरक्षित रूप से जारी रखें',
  'Code sent — check your phone': 'कोड भेज दिया गया — अपना फ़ोन देखें',
  'Explore demo workspace': 'डेमो कार्यक्षेत्र देखें',
  'Citizen sign in': 'नागरिक साइन इन',
  'Sign in to OneGovFlow': 'OneGovFlow में साइन इन करें',
  'Use your mobile number to continue securely.': 'सुरक्षित रूप से जारी रखने के लिए अपना मोबाइल नंबर इस्तेमाल करें।',
  'Enter a valid 10-digit mobile number.': 'मान्य 10 अंकों का मोबाइल नंबर दर्ज करें।',
  'Enter the 6-digit OTP.': '6 अंकों का OTP दर्ज करें।',
  'We could not send the OTP. Check your Supabase Auth SMS configuration and try again.': 'OTP नहीं भेज सके। Supabase Auth SMS कॉन्फ़िगरेशन जाँचकर फिर प्रयास करें।',
  'Invalid OTP. Please request a new code.': 'OTP अमान्य है। कृपया नया कोड माँगें।',
  'Enter the OTP sent to your mobile.': 'अपने मोबाइल पर भेजा गया OTP दर्ज करें।',
  'Verify and continue': 'सत्यापित करें और जारी रखें',
  'Resend OTP': 'OTP फिर भेजें',
  'Change number': 'नंबर बदलें',
  'OTP sent successfully.': 'OTP सफलतापूर्वक भेज दिया गया।',
  'Mobile number': 'मोबाइल नंबर',
  'Enter 10-digit mobile number': '10 अंकों का मोबाइल नंबर दर्ज करें',
  'Public services': 'सार्वजनिक सेवाएँ',
  'Find your next service': 'अपनी अगली सेवा खोजें',
  'Explore services matched to your profile, without the government-office guesswork.': 'सरकारी कार्यालयों के अनुमान के बिना अपनी प्रोफ़ाइल से मेल खाती सेवाएँ देखें।',
  'Search scholarships, certificates, identity...': 'छात्रवृत्ति, प्रमाणपत्र, पहचान खोजें...',
  'No services match that search': 'इस खोज से कोई सेवा नहीं मिली',
  'Try a broader search or choose another category.': 'व्यापक खोज करें या दूसरी श्रेणी चुनें।',
  'Clear filters': 'फ़िल्टर हटाएँ',
  'Find education support': 'शैक्षिक सहायता खोजें',
  'Check my readiness': 'मेरी तैयारी देखें',
  'Your eligibility': 'आपकी पात्रता',
  'Recommendations, explained': 'समझाई गई सिफारिशें',
  'A clearer yes.': 'एक स्पष्ट हाँ।',
  'Ready now': 'अभी तैयार',
  'Need one step': 'एक कदम बाकी',
  'Not a match': 'मेल नहीं',
  'What informed this result': 'इस परिणाम का आधार',
  'To become eligible': 'पात्र बनने के लिए',
  'Go to document vault': 'दस्तावेज़ वॉल्ट पर जाएँ',
  'Start application': 'आवेदन शुरू करें',
  'Applications in progress': 'प्रगति पर आवेदन',
  'All applications': 'सभी आवेदन',
  'Application detail': 'आवेदन विवरण',
  'Overall progress': 'कुल प्रगति',
  'Application timeline': 'आवेदन समयरेखा',
  'Copy reference number': 'संदर्भ संख्या कॉपी करें',
  'No applications yet': 'अभी कोई आवेदन नहीं',
  'Browse services': 'सेवाएँ देखें',
  'Your progress': 'आपकी प्रगति',
  'Every submission, milestone and next step — in one calm view.': 'हर सबमिशन, पड़ाव और अगला कदम — एक सरल दृश्य में।',
  'New application': 'नया आवेदन',
  'Your service desk': 'आपका सेवा डेस्क',
  'A guided assistant for the parts of public services that usually feel unclear.': 'सार्वजनिक सेवाओं के उन हिस्सों के लिए मार्गदर्शक सहायक जो अक्सर अस्पष्ट लगते हैं।',
  'GovGuide assistant': 'GovGuide सहायक',
  'Plain answers. Clear next steps.': 'सरल उत्तर। स्पष्ट अगले कदम।',
  'Judge Demo Mode': 'जज डेमो मोड',
  'Run demo mode': 'डेमो मोड चलाएँ',
  'Run again': 'फिर चलाएँ',
  'Running guided demo…': 'निर्देशित डेमो चल रहा है…',
  'Officer workspace': 'अधिकारी कार्यक्षेत्र',
  'System operational': 'सिस्टम सक्रिय है',
  'Review queue': 'समीक्षा कतार',
  'Today at a glance': 'आज का संक्षिप्त विवरण',
  'Account': 'खाता',
  'Choose how OneGovFlow keeps you informed and connected.': 'चुनें कि OneGovFlow आपको कैसे सूचित और जुड़ा रखे।',
  'Preferences saved': 'प्राथमिकताएँ सहेजी गईं',
  'Useful updates, never noise.': 'ज़रूरी अपडेट, अनावश्यक शोर नहीं।',
  'Application updates': 'आवेदन अपडेट',
  'Know when a department moves your application.': 'जानें कि विभाग आपके आवेदन पर कब आगे बढ़ता है।',
  'Document verification': 'दस्तावेज़ सत्यापन',
  'Get notified when a document is verified.': 'दस्तावेज़ सत्यापित होने पर सूचना पाएँ।',
  'Service recommendations': 'सेवा सिफारिशें',
  'Hear about services matched to your profile.': 'अपनी प्रोफ़ाइल से मेल खाती सेवाओं के बारे में जानें।',
  'Security & privacy': 'सुरक्षा और गोपनीयता',
  'Manage data consent': 'डेटा सहमति प्रबंधित करें',
  'Review what you have chosen to share.': 'देखें कि आपने क्या साझा करने का विकल्प चुना है।',
  'Download my data': 'मेरा डेटा डाउनलोड करें',
  'Get a copy of your OneGovFlow information.': 'अपने OneGovFlow डेटा की एक कॉपी पाएँ।',
  'Save preferences': 'प्राथमिकताएँ सहेजें',
  'Your account is protected': 'आपका खाता सुरक्षित है',
  'We only use your information to help you access public services. You can change your choices at any time.': 'हम आपकी जानकारी का उपयोग केवल सार्वजनिक सेवाओं तक पहुँच आसान बनाने के लिए करते हैं। आप अपनी पसंद कभी भी बदल सकते हैं।',
  'Language': 'भाषा',
  'Preferred language': 'पसंदीदा भाषा',
  'Change language anytime from here.': 'भाषा यहाँ से कभी भी बदलें।',
  'Hindi': 'हिन्दी',
  'English (English)': 'English (अंग्रेज़ी)',
  'Hindi (हिन्दी)': 'हिन्दी (Hindi)',
  'Save language': 'भाषा सहेजें',
  'Language preference saved': 'भाषा प्राथमिकता सहेजी गई',
  'Application started': 'आवेदन शुरू हो गया',
  'View requirements': 'ज़रूरतें देखें',
  'Why this result': 'यह परिणाम क्यों',
  'Profile readiness': 'प्रोफ़ाइल तैयारी',
  'Eligible services': 'पात्र सेवाएँ',
  'Active applications': 'सक्रिय आवेदन',
  'Time saved': 'बचाया गया समय',
  'Complete profile': 'प्रोफ़ाइल पूरी करें',
  'Quick actions': 'त्वरित कार्य',
  'Add a document': 'दस्तावेज़ जोड़ें',
  'Find a service': 'सेवा खोजें',
  'Update profile': 'प्रोफ़ाइल अपडेट करें',
  'Ask GovGuide': 'GovGuide से पूछें',
  'Review documents': 'दस्तावेज़ देखें',
  'Explore services': 'सेवाएँ देखें',
  'Recent activity': 'हाल की गतिविधि',
  'All activity': 'सभी गतिविधि',
  'Services waiting for you': 'आपके लिए उपलब्ध सेवाएँ',
  'Your digital locker': 'आपका डिजिटल लॉकर',
  'Your documents': 'आपके दस्तावेज़',
  'Add document': 'दस्तावेज़ जोड़ें',
  'Vault status': 'वॉल्ट स्थिति',
  'All documents': 'सभी दस्तावेज़',
  'How verification works': 'सत्यापन कैसे काम करता है',
  'Documents are private by default': 'दस्तावेज़ डिफ़ॉल्ट रूप से निजी हैं',
  'Cancel': 'रद्द करें',
  'Add to vault': 'वॉल्ट में जोड़ें',
  'Adding…': 'जोड़ा जा रहा है…',
  'No action is needed from you right now. We’ll let you know when there is an update.': 'अभी आपको कोई कार्रवाई करने की आवश्यकता नहीं है। अपडेट होने पर हम आपको बताएँगे।',
  'Your activity will appear here as you move through services.': 'सेवाओं के साथ आगे बढ़ने पर आपकी गतिविधि यहाँ दिखाई देगी।',
};

const reverseTranslations = Object.fromEntries(
  Object.entries(translations).map(([english, hindi]) => [hindi, english]),
) as Record<string, string>;

const patterns: Array<[RegExp, string]> = [
  [/^Good morning, (.+)\.$/, 'सुप्रभात, $1।'],
  [/^Good morning, officer\.$/, 'सुप्रभात, अधिकारी।'],
  [/^(\d+) min ago$/, '$1 मिनट पहले'],
  [/^(\d+) hr ago$/, '$1 घंटे पहले'],
  [/^Updated (.+)$/, 'अपडेट: $1'],
  [/^(\d+) documents$/, '$1 दस्तावेज़'],
  [/^of (.+) documents$/, '$1 दस्तावेज़ों में से'],
];

function translateText(value: string, language: Language): string {
  if (language === 'en') return reverseTranslations[value] ?? value;
  return translations[value] ?? patterns.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), value);
}

function translateDom(language: Language) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) textNodes.push(node as Text);
  textNodes.forEach((textNode) => {
    const value = textNode.nodeValue?.trim();
    if (!value || textNode.parentElement?.closest('script,style')) return;
    const translated = translateText(value, language);
    if (translated !== value) textNode.nodeValue = textNode.nodeValue?.replace(value, translated) ?? translated;
  });
  document.querySelectorAll<HTMLElement>('[placeholder],[aria-label],[title]').forEach((element) => {
    ['placeholder', 'aria-label', 'title'].forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (value) element.setAttribute(attribute, translateText(value, language));
    });
  });
  document.documentElement.lang = language === 'hi' ? 'hi' : 'en';
}

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  translate: (value: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language | null>(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'hi' || stored === 'en' ? stored : null;
  });

  useEffect(() => {
    let cancelled = false;
    const hydrate = async () => {
      const refreshed = await refreshStoredSession();
      const userId = refreshed?.user.id ?? getStoredSession()?.user.id ?? 'demo-user';
      const stored = await loadLanguagePreference(userId).catch(() => null);
      if (cancelled) return;
      if (stored) {
        window.localStorage.setItem(STORAGE_KEY, stored);
        setLanguageState(stored);
      } else if (userId !== 'demo-user' && language) {
        await saveLanguagePreference(userId, language).catch(() => undefined);
      }
    };
    void hydrate().catch(() => undefined);
    const handleAuthChange = () => { void hydrate().catch(() => undefined); };
    window.addEventListener('onegovflow:auth-changed', handleAuthChange);
    return () => {
      cancelled = true;
      window.removeEventListener('onegovflow:auth-changed', handleAuthChange);
    };
  }, []);

  useEffect(() => {
    if (!language) return;
    translateDom(language);
    const observer = new MutationObserver(() => translateDom(language));
    observer.observe(document.body, { subtree: true, childList: true, characterData: true });
    return () => observer.disconnect();
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    setLanguageState(next);
    const userId = getStoredSession()?.user.id ?? 'demo-user';
    void saveLanguagePreference(userId, next).catch(() => undefined);
  }, []);

  const value = useMemo<LanguageContextValue>(() => ({
    language: language ?? 'en',
    setLanguage,
    translate: (value: string) => translateText(value, language ?? 'en'),
  }), [language, setLanguage]);

  if (!language) return <LanguageOnboarding onSelect={setLanguage} />;
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}

function LanguageOnboarding({ onSelect }: { onSelect: (language: Language) => void }) {
  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#f4f6fa] px-6 py-10 text-[#202747]">
      <div className="absolute inset-0 surface-grid opacity-60" />
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#e7ecff] blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#fff0d7] blur-3xl" />
      <section className="relative w-full max-w-2xl rounded-[32px] border border-[#d9dfef] bg-white/95 p-8 text-center shadow-[0_28px_90px_rgba(35,48,103,.14)] backdrop-blur sm:p-14">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#2f3c88] text-[#e7bb55] shadow-lg">
          <span className="relative h-7 w-7 rotate-45 rounded-[7px] border-[4px] border-current">
            <span className="absolute -right-1.5 -top-1.5 h-2.5 w-2.5 rounded-full bg-current" />
          </span>
        </div>
        <p className="mt-8 text-[10px] font-bold uppercase tracking-[.22em] text-[#4e5fc2]">One profile. Every public service.</p>
        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-[-.055em] sm:text-5xl">Welcome to OneGovFlow</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#68718c]">Choose your preferred language to continue</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <button type="button" onClick={() => onSelect('en')} className="group flex min-h-28 items-center justify-between rounded-2xl border-2 border-[#d8deed] bg-white px-5 text-left transition hover:-translate-y-1 hover:border-[#2f3c88] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#2f3c88]/15" data-testid="button-language-english">
            <span><span className="block text-lg font-extrabold text-[#2f3c88]">English</span><span className="mt-1 block text-xs text-[#7b849d]">Continue in English</span></span>
            <span className="text-3xl" aria-hidden="true">🇬🇧</span>
          </button>
          <button type="button" onClick={() => onSelect('hi')} className="group flex min-h-28 items-center justify-between rounded-2xl border-2 border-[#d8deed] bg-white px-5 text-left transition hover:-translate-y-1 hover:border-[#2f3c88] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#2f3c88]/15" data-testid="button-language-hindi">
            <span><span className="block text-lg font-extrabold text-[#2f3c88]">हिन्दी</span><span className="mt-1 block text-xs text-[#7b849d]">हिन्दी में जारी रखें</span></span>
            <span className="text-3xl" aria-hidden="true">🇮🇳</span>
          </button>
        </div>
        <p className="mt-8 text-[11px] text-[#8a93a9]">You can change this later from Settings.</p>
      </section>
    </main>
  );
}