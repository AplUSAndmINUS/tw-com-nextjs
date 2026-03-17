import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NewsletterState {
  /** Whether the user has permanently dismissed the newsletter popup */
  newsletterDismissed: boolean;
  /** Whether the user has already subscribed */
  newsletterSubscribed: boolean;
  /** Dismiss the newsletter popup permanently */
  setNewsletterDismissed: (dismissed: boolean) => void;
  /** Mark the user as subscribed */
  setNewsletterSubscribed: (subscribed: boolean) => void;
}

export const useNewsletterStore = create<NewsletterState>()(
  persist(
    (set) => ({
      newsletterDismissed: false,
      newsletterSubscribed: false,
      setNewsletterDismissed: (dismissed) =>
        set({ newsletterDismissed: dismissed }),
      setNewsletterSubscribed: (subscribed) =>
        set({ newsletterSubscribed: subscribed }),
    }),
    {
      name: 'tw-newsletter',
      skipHydration: true,
    }
  )
);
