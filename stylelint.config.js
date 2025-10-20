/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  rules: {
    // 'color-named': ["never"],
    'font-family-name-quotes': 'always-where-required',
    'font-weight-notation': 'named-where-possible',
    'function-url-no-scheme-relative': true,
    'function-url-quotes': 'always',
    'value-keyword-case': 'lower',
    'unit-disallowed-list': [],
    'no-descending-specificity': null,
    'no-duplicate-selectors': true,
    'font-family-no-missing-generic-family-keyword': null,
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['/^lost-/'],
      },
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['global'] },
    ],
  },
};
