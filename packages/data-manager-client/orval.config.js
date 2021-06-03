module.exports = {
  'data-manager-api': {
    input: {
      // validation: true,
      target: 'https://squonk.informaticsmatters.org/data-manager-api/openapi.json',
      override: {
        transformer: './src/input-transformer.js',
      },
    },
    output: {
      mode: 'tags',
      target: './src/orval/data-manager-api.ts',
      schemas: './src/orval/model',
      // mock: true,
      client: 'react-query',
      override: {
        mutator: {
          path: './src/custom-instance.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
        },
      },
    },
  },
};
