import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "src/services/gql/schema.graphql",
  documents: "src/services/**/*.{ts,tsx,gql,graphql}",
  generates: {
    "src/services/gql/types-and-hooks.tsx": {
      plugins: ["typescript", "typescript-operations"]
    },
  }
};

export default config;
