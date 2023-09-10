import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "src/services/gql/schema.graphql",
  documents: "src/utils/startGG.ts",
  generates: {
    "src/services/gql/types-and-hooks.tsx": {
      plugins: ["typescript", "typescript-operations"],
      config: {
        avoidOptionals: true,
      },
    },
  },
};

export default config;
