import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import icon from "astro-icon";

import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  site: 'https://palabron.app',
  base: '',
  integrations: [tailwind(), react(), icon(), compress()]
});