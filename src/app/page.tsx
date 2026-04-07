export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-amber-300/80">
            Bobbykodar Bar
          </p>

          <h1 className="max-w-4xl text-5xl font-semibold leading-tight md:text-7xl">
            Cocktails, atmosphere, and unforgettable nights.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
            A stylish cocktail bar experience for intimate evenings, private
            events, curated menus, and memorable gatherings.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#menu"
              className="rounded-full bg-amber-300 px-6 py-3 font-medium text-black transition hover:opacity-90"
            >
              View Menu
            </a>
            <a
              href="#events"
              className="rounded-full border border-white/20 px-6 py-3 font-medium text-white transition hover:bg-white/10"
            >
              Book an Event
            </a>
          </div>
        </div>
      </section>

      <section id="menu" className="mx-auto max-w-6xl px-6 py-20 md:px-10">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300/80">
            Signature cocktails
          </p>
          <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
            Crafted drinks with character
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              name: "Velvet Ember",
              desc: "Dark rum, cherry, smoke, citrus",
              price: "165 SEK",
            },
            {
              name: "Golden Hour",
              desc: "Gin, apricot, lemon, tonic foam",
              price: "155 SEK",
            },
            {
              name: "Midnight Bloom",
              desc: "Vodka, blackberry, violet, lime",
              price: "158 SEK",
            },
          ].map((drink) => (
            <div
              key={drink.name}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-medium">{drink.name}</h3>
                <span className="text-sm text-amber-300">{drink.price}</span>
              </div>
              <p className="mt-4 text-white/70">{drink.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="events"
        className="border-y border-white/10 bg-white/5"
      >
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10">
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-300/80">
                Private events
              </p>
              <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                Book the bar for your next evening
              </h2>
              <p className="mt-6 max-w-xl text-white/70">
                Perfect for birthdays, company evenings, cocktail tastings, and
                private celebrations in a refined setting.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
              <div className="grid gap-4">
                <input
                  placeholder="Your name"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/40"
                />
                <input
                  placeholder="Email"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/40"
                />
                <input
                  placeholder="Date"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/40"
                />
                <textarea
                  placeholder="Tell us about your event"
                  className="min-h-32 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/40"
                />
                <button className="rounded-full bg-amber-300 px-6 py-3 font-medium text-black transition hover:opacity-90">
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:px-10">
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
              hello@bobbykodar.se
              <br />
              +46 70 123 45 67
              <br />
              Stockholm, Sweden
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}