import { defineCliConfig } from 'sanity/cli';
import { projectId, dataset } from './sanity.constants';

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
});
