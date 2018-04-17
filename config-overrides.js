const { injectBabelPlugin } = require('react-app-rewired');

module.exports = function override(config) {
  return injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
};
