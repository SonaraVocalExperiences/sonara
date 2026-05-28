export interface HomeContent {
  nav: {
    approach: string;
    contact: string;
  };
  hero: {
    headline: string;
    subtitle: string;
    body: string;
    ctaText: string;
    ctaUrl: string;
  };
  video: {
    url: string;
  };
  approach: {
    heading: string;
    intro: string;
    pillars: Array<{ title: string; body: string }>;
    image: string;
    imageAlt: string;
  };
  testimonials: Array<{ quote: string; authorName: string; authorRole: string }>;
  contact: {
    heading: string;
    body: string;
    formHeading: string;
    formBody: string;
    labelName: string;
    labelOrg: string;
    labelEmail: string;
    labelMessage: string;
    submitText: string;
    email: string;
    phone: string;
    linkedinUrl: string;
    labelWorkshops: string;
    labelDirect: string;
    labelLinkedin: string;
  };
  footer: {
    marqueeText: string;
    copyright: string;
  };
}

function localizedField(field: string): string {
  return `coalesce(${field}[language == $locale][0].value, ${field}[language == "es"][0].value)`;
}

export function homePageQuery(): string {
  const l = (field: string) => localizedField(field);

  return /* groq */ `*[_type == "homePage" && _id == "homePage"][0]{
    "nav": {
      "approach": ${l('navApproach')},
      "contact": ${l('navContact')}
    },
    "hero": {
      "headline": ${l('heroHeadline')},
      "subtitle": ${l('heroSubtitle')},
      "body": ${l('heroBody')},
      "ctaText": ${l('heroCtaText')},
      "ctaUrl": heroCtaUrl
    },
    "video": {
      "url": videoUrl
    },
    "approach": {
      "heading": ${l('approachHeading')},
      "intro": ${l('approachIntro')},
      "pillars": approachPillars[]{
        _key,
        "title": ${l('title')},
        "body": ${l('body')}
      },
      "image": approachImage,
      "imageAlt": ${l('approachImageAlt')}
    },
    "testimonials": testimonials[]{
      _key,
      "quote": ${l('quote')},
      "authorName": ${l('authorName')},
      "authorRole": ${l('authorRole')}
    },
    "contact": {
      "heading": ${l('contactHeading')},
      "body": ${l('contactBody')},
      "formHeading": ${l('contactFormHeading')},
      "formBody": ${l('contactFormBody')},
      "labelName": ${l('contactLabelName')},
      "labelOrg": ${l('contactLabelOrg')},
      "labelEmail": ${l('contactLabelEmail')},
      "labelMessage": ${l('contactLabelMessage')},
      "submitText": ${l('contactSubmitText')},
      "email": contactEmail,
      "phone": contactPhone,
      "linkedinUrl": contactLinkedinUrl,
      "labelWorkshops": ${l('contactLabelWorkshops')},
      "labelDirect": ${l('contactLabelDirect')},
      "labelLinkedin": ${l('contactLabelLinkedin')}
    },
    "footer": {
      "marqueeText": ${l('footerMarqueeText')},
      "copyright": ${l('footerCopyright')}
    }
  }`;
}
