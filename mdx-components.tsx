import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => <h1 className="text-4xl font-bold tracking-tight mb-4 text-stone-900" {...props} />,
    h3: (props) => <h3 className="text-2xl font-bold tracking-tight mb-4 mt-8 text-stone-900" {...props} />,
    p: (props) => <p className="mb-6 leading-relaxed text-lg text-stone-700" {...props} />,
    ul: (props) => <ul className="list-disc pl-6 mb-6 space-y-2 text-stone-700 text-lg" {...props} />,
    strong: (props) => <strong className="font-semibold text-orange-600" {...props} />,
    wrapper: (props) => (
      <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_#e3c0a3,_#f4e6d9,_#faf5f0)] py-20 px-6">
        <article className="max-w-3xl mx-auto bg-white/40 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-white/20">
          {props.children}
        </article>
      </main>
    ),
    ...components,
  }
}