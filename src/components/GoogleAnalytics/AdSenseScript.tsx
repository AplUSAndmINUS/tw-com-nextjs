import { ADSENSE_PUB_ID, ADSENSE_SCRIPT_SRC } from '@/lib/adsense';

export function AdSenseScript() {
  return (
    <script
      async
      crossOrigin='anonymous'
      data-ad-client={ADSENSE_PUB_ID}
      src={ADSENSE_SCRIPT_SRC}
    />
  );
}
