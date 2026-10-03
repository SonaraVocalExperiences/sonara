import { createImageUrlBuilder } from '@sanity/image-url';

import { dataset, projectId } from '../../../sanity.constants';

export const imageUrlBuilder = createImageUrlBuilder({ projectId, dataset });
