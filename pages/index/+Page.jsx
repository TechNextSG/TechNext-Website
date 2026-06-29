import { lazy, Suspense } from 'react'
import Hero from '../../src/components/Hero'
import { SkeletonSection } from '../../src/components/Skeleton'

const About = lazy(() => import('../../src/components/About'))
const Impact = lazy(() => import('../../src/components/Impact'))
const Services = lazy(() => import('../../src/components/Services'))
const WhyTechNext = lazy(() => import('../../src/components/WhyTechNext'))
const Faq = lazy(() => import('../../src/components/Faq'))

export default function Page() {
  return (
    <>
      <Hero />
      <Suspense fallback={<SkeletonSection />}>
        <About />
      </Suspense>
      <Suspense fallback={<SkeletonSection />}>
        <Impact />
      </Suspense>
      <Suspense fallback={<SkeletonSection />}>
        <Services />
      </Suspense>
      <Suspense fallback={<SkeletonSection />}>
        <WhyTechNext />
      </Suspense>
      <Suspense fallback={<SkeletonSection />}>
        <Faq />
      </Suspense>
    </>
  )
}
