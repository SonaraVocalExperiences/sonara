import { HomeIcon } from '@sanity/icons/Home';
import { ALL_FIELDS_GROUP, defineField, defineType } from 'sanity';

const section = (name: string, title: string, fields: ReturnType<typeof defineField>[], group = 'content') =>
  defineField({
    name,
    title,
    type: 'object',
    group,
    options: { collapsible: true, collapsed: false },
    fields,
  });

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
    { ...ALL_FIELDS_GROUP, hidden: true },
  ],
  fields: [
    section('nav', 'Navigation', [
      defineField({
        name: 'approachLabel',
        title: 'Approach link label',
        type: 'internationalizedArrayString',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'contactLabel',
        title: 'Contact link label',
        type: 'internationalizedArrayString',
        validation: (rule) => rule.required(),
      }),
    ]),
    section('hero', 'Hero', [
      defineField({
        name: 'headline',
        title: 'Headline',
        type: 'internationalizedArrayString',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'subtitle',
        title: 'Subtitle',
        type: 'internationalizedArrayString',
      }),
      defineField({
        name: 'body',
        title: 'Body',
        type: 'internationalizedArrayText',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'ctaText',
        title: 'CTA text',
        type: 'internationalizedArrayString',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'ctaUrl',
        title: 'CTA URL',
        description: 'A section anchor like #contacto, or a full link starting with https://, mailto: or tel:.',
        type: 'url',
        initialValue: '#contacto',
        validation: (rule) => rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
      }),
    ]),
    section('video', 'Video', [
      defineField({
        name: 'url',
        title: 'Embed URL',
        type: 'url',
        validation: (rule) => rule.required(),
      }),
    ]),
    section('approach', 'Approach', [
      defineField({
        name: 'heading',
        title: 'Heading',
        type: 'internationalizedArrayString',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'intro',
        title: 'Intro',
        type: 'internationalizedArrayText',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'pillars',
        title: 'Pillars',
        type: 'array',
        of: [{ type: 'pillar' }],
        validation: (rule) => rule.required().min(1).max(6),
      }),
      defineField({
        name: 'image',
        title: 'Image',
        description: 'Shown in black and white next to the pillars.',
        type: 'image',
        options: { hotspot: true },
      }),
      defineField({
        name: 'imageAlt',
        title: 'Image alt text',
        type: 'internationalizedArrayString',
        validation: (rule) => rule.required(),
      }),
    ]),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      group: 'content',
      type: 'array',
      of: [{ type: 'testimonial' }],
      validation: (rule) => rule.required().min(1).max(6),
    }),
    section('contact', 'Contact', [
      defineField({
        name: 'heading',
        title: 'Heading',
        type: 'internationalizedArrayString',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'body',
        title: 'Body',
        type: 'internationalizedArrayText',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'formHeading',
        title: 'Form heading',
        type: 'internationalizedArrayString',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'formBody',
        title: 'Form body',
        type: 'internationalizedArrayText',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'labelName',
        title: 'Name label',
        type: 'internationalizedArrayString',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'labelOrg',
        title: 'Organisation label',
        type: 'internationalizedArrayString',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'labelEmail',
        title: 'Email label',
        type: 'internationalizedArrayString',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'labelMessage',
        title: 'Message label',
        type: 'internationalizedArrayString',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'submitText',
        title: 'Submit button',
        type: 'internationalizedArrayString',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'email',
        title: 'Email address',
        type: 'string',
        validation: (rule) => rule.required().email(),
      }),
      defineField({
        name: 'phone',
        title: 'Phone number',
        type: 'string',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'linkedinUrl',
        title: 'LinkedIn URL',
        type: 'url',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'labelWorkshops',
        title: 'Workshops label',
        type: 'internationalizedArrayString',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'labelDirect',
        title: 'Direct contact label',
        type: 'internationalizedArrayString',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'labelLinkedin',
        title: 'LinkedIn label',
        type: 'internationalizedArrayString',
        validation: (rule) => rule.required(),
      }),
    ]),
    section('footer', 'Footer', [
      defineField({
        name: 'marqueeText',
        title: 'Marquee text',
        type: 'internationalizedArrayString',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'copyright',
        title: 'Copyright',
        description: 'Business name and "all rights reserved" text. Do not include © or the year.',
        type: 'internationalizedArrayString',
        validation: (rule) => rule.required(),
      }),
    ]),
    section(
      'seo',
      'SEO',
      [
        defineField({
          name: 'title',
          title: 'Page title',
          description: 'Shown in the browser tab and as the headline in search results.',
          type: 'internationalizedArrayString',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'description',
          title: 'Meta description',
          description: 'The summary search engines show under the title. Aim for 150–160 characters.',
          type: 'internationalizedArrayText',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'image',
          title: 'Share image',
          description:
            'Shown when the page is shared on social media or in messaging apps. 1200 × 630 px; avoid text, as one image is used for every language.',
          type: 'image',
          options: { hotspot: true },
        }),
      ],
      'seo'
    ),
  ],
  preview: {
    prepare() {
      return { title: 'Homepage' };
    },
  },
});
