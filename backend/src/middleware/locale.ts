import { Context, Next } from "koa";
import geoip from 'geoip-country';
import lookup from 'country-code-lookup';
import { orderBy } from "lodash";
import * as Locale from 'locale-codes'

const LOCALE_RE = /(([a-z][a-z])|\*)(-[A-Z][A-Z])?(;q=[0-9].[0-9])?/g;
const WEIGHT_RE = /[0-9].[0-9]/g;
const LANG_RE = /(([a-z][a-z])|\*)(-[A-Z][A-Z])?/g;

const locale = () =>  async (ctx: Context, next: Next) => {
  const locales = (ctx.headers["accept-language"] || '').match(LOCALE_RE);

  if (locales && locales.length) {
    const ranked = locales.map(
      (locale) => {
        const weight = locale.match(WEIGHT_RE);
        const lang = locale.match(LANG_RE);

        return { 
          weight: weight ? parseFloat(weight[0]) : 1.0,
          lang: lang![0],  
        }
      }
    );

    const locale = orderBy(ranked, ['weight'], ['desc'])[0].lang;

    ctx.locale = locale;
  } else {
    const geo = geoip.lookup('184.162.251.212');
    
    if (geo) {
      const { country }= lookup.byIso(geo.country)!;
      ctx.locale = Locale.all.find(({ location }) => location === country)!.tag;
    }
  }
  
  await next();
};

export default locale;