declare module '*.mdx' {
  import type { ReactNode } from 'react'
  const MDXComponent: (props: any) => ReactNode
  export default MDXComponent
}