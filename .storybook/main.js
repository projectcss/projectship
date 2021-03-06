module.exports = {
  "stories": [
    "../src/components/Button/*.stories.@(js|jsx|ts|tsx)",
    "../src/components/Input/*.stories.@(js|jsx|ts|tsx)",
    "../src/components/AutoComplete/*.stories.@(js|jsx|ts|tsx)",
    "../src/components/Upload/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app"
  ]
}