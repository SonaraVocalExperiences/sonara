import { defineQuery } from 'groq';

export const homePageQuery = defineQuery(`*[_type == "homePage" && _id == "homePage"][0]`);
