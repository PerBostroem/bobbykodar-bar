import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type EventItem = {
  id: number
  slug: string
  title: string
  subtitle: string | null
  excerpt: string | null
  event_date: string
  event_time: string | null
  location_name: string | null
  price_text: string | null
  hero_image_url: string | null
}

export default async function EventsPage() {
  const { data: events, error } = await supabase
    .from('events')
    .select(
      'id, slug, title, subtitle, excerpt, event_date, event_time, location_name, price_text, hero_image_url'
    )
    .eq('status', 'published')
    .order('event_date', { ascending: true })

  if (error) {
    return (
      <main className="min-h-screen bg-neutral-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-semibold">Events</h1>
          <p className="mt-6 text-white/70">Could not load events.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300/80">
          Mucho Gusto
        </p>
        <h1 className="mt-3 text-4xl font-semibold md:text-5xl">Upcoming events</h1>
        <p className="mt-4 max-w-2xl text-white/70">
          Discover upcoming evenings, tastings, live music, and special nights at the bar.
        </p>

        <div className="mt-12 grid gap-6">
          {(events as EventItem[] | null)?.length ? (
            events!.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/8"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm text-amber-300">
                      {event.event_date}
                      {event.event_time ? ` · ${event.event_time}` : ''}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold">{event.title}</h2>
                    {event.subtitle && (
                      <p className="mt-2 text-white/80">{event.subtitle}</p>
                    )}
                    {event.excerpt && (
                      <p className="mt-4 max-w-2xl text-white/65">{event.excerpt}</p>
                    )}
                  </div>

                  <div className="text-sm text-white/60 md:text-right">
                    {event.location_name && <p>{event.location_name}</p>}
                    {event.price_text && <p className="mt-1">{event.price_text}</p>}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/70">
              No published events yet.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}