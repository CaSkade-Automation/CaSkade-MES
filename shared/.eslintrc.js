
/* eslint-disable no-undef */
module.exports = {
    parser: '@typescript-eslint/parser',  // Specifies the ESLint parser
    extends: [
        "eslint:recommended",             // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    parserOptions: {
        ecmaVersion: 2018,  // Allows for the parsing of modern ECMAScript features
        sourceType: 'module',  // Allows for the use of imports
    },
    rules: {
        "semi": ["error","always"],
        "indent": ["error", 4],
        "prefer-const": ["error",{}],
        "max-len": ["error", {code: 125, ignoreComments: true}]
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    },
};
