import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Steps, Step } from 'fumadocs-ui/components/steps';
import type { MDXComponents } from 'mdx/types';

function Card({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-fd-border bg-fd-card p-4">
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-fd-muted-foreground">{description}</p>
    </div>
  );
}

function Cards({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
      {children}
    </div>
  );
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Card,
    Cards,
    Steps,
    Step,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
