#!/usr/bin/env node
/**
 * One-time migration: loads es/ca/en JSON and upserts the Sanity homePage singleton.
 * Requires SANITY_API_WRITE_TOKEN in the environment (or .env).
 */
import { createClient } from '@sanity/client';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projectId, dataset } from '../sanity.constants.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const token = process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  console.error('Missing SANITY_API_WRITE_TOKEN');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2025-03-01',
  useCdn: false,
});

function loadLocale(code) {
  return JSON.parse(readFileSync(join(root, 'src/content/home', `${code}.json`), 'utf8'));
}

function itemKey() {
  return randomUUID().replace(/-/g, '').slice(0, 12);
}

function locString(es, ca, en) {
  return [
    { _key: itemKey(), _type: 'internationalizedArrayStringValue', language: 'es', value: es },
    { _key: itemKey(), _type: 'internationalizedArrayStringValue', language: 'ca', value: ca },
    { _key: itemKey(), _type: 'internationalizedArrayStringValue', language: 'en', value: en },
  ];
}

function locText(es, ca, en) {
  return [
    { _key: itemKey(), _type: 'internationalizedArrayTextValue', language: 'es', value: es },
    { _key: itemKey(), _type: 'internationalizedArrayTextValue', language: 'ca', value: ca },
    { _key: itemKey(), _type: 'internationalizedArrayTextValue', language: 'en', value: en },
  ];
}

const es = loadLocale('es');
const ca = loadLocale('ca');
const en = loadLocale('en');

const doc = {
  _id: 'homePage',
  _type: 'homePage',
  navApproach: locString(es.nav.approach, ca.nav.approach, en.nav.approach),
  navContact: locString(es.nav.contact, ca.nav.contact, en.nav.contact),
  heroHeadline: locString(es.hero.headline, ca.hero.headline, en.hero.headline),
  heroSubtitle: locString(es.hero.subtitle, ca.hero.subtitle, en.hero.subtitle),
  heroBody: locText(es.hero.body, ca.hero.body, en.hero.body),
  heroCtaText: locString(es.hero.ctaText, ca.hero.ctaText, en.hero.ctaText),
  heroCtaUrl: es.hero.ctaUrl,
  videoUrl: es.video.url,
  approachHeading: locString(es.approach.heading, ca.approach.heading, en.approach.heading),
  approachIntro: locText(es.approach.intro, ca.approach.intro, en.approach.intro),
  approachPillars: es.approach.pillars.map((pillar, index) => ({
    _key: `pillar-${index + 1}`,
    _type: 'pillar',
    title: locString(pillar.title, ca.approach.pillars[index].title, en.approach.pillars[index].title),
    body: locText(pillar.body, ca.approach.pillars[index].body, en.approach.pillars[index].body),
  })),
  approachImage: es.approach.image,
  approachImageAlt: locString(es.approach.imageAlt, ca.approach.imageAlt, en.approach.imageAlt),
  testimonials: es.testimonials.map((item, index) => ({
    _key: `testimonial-${index + 1}`,
    _type: 'testimonial',
    quote: locText(item.quote, ca.testimonials[index].quote, en.testimonials[index].quote),
    authorName: locString(
      item.authorName,
      ca.testimonials[index].authorName,
      en.testimonials[index].authorName,
    ),
    authorRole: locString(
      item.authorRole,
      ca.testimonials[index].authorRole,
      en.testimonials[index].authorRole,
    ),
  })),
  contactHeading: locString(es.contact.heading, ca.contact.heading, en.contact.heading),
  contactBody: locText(es.contact.body, ca.contact.body, en.contact.body),
  contactFormHeading: locString(es.contact.formHeading, ca.contact.formHeading, en.contact.formHeading),
  contactFormBody: locText(es.contact.formBody, ca.contact.formBody, en.contact.formBody),
  contactLabelName: locString(es.contact.labelName, ca.contact.labelName, en.contact.labelName),
  contactLabelOrg: locString(es.contact.labelOrg, ca.contact.labelOrg, en.contact.labelOrg),
  contactLabelEmail: locString(es.contact.labelEmail, ca.contact.labelEmail, en.contact.labelEmail),
  contactLabelMessage: locString(es.contact.labelMessage, ca.contact.labelMessage, en.contact.labelMessage),
  contactSubmitText: locString(es.contact.submitText, ca.contact.submitText, en.contact.submitText),
  contactEmail: es.contact.email,
  contactPhone: es.contact.phone,
  contactLinkedinUrl: es.contact.linkedinUrl,
  contactLabelWorkshops: locString(
    es.contact.labelWorkshops,
    ca.contact.labelWorkshops,
    en.contact.labelWorkshops,
  ),
  contactLabelDirect: locString(es.contact.labelDirect, ca.contact.labelDirect, en.contact.labelDirect),
  contactLabelLinkedin: locString(
    es.contact.labelLinkedin,
    ca.contact.labelLinkedin,
    en.contact.labelLinkedin,
  ),
  footerMarqueeText: locString(es.footer.marqueeText, ca.footer.marqueeText, en.footer.marqueeText),
  footerCopyright: locString(es.footer.copyright, ca.footer.copyright, en.footer.copyright),
};

await client.createOrReplace(doc);
console.log('Published homepage document: homePage (internationalized-array v5 format)');
