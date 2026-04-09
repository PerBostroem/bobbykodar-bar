import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type EventPageProps = {
  params: Promise<{ slug: string }>
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { slug } = await params

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !event) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300/80">
          Event
        </p>

        <h1 className="mt-3 text-4xl font-semibold md:text-5xl">{event.title}</h1>

        {event.subtitle && (
          <p className="mt-4 text-xl text-white/80">{event.subtitle}</p>
        )}

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/75">
          <p><strong>Date:</strong> {event.event_date}</p>
          {event.event_time && <p className="mt-2"><strong>Time:</strong> {event.event_time}</p>}
          {event.location_name && (
            <p className="mt-2"><strong>Location:</strong> {event.location_name}</p>
          )}
          {event.address && <p className="mt-2"><strong>Address:</strong> {event.address}</p>}
          {event.price_text && <p className="mt-2"><strong>Price:</strong> {event.price_text}</p>}
        </div>

        {event.description && (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="whitespace-pre-line leading-8 text-white/75">
              {event.description}
            </p>
          </div>
        )}

        {event.booking_url && (
          <div className="mt-10">
            <a
              href={event.booking_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full bg-amber-300 px-6 py-3 font-medium text-black"
            >
              Book now
            </a>
          </div>
        )}
      </div>
    </main>
  )
}
