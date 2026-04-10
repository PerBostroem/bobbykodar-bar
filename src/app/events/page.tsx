'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[åä]/g, 'a')
        .replace(/ö/g, 'o')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

type EventRow = {
    id: number
    slug: string
    title: string
    subtitle: string | null
    excerpt: string | null
    description: string | null
    event_date: string
    event_time: string | null
    location_name: string | null
    address: string | null
    price_text: string | null
    booking_url: string | null
    hero_image_url: string | null
    instagram_caption: string | null
    facebook_caption: string | null
    google_short_text: string | null
    status: string
    featured: boolean

}

const emptyForm = {
    title: '',
    subtitle: '',
    excerpt: '',
    description: '',
    event_date: '',
    event_time: '',
    location_name: 'Mucho Gusto, Kragerø',
    address: '',
    price_text: '',
    booking_url: '',
    hero_image_url: '',
    instagram_caption: '',
    facebook_caption: '',
    google_short_text: '',
    status: 'draft',
    featured: false,
}

export default function AdminEventsPage() {
    const [form, setForm] = useState(emptyForm)
    const [statusMessage, setStatusMessage] = useState('')
    const [events, setEvents] = useState<EventRow[]>([])
    const [loadingEvents, setLoadingEvents] = useState(true)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [saving, setSaving] = useState(false)

    async function loadEvents() {
        setLoadingEvents(true)

        const { data, error } = await supabase
            .from('events')
            .select(`
        id,
        slug,
        title,
        subtitle,
        excerpt,
        description,
        event_date,
        event_time,
        location_name,
        address,
        price_text,
        booking_url,
        hero_image_url,
        status,
        featured
      `)
            .order('event_date', { ascending: true })

        if (error) {
            console.error('Load events error:', error)
            setStatusMessage(`Load error: ${error.message}`)
            setLoadingEvents(false)
            return
        }

        setEvents((data as EventRow[]) || [])
        setLoadingEvents(false)
    }

    useEffect(() => {
        loadEvents()
    }, [])

    function startEdit(event: EventRow) {
        setEditingId(event.id)
        setStatusMessage('')
        setForm({
            title: event.title ?? '',
            subtitle: event.subtitle ?? '',
            excerpt: event.excerpt ?? '',
            description: event.description ?? '',
            event_date: event.event_date ?? '',
            event_time: event.event_time ?? '',
            location_name: event.location_name ?? 'Mucho Gusto, Kragerø',
            address: event.address ?? '',
            price_text: event.price_text ?? '',
            booking_url: event.booking_url ?? '',
            hero_image_url: event.hero_image_url ?? '',
            instagram_caption: event.instagram_caption ?? '',
            facebook_caption: event.facebook_caption ?? '',
            google_short_text: event.google_short_text ?? '',
            status: event.status ?? 'draft',
            featured: !!event.featured,
        })

        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    function cancelEdit() {
        setEditingId(null)
        setForm(emptyForm)
        setStatusMessage('Edit cancelled.')
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        setStatusMessage(editingId ? 'Updating...' : 'Saving...')

        try {
            const slugBase = slugify(form.title)
            const slug = editingId
                ? slugBase
                : `${slugBase}-${Date.now()}`

            const payload = {
                slug,
                title: form.title,
                subtitle: form.subtitle || null,
                excerpt: form.excerpt || null,
                description: form.description || null,
                event_date: form.event_date,
                event_time: form.event_time || null,
                location_name: form.location_name || null,
                address: form.address || null,
                price_text: form.price_text || null,
                booking_url: form.booking_url || null,
                hero_image_url: form.hero_image_url || null,
                instagram_caption: form.instagram_caption || null,
                facebook_caption: form.facebook_caption || null,
                google_short_text: form.google_short_text || null,
                status: form.status,
                featured: form.featured,
                published_at: form.status === 'published' ? new Date().toISOString() : null,
                updated_at: new Date().toISOString(),
            }

            if (editingId) {
                const { error } = await supabase
                    .from('events')
                    .update(payload)
                    .eq('id', editingId)

                if (error) {
                    console.error('Update error:', error)
                    setStatusMessage(`Error: ${error.message}`)
                    setSaving(false)
                    return
                }

                setStatusMessage('Event updated.')
            } else {
                const { error } = await supabase.from('events').insert(payload)

                if (error) {
                    console.error('Insert error:', error)
                    setStatusMessage(`Error: ${error.message}`)
                    setSaving(false)
                    return
                }

                setStatusMessage('Event saved.')
            }

            setEditingId(null)
            setForm(emptyForm)
            await loadEvents()
        } catch (err) {
            console.error('Submit error:', err)
            setStatusMessage(
                `Error: ${err instanceof Error ? err.message : 'Unknown error'}`
            )
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete(id: number) {
        const confirmed = window.confirm('Delete this event?')
        if (!confirmed) return

        setDeletingId(id)
        setStatusMessage('Deleting...')

        const { error } = await supabase.from('events').delete().eq('id', id)

        if (error) {
            console.error('Delete error:', error)
            setStatusMessage(`Delete error: ${error.message}`)
            setDeletingId(null)
            return
        }

        if (editingId === id) {
            setEditingId(null)
            setForm(emptyForm)
        }

        setStatusMessage('Event deleted.')
        setDeletingId(null)
        await loadEvents()
    }

    async function copyText(value: string | null, label: string) {
        if (!value) {
            setStatusMessage(`No ${label} to copy.`)
            return
        }

        try {
            await navigator.clipboard.writeText(value)
            setStatusMessage(`${label} copied.`)
        } catch {
            setStatusMessage(`Could not copy ${label}.`)
        }
    }

    return (
        <main className="min-h-screen bg-neutral-950 px-6 py-20 text-white">
            <div className="mx-auto max-w-5xl">
                <p className="text-sm uppercase tracking-[0.3em] text-amber-300/80">
                    Admin
                </p>
                <h1 className="mt-3 text-4xl font-semibold">
                    {editingId ? 'Edit event' : 'Create event'}
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="mt-10 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6"
                >
                    <input
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                        placeholder="Title"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        required
                    />

                    <input
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                        placeholder="Subtitle"
                        value={form.subtitle}
                        onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                    />

                    <textarea
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                        placeholder="Excerpt"
                        value={form.excerpt}
                        onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    />

                    <textarea
                        className="min-h-40 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                        placeholder="Description"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />

                    <input
                        type="date"
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                        value={form.event_date}
                        onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                        required
                    />

                    <input
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                        placeholder="Event time"
                        value={form.event_time}
                        onChange={(e) => setForm({ ...form, event_time: e.target.value })}
                    />

                    <input
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                        placeholder="Location"
                        value={form.location_name}
                        onChange={(e) => setForm({ ...form, location_name: e.target.value })}
                    />

                    <input
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                        placeholder="Address"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                    />

                    <input
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                        placeholder="Price text"
                        value={form.price_text}
                        onChange={(e) => setForm({ ...form, price_text: e.target.value })}
                    />

                    <input
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                        placeholder="Booking URL"
                        value={form.booking_url}
                        onChange={(e) => setForm({ ...form, booking_url: e.target.value })}
                    />

                    <input
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                        placeholder="Hero image URL"
                        value={form.hero_image_url}
                        onChange={(e) => setForm({ ...form, hero_image_url: e.target.value })}
                    />

                    <textarea
                        className="min-h-28 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                        placeholder="Instagram caption"
                        value={form.instagram_caption}
                        onChange={(e) => setForm({ ...form, instagram_caption: e.target.value })}
                    />

                    <textarea
                        className="min-h-28 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                        placeholder="Facebook caption"
                        value={form.facebook_caption}
                        onChange={(e) => setForm({ ...form, facebook_caption: e.target.value })}
                    />

                    <textarea
                        className="min-h-24 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                        placeholder="Google short text / teaser"
                        value={form.google_short_text}
                        onChange={(e) => setForm({ ...form, google_short_text: e.target.value })}
                    />

                    <select
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                        <option value="draft">draft</option>
                        <option value="published">published</option>
                    </select>

                    <label className="flex items-center gap-3 text-white/80">
                        <input
                            type="checkbox"
                            checked={form.featured}
                            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                        />
                        Featured event
                    </label>

                    <div className="flex flex-wrap gap-3">
                        <button
                            disabled={saving}
                            className="rounded-full bg-amber-300 px-6 py-3 font-medium text-black disabled:opacity-60"
                        >
                            {saving
                                ? editingId
                                    ? 'Updating...'
                                    : 'Saving...'
                                : editingId
                                    ? 'Update event'
                                    : 'Save event'}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="rounded-full border border-white/15 px-6 py-3 font-medium text-white/80 transition hover:bg-white/10"
                            >
                                Cancel edit
                            </button>
                        )}
                    </div>
                </form>

                {statusMessage && <p className="mt-6 text-white/70">{statusMessage}</p>}

                <section className="mt-16">
                    <div className="mb-6">
                        <p className="text-sm uppercase tracking-[0.3em] text-amber-300/80">
                            Existing events
                        </p>
                        <h2 className="mt-3 text-3xl font-semibold">Manage events</h2>
                    </div>

                    <div className="grid gap-4">
                        {loadingEvents ? (
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/70">
                                Loading events...
                            </div>
                        ) : events.length === 0 ? (
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/70">
                                No events yet.
                            </div>
                        ) : (
                            events.map((event) => (
                                <div
                                    key={event.id}
                                    className="rounded-3xl border border-white/10 bg-white/5 p-6"
                                >
                                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <p className="text-sm text-amber-300">
                                                {event.event_date}
                                                {event.event_time ? ` · ${event.event_time}` : ''}
                                            </p>
                                            <h3 className="mt-2 text-2xl font-semibold">{event.title}</h3>

                                            <div className="mt-3 flex flex-wrap gap-2 text-sm text-white/60">
                                                <span className="rounded-full border border-white/10 px-3 py-1">
                                                    {event.status}
                                                </span>
                                                {event.featured && (
                                                    <span className="rounded-full border border-amber-300/30 px-3 py-1 text-amber-300">
                                                        featured
                                                    </span>
                                                )}
                                                {event.location_name && (
                                                    <span className="rounded-full border border-white/10 px-3 py-1">
                                                        {event.location_name}
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-4 text-sm text-white/50">/{event.slug}</p>
                                        </div>

                                        <div className="flex gap-3">
                                            <a
                                                href={`/events/${event.slug}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
                                            >
                                                View
                                            </a>

                                            <button
                                                onClick={() => startEdit(event)}
                                                className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(event.id)}
                                                disabled={deletingId === event.id}
                                                className="rounded-full border border-red-400/20 px-4 py-2 text-sm text-red-300 transition hover:bg-red-400/10 disabled:opacity-50"
                                            >
                                                {deletingId === event.id ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </div>
                                        <div className="mt-4 flex flex-wrap gap-3">
                                            <button
                                                type="button"
                                                onClick={() => copyText(event.instagram_caption, 'Instagram caption')}
                                                className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
                                            >
                                                Copy Instagram
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => copyText(event.facebook_caption, 'Facebook caption')}
                                                className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
                                            >
                                                Copy Facebook
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => copyText(event.google_short_text, 'Google text')}
                                                className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
                                            >
                                                Copy Google
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </main>
    )
}