import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "src/services/StartGG/gql/schema.graphql",
  documents: "src/services/StartGG/startGG.ts",
  generates: {
    "src/services/StartGG/gql/types-and-hooks.tsx": {
      plugins: ["typescript", "typescript-operations"],
      config: {
        avoidOptionals: true,
      },
    },
  },
};

export default config;
