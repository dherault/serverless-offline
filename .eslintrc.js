const { env, platform } = process;

const rules = {
  semi: ["error", "always"],
  "prefer-destructuring": "off",
  "key-spacing": "off",
  "guard-for-in": "off",
  "no-restricted-syntax": "off",
  "import/no-dynamic-require": "off",
};

// workaround for git + eslint line ending issue on Travis for Windows OS:
// https://travis-ci.community/t/files-in-checkout-have-eol-changed-from-lf-to-crlf/349/2
if (env.TRAVIS && platform === "win32") {
  rules["linebreak-style"] = "off";
}

module.exports = {
  extends: "dherault",
  rules,
};
