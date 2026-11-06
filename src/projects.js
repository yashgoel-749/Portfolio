export const projects = [
  {
    id: "syncsave",
    number: "01",
    name: "SyncSave",
    category: "real-time",
    color: "blue",
    summary: "One workspace. Many minds. Always in sync.",
    stack: ["Next.js", "TypeScript", "Yjs", "WebSockets", "PostgreSQL"],
    challenge:
      "How do you keep a shared document usable when multiple people edit at once—or when someone loses their connection?",
    solution:
      "An offline-first collaborative editor and shared whiteboard. Yjs CRDTs coordinate concurrent changes, IndexedDB retains local edits, and WebSockets synchronize updates when the connection returns.",
    highlights: [
      "Live cursors, rich-text editing, and a collaborative whiteboard.",
      "Owner, editor, and viewer permissions enforced at the WebSocket layer, with live revocation.",
      "Debounced, sequential PostgreSQL writes for durable document state.",
    ],
    source: "https://github.com/yashgoel-749/SyncSave",
    demo: "https://syncsave.vercel.app",
  },
  {
    id: "linkflow",
    number: "02",
    name: "LinkFlow",
    category: "backend",
    color: "lavender",
    summary: "Shorter links. A clearer picture.",
    stack: ["React", "Express", "PostgreSQL", "Redis", "Playwright"],
    challenge:
      "A short link is simple. Managing its lifecycle, protecting access, and understanding redirects requires a complete backend.",
    solution:
      "A URL management application with custom aliases, expiration, password-protected redirects, QR codes, and click analytics. Redis caches redirect lookups with PostgreSQL fallback and explicit invalidation.",
    highlights: [
      "JWT-based HttpOnly sessions, ownership checks, and Zod request validation.",
      "Click-event analytics without fabricated conversion or geography metrics.",
      "Backend integration tests, Playwright browser tests, and Swagger API documentation.",
    ],
    source: "https://github.com/yashgoel-749/linkflow",
  },
  {
    id: "amazon",
    number: "03",
    name: "Amazon Clone",
    category: "commerce",
    color: "peach",
    summary: "The whole journey. From browse to basket.",
    stack: ["Next.js", "React", "Node.js", "PostgreSQL", "JWT"],
    challenge:
      "Re-create a familiar shopping experience while keeping catalog, cart, account, and order state consistent.",
    solution:
      "A responsive full-stack storefront with product search, category browsing, wishlists, persistent carts, and order history. Express REST APIs and PostgreSQL handle application data; React Context manages the client experience.",
    highlights: [
      "Product discovery, cart updates, addresses, and a multi-step shopping flow.",
      "Google sign-in and JWT authentication.",
      "Simulated checkout for demonstration—not a real payment integration.",
    ],
    source: "https://github.com/yashgoel-749/clone",
    demoNote:
      "The previous Vercel demo is currently disabled. The complete source is available on GitHub.",
  },
];
