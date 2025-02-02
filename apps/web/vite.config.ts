import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import graphqlLoader from "vite-plugin-graphql-loader";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export default defineConfig({
  plugins: [react(), tailwindcss(), graphqlLoader()],
});
