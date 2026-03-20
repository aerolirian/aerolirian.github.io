import Script from 'next/script'

import { ANALYTICS, CONSENT_ENABLED } from '@/lib/site-config'

export function ConsentAndAnalytics() {
  if (!CONSENT_ENABLED) return null

  const gaEnabled = Boolean(ANALYTICS.gaMeasurementId)
  const umamiEnabled = Boolean(
    ANALYTICS.umamiWebsiteId && ANALYTICS.umamiSrc,
  )
  const language = JSON.stringify({
    default: 'en',
    translations: {
      en: {
        consentModal: {
          title: 'Privacy choices',
          description:
            'We use analytics to understand how the catalog is used. You can accept or decline.',
          acceptAllBtn: 'Accept analytics',
          acceptNecessaryBtn: 'Only necessary',
          showPreferencesBtn: 'Manage choices',
        },
        preferencesModal: {
          title: 'Privacy preferences',
          acceptAllBtn: 'Accept analytics',
          acceptNecessaryBtn: 'Only necessary',
          savePreferencesBtn: 'Save choices',
          closeIconLabel: 'Close',
          sections: [
            {
              title: 'Cookie use',
              description:
                'This site keeps analytics off until you choose otherwise.',
            },
            {
              title: 'Strictly necessary',
              description:
                'These are required for the site and consent choices to work.',
              linkedCategory: 'necessary',
            },
            {
              title: 'Analytics',
              description:
                'Helps us understand which books and pages readers visit.',
              linkedCategory: 'analytics',
            },
          ],
        },
      },
    },
  })
  const consentInit = `
    window.addEventListener('load', function () {
      if (!window.CookieConsent) return;
      window.CookieConsent.run({
        guiOptions: {
          consentModal: {
            layout: 'box',
            position: 'bottom right',
            equalWeightButtons: false,
            flipButtons: false
          },
          preferencesModal: {
            layout: 'box',
            position: 'right',
            equalWeightButtons: false,
            flipButtons: false
          }
        },
        categories: {
          necessary: {
            enabled: true,
            readOnly: true
          },
          analytics: {
            enabled: false,
            autoClear: {
              cookies: [
                { name: /^_ga/ }
              ]
            }
          }
        },
        language: ${language},
        onConsent: function ({ cookie }) {
          var accepted = cookie.categories.includes('analytics');
          var grant = accepted ? 'granted' : 'denied';
          if (window.gtag) {
            window.gtag('consent', 'update', {
              analytics_storage: grant,
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied'
            });
          }
        },
        onChange: function ({ changedCategories, cookie }) {
          if (!changedCategories.includes('analytics')) return;
          var accepted = cookie.categories.includes('analytics');
          var grant = accepted ? 'granted' : 'denied';
          if (window.gtag) {
            window.gtag('consent', 'update', {
              analytics_storage: grant,
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied'
            });
          }
        }
      });
    });
  `

  return (
    <>
      {gaEnabled ? (
        <script
          id="ga-consent-defaults"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied'
              });
            `,
          }}
        />
      ) : null}

      <Script
        id="cookieconsent-lib"
        src="https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.1.0/dist/cookieconsent.umd.js"
        strategy="afterInteractive"
      />
      <Script id="cookieconsent-init" strategy="afterInteractive">
        {consentInit}
      </Script>

      {gaEnabled ? (
        <>
          <script
            type="text/plain"
            data-category="analytics"
            data-service="Google Analytics"
            async
            data-src={`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS.gaMeasurementId}`}
          />
          <script
            type="text/plain"
            data-category="analytics"
            data-service="Google Analytics"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${ANALYTICS.gaMeasurementId}', {
                  anonymize_ip: true,
                  transport_type: 'beacon'
                });
              `,
            }}
          />
        </>
      ) : null}

      {umamiEnabled ? (
        <script
          type="text/plain"
          data-category="analytics"
          data-service="Umami"
          defer
          data-src={ANALYTICS.umamiSrc}
          data-website-id={ANALYTICS.umamiWebsiteId}
          data-host-url={ANALYTICS.umamiHostUrl || undefined}
          data-domains={ANALYTICS.umamiDomains || undefined}
        />
      ) : null}
    </>
  )
}
