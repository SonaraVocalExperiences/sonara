import { BlockElementIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const pillar = defineType({
  name: 'pillar',
  title: 'Pillar',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'internationalizedArrayText',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title.0.value',
    },
  },
});
