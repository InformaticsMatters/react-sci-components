// Not transpiled with TypeScript or Babel, so use plain Es6/Node.js!
module.exports = {
  // This function will run for each entry/format/env combination
  rollup(config, options) {
    const { external } = config;
    config.external = (id) => {
      if (['styled-components', 'hooks-for-redux', '@material-ui/core'].includes(id)) {
        return true;
      } else {
        return external(id);
      }
    };
    return config;
  },
};
