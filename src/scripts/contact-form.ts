// Submits the contact form with fetch so the page doesn't navigate (every page is server-rendered,
// so Netlify only knows the form from public/__forms.html). The result is a server-rendered
// <template> (FormResult.astro) copied into the live region, so the messages stay localized.
document.querySelectorAll<HTMLElement>('[data-contact]').forEach((contact) => {
  const form = contact.querySelector<HTMLFormElement>('form')!;
  const formReveal = contact.querySelector<HTMLElement>('[data-form]')!;
  const status = contact.querySelector<HTMLElement>('[data-status]')!;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');

  const show = (name: 'sent' | 'failed') => {
    const template = contact.querySelector<HTMLTemplateElement>(`template[data-result-template="${name}"]`)!;
    const body = status.querySelector<HTMLElement>('[data-body]');
    if (!body) {
      status.replaceChildren(template.content.cloneNode(true));
    } else if (body.firstElementChild?.getAttribute('data-result') !== name) {
      // A panel is already showing: swap its content in place instead of animating a new one in.
      body.replaceChildren(template.content.querySelector('[data-result]')!.cloneNode(true));
    }
    if (name === 'sent') {
      form.inert = true; // out of reach while it fades out
      formReveal.dataset.collapsed = '';
    }
    status.scrollIntoView({ block: 'nearest' });
    // VoiceOver speaks a focused element in the page's language but a live region in its default
    // voice, and the form can vanish under focus. A repeated failure leaves the panel and refocuses it.
    status.querySelector<HTMLElement>('[data-result]')?.focus({ preventScroll: true });
  };

  // Trim before the browser validates, so whitespace-only text fails `required` with its own bubble.
  // The click comes first, and Enter in a field fires it too.
  button?.addEventListener('click', () => {
    form
      .querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[type="text"], textarea')
      .forEach((field) => (field.value = field.value.trim()));
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (button) button.disabled = true;
    try {
      const data = new FormData(form);
      // The notification email's subject is for the owner, so Spanish whatever the page language.
      const clean = (name: string) =>
        String(data.get(name) ?? '')
          .replace(/\s+/g, ' ')
          .trim();
      const sender = clean('nombre') || clean('email');
      const org = clean('organización');
      data.set(
        'subject',
        `[sonaravocalexperiences.com] Nuevo mensaje de ${sender}${org ? ` (${org})` : ''}`.slice(0, 150)
      );
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      if (!response.ok) throw new Error(String(response.status));
      show('sent');
    } catch {
      show('failed');
    } finally {
      if (button) button.disabled = false;
    }
  });
});
