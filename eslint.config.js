import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';
import tseslint from 'typescript-eslint';

export default [
  {
    files: ['**/*.rules'],
    plugins: {
      'firebase-security-rules': firebaseRulesPlugin,
    },
    rules: {
      ...firebaseRulesPlugin.configs.recommended.rules,
    },
  },
  ...tseslint.configs.recommended,
];
