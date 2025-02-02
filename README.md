# Eigen Education

This `Turborepo` includes the following packages and apps:

### Apps and Packages

- `web`: react [vite](https://vitejs.dev) ts app
- `@repo/ui`: a component library shared by `web` application
- `@repo/graphql`: subgraph queries
- `@repo/eslint-config`: shared `eslint` configurations
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/).

### Web App

Purpose: To provide a dashboard for the Eigen community to view staker deposit and withdrawal activity.

The web app is a react application that uses:

- [Vite](https://vitejs.dev) for the build tool
- [React](https://react.dev) for the UI
- [React Query](https://tanstack.com/query/latest/docs/framework/react/overview) for data fetching
- [React Router](https://reactrouter.com) for routing
- [PrimeVue](https://primevue.org) for the UI components
- [TailwindCSS](https://tailwindcss.com) for styling
- [dotenv](https://www.npmjs.com/package/dotenv) for environment variables
- The component library
- Subgraph queries

### Subgraph Queries

- stakers.gql : Get stakers and paginate through using query variables
- staker_deposit_withdrawl.gql : Get a staker's deposit and withdrawals

## Setup and Run

1. Clone the repo
2. Run `yarn install` to install the dependencies
3. In the root of the repo, copy the `.env.example` file to `.env` and set the environment variable `VITE_SUBGRAPH_ENDPOINT` to the subgraph endpoint
4. Run `yarn dev` to start the development server
