import type { PluggableList, Plugin } from "unified";
import type { Root as HastRoot } from "hast";
import type { VFile } from "vfile";
import type { QuartzTransformerPlugin } from "@quartz-community/types";

const rehypeUnlisted = (): Plugin<[], HastRoot> => {
  return () => (_tree: HastRoot, file: VFile) => {
    const frontmatter = file.data?.frontmatter as Record<string, unknown> | undefined;
    const unlisted = frontmatter?.unlisted;
    if (typeof unlisted === "boolean") {
      (file.data as Record<string, unknown>).unlisted = unlisted;
    }
  };
};

export const UnlistedPages: QuartzTransformerPlugin<undefined> = () => {
  // a variable, not a literal: `virtualPageHtmlPlugins` is newer than the declared types
  const instance: ReturnType<QuartzTransformerPlugin> & {
    virtualPageHtmlPlugins(): PluggableList;
  } = {
    name: "UnlistedPages",
    htmlPlugins(): PluggableList {
      return [rehypeUnlisted()];
    },
    // Pages rendered from files (Quartz 5.1+): a drawing stored as Markdown has frontmatter, and
    // `unlisted:` there unlists it like a note (quartz-community/bases-page#11).
    virtualPageHtmlPlugins(): PluggableList {
      return [rehypeUnlisted()];
    },
  };
  return instance;
};
