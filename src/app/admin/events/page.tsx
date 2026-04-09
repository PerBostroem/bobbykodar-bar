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
}

export default async function Home() {
  const { data: events } = await supabase
    .from('events')
    .select(
      'id, slug, title, subtitle, excerpt, event_date, event_time, location_name, price_text'
    )
    .eq('status', 'published')
    .order('event_date', { ascending: true })
    .limit(3)

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-amber-300/80">
            Mucho Gusto
          </p>

          <h1 className="max-w-4xl text-5xl font-semibold leading-tight md:text-7xl">
            Cocktails, atmosphere, and unforgettable nights.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
            A stylish cocktail bar experience in Kragerø with curated cocktails,
            intimate events, and memorable evenings.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="/events"
              className="rounded-full bg-amber-300 px-6 py-3 font-medium text-black transition hover:opacity-90"
            >
              View Events
            </a>
            <a
              href="#contact"
              className="rounded-full border border-white/20 px-6 py-3 font-medium text-white transition hover:bg-white/10"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:px-10">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-300/80">
              Upcoming events
            </p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              What’s happening next
            </h2>
          </div>

          <Link
            href="/events"
            className="hidden rounded-full border border-white/15 px-5 py-2 text-sm text-white/80 transition hover:bg-white/10 md:inline-flex"
          >
            See all events
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {(events as EventItem[] | null)?.length ? (
            events!.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/8"
              >
                <p className="text-sm text-amber-300">
                  {event.event_date}
                  {event.event_time ? ` · ${event.event_time}` : ''}
                </p>

                <h3 className="mt-3 text-2xl font-semibold">{event.title}</h3>

                {event.subtitle && (
                  <p className="mt-3 text-white/80">{event.subtitle}</p>
                )}

                {event.excerpt && (
                  <p className="mt-4 text-white/65">{event.excerpt}</p>
                )}

                <div className="mt-6 space-y-1 text-sm text-white/55">
                  {event.location_name && <p>{event.location_name}</p>}
                  {event.price_text && <p>{event.price_text}</p>}
                </div>

                <div className="mt-6 inline-flex rounded-full border border-white/15 px-4 py-2 text-sm text-white/80">
                  View event
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/70 md:col-span-3">
              No upcoming events yet.
            </div>
          )}
        </div>
      </section>

      <section id="contact" className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-300/80">
                Visit us
              </p>
              <h2 className="mt-3 text-3xl font-semibold">Contact</h2>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-medium">Opening hours</h3>
              <p className="mt-4 text-white/70">
                Thu–Fri: 17:00–01:00
                <br />
                Sat: 16:00–02:00
                <br />
                Sun: Closed
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-medium">Get in touch</h3>
              <p className="mt-4 text-white/70">
                hello@muchogusto.no
                <br />
                Kragerø, Norway
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}