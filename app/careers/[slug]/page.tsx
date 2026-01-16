import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getJobBySlug } from '@/lib/jobs'
import JobDetailContent from '@/components/careers/JobDetailContent'

interface PageProps {
  params: {
    slug: string
  }
}

export default function JobDetailPage({ params }: PageProps) {
  const job = getJobBySlug(params.slug)

  if (!job) {
    notFound()
  }

  return <JobDetailContent job={job} />
}
