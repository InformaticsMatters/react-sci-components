const outputTransformer = (verb) => {
  // Transform arrays in formData to comma separated list strings
  // Currently this is too simple as it will try do the same for objects
  let formData = verb.body.formData;

  if (formData) {
    formData = formData.replaceAll(/JSON\.stringify\((\w+.\w+)\)/g, `$1.join(',')`); // Requires Node >= 15
  }

  return verb;
};

module.exports = outputTransformer;
