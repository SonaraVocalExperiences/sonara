// Tracks whether the last input was the keyboard, after React Aria's useFocusVisible, and marks the
// focused element with `data-focus-visible` when it was, as its components do. `:focus-visible`
// alone also matches a text field that was clicked, which the keyboard-only rings must not.
let keyboard = false;

const TYPING_KEYS_THAT_SHOW_FOCUS = new Set(['Tab', 'Escape']); // keys that show focus in a text field
const MODIFIER_KEYS = new Set(['Alt', 'Control', 'Meta', 'Shift']);

// What a user can type into: textareas, text-like inputs and contenteditable, not buttons, checkboxes
// or read-only fields. React Aria spells the same thing out with a list of input types.
const isTypingTarget = (el: Element | null) => !!el?.matches(':read-write');

const mark = (el: Element | null) => {
  if (el instanceof HTMLElement && el !== document.body) el.toggleAttribute('data-focus-visible', keyboard);
};

const setKeyboard = (value: boolean) => {
  if (keyboard === value) return;
  keyboard = value;
  mark(document.activeElement); // a focus that is already there follows the change
};

addEventListener(
  'keydown',
  (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey || MODIFIER_KEYS.has(event.key)) return;
    if (isTypingTarget(document.activeElement) && !TYPING_KEYS_THAT_SHOW_FOCUS.has(event.key)) return;
    setKeyboard(true);
  },
  true
);
addEventListener('pointerdown', () => setKeyboard(false), true);
addEventListener('focusin', (event) => mark(event.target as Element), true);
addEventListener('focusout', (event) => (event.target as Element).removeAttribute('data-focus-visible'), true);
