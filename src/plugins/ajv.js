const ajvPlugin = (ajv) => {
  ajv.addKeyword('isFileType', {
    compile: (schema, parent) => {
      parent.type = 'file';
      delete parent.isFileType;
      return () => true;
    },
  });

  return ajv;
};

export {
  ajvPlugin,
};
