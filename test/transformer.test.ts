import { describe, expect, it } from "vitest";
import { VFile } from "vfile";
import type { Root as HastRoot } from "hast";
import { UnlistedPages } from "../src/transformer";
import { createCtx } from "./helpers";

async function runTransformer(
  frontmatter: Record<string, unknown> | undefined,
  hook: "htmlPlugins" | "virtualPageHtmlPlugins" = "htmlPlugins",
): Promise<Record<string, unknown>> {
  const tree: HastRoot = { type: "root", children: [] };
  const vfile = new VFile("");
  (vfile as unknown as { data: Record<string, unknown> }).data =
    frontmatter !== undefined ? { frontmatter } : {};

  const ctx = createCtx();
  // typed locally: @quartz-community/types before 1.3 doesn't declare virtualPageHtmlPlugins
  const transformer = UnlistedPages() as unknown as Record<
    string,
    ((ctx: unknown, content: unknown[]) => unknown[]) | undefined
  >;
  const plugins = transformer[hook]?.(ctx, []) ?? [];

  for (const pluginEntry of plugins) {
    const pluginFn = Array.isArray(pluginEntry) ? pluginEntry[0] : pluginEntry;
    const attacher = pluginFn as () => (tree: HastRoot, file: VFile) => void;
    const transform = attacher();
    await transform(tree, vfile);
  }

  return vfile.data as Record<string, unknown>;
}

describe("UnlistedPages transformer", () => {
  it("copies frontmatter.unlisted = true onto file.data.unlisted", async () => {
    const data = await runTransformer({ title: "Secret", unlisted: true });
    expect(data.unlisted).toBe(true);
  });

  it("copies frontmatter.unlisted = false onto file.data.unlisted", async () => {
    const data = await runTransformer({ title: "Public", unlisted: false });
    expect(data.unlisted).toBe(false);
  });

  it("leaves file.data.unlisted undefined when frontmatter has no unlisted field", async () => {
    const data = await runTransformer({ title: "Plain page" });
    expect(data.unlisted).toBeUndefined();
  });

  it("leaves file.data.unlisted undefined when there is no frontmatter at all", async () => {
    const data = await runTransformer(undefined);
    expect(data.unlisted).toBeUndefined();
  });

  it("ignores non-boolean unlisted values (string)", async () => {
    const data = await runTransformer({ title: "Bogus", unlisted: "true" });
    expect(data.unlisted).toBeUndefined();
  });

  it("ignores non-boolean unlisted values (number)", async () => {
    const data = await runTransformer({ title: "Bogus", unlisted: 1 });
    expect(data.unlisted).toBeUndefined();
  });

  it("ignores non-boolean unlisted values (null)", async () => {
    const data = await runTransformer({ title: "Bogus", unlisted: null });
    expect(data.unlisted).toBeUndefined();
  });

  it("does not touch other file.data fields", async () => {
    const tree: HastRoot = { type: "root", children: [] };
    const vfile = new VFile("");
    (vfile as unknown as { data: Record<string, unknown> }).data = {
      slug: "notes/a",
      text: "hello",
      frontmatter: { title: "A", unlisted: true },
    };

    const ctx = createCtx();
    const transformer = UnlistedPages();
    const plugins = transformer.htmlPlugins?.(ctx) ?? [];
    for (const pluginEntry of plugins) {
      const pluginFn = Array.isArray(pluginEntry) ? pluginEntry[0] : pluginEntry;
      const attacher = pluginFn as () => (tree: HastRoot, file: VFile) => void;
      const transform = attacher();
      await transform(tree, vfile);
    }

    const data = vfile.data as Record<string, unknown>;
    expect(data.unlisted).toBe(true);
    expect(data.slug).toBe("notes/a");
    expect(data.text).toBe("hello");
  });

  it("exposes a transformer with name 'UnlistedPages'", () => {
    const transformer = UnlistedPages();
    expect(transformer.name).toBe("UnlistedPages");
  });

  it("is callable with no arguments (zero-config)", () => {
    expect(() => UnlistedPages()).not.toThrow();
  });
});

describe("UnlistedPages on pages rendered from files (quartz-community/bases-page#11)", () => {
  it("unlists a drawing whose frontmatter says so", async () => {
    const data = await runTransformer({ title: "Plan", unlisted: true }, "virtualPageHtmlPlugins");
    expect(data.unlisted).toBe(true);
  });

  it("leaves a page without frontmatter unlisted alone", async () => {
    const data = await runTransformer({ title: "Board", tags: [] }, "virtualPageHtmlPlugins");
    expect(data.unlisted).toBeUndefined();
  });
});
