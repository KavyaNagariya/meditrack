# MediTrack Pro - Design Guidelines

## Design Approach
**System Selected:** Material Design principles adapted for healthcare context
**Rationale:** Healthcare applications require clarity, trustworthiness, and efficiency. Material Design's emphasis on clear hierarchy, purposeful motion, and structured layouts aligns perfectly with clinical users who need quick information access and decision-making support.

## Typography System

**Font Family:** Inter (primary), system fallback
- Hero Headline: 3.5rem (56px) / font-bold / tracking-tight / leading-tight
- Section Headers: 2.25rem (36px) / font-bold / leading-snug
- Subsection Titles: 1.5rem (24px) / font-semibold
- Body Large: 1.125rem (18px) / font-normal / leading-relaxed
- Body Standard: 1rem (16px) / font-normal / leading-relaxed
- Small Text/Labels: 0.875rem (14px) / font-medium
- Button Text: 1rem / font-semibold / tracking-wide

**Hierarchy Rules:**
- All headlines use sentence case for approachability
- Feature cards maintain consistent title sizing (1.25rem)
- Form labels always 0.875rem with medium weight for clarity

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Section padding: py-20 (desktop) / py-12 (mobile)
- Component gaps: gap-8 (cards) / gap-4 (inline elements)
- Container max-width: max-w-7xl with px-6 (mobile) / px-8 (desktop)
- Form field spacing: space-y-6 for vertical stacks

**Grid Strategy:**
- Features: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 with gap-8
- Benefits/Stats: grid-cols-1 md:grid-cols-3 with gap-6
- How It Works: flex column on mobile, 3-column grid on desktop
- Trust Badges: grid-cols-2 md:grid-cols-4 with gap-4

## Component Library

### Header (Sticky)
- Height: h-20 with backdrop-blur-md
- Logo: h-8 with hospital cross icon
- Navigation: hidden md:flex with gap-8, text-sm font-medium
- Buttons: Sign Up (primary solid) + Login (secondary outline) on right
- Mobile: Hamburger menu with slide-out drawer

### Hero Section
- Layout: Two-column on desktop (60/40 split), stacked on mobile
- Left: Headline + subheadline + CTA row (Request Demo primary, Watch Overview outline)
- Right: Dashboard mockup image with subtle shadow and rounded corners (rounded-xl)
- Height: min-h-[600px] with centered vertical alignment
- Background: Subtle gradient overlay from top

### Feature Cards
- 6 cards in 3-column grid (2 rows)
- Card structure: Icon container (w-12 h-12, rounded-lg) + Title (font-semibold, 1.25rem) + Description (text-sm, leading-relaxed)
- Card padding: p-6 with rounded-xl borders
- Hover: Subtle lift effect (translate-y-[-4px]) with shadow transition

### How It Works
- 3 numbered steps with large step numbers (4rem, font-bold, slight opacity)
- Icon above each step (w-16 h-16)
- Step cards: p-8, connected with subtle dashed lines on desktop
- Responsive: Stack vertically on mobile with arrow indicators between steps

### Benefits/Trust Section
- Top: 3 stat cards (grid-cols-3) with large numbers (3rem) + description
- Bottom: Trust badge row with icons for HIPAA, encryption, uptime (grid-cols-4, items-center)
- Optional testimonial: Single card with quote, attribution, hospital logo (max-w-3xl centered)

### Demo Form (Inline Section)
- Max width: max-w-2xl centered with p-12 background card
- Form fields: Full-width inputs with h-12, rounded-lg borders
- Beds dropdown: Custom select with chevron icon
- Checkbox: Styled with checkmark, privacy link inline
- Submit button: w-full on mobile, w-auto px-12 on desktop, h-12

### Contact Section
- Two-column layout: Form (60%) + Info sidebar (40%)
- Form inputs: Consistent h-12 with rounded-lg
- Sidebar: Contact details stack with icons, office hours, response time note

### Footer
- Three-column layout on desktop, stacked on mobile
- Column 1: Quick Links (2 columns of links)
- Column 2: Contact info with icons
- Column 3: Newsletter signup + social icons
- Bottom bar: Copyright, language selector, legal links (text-xs)

## Images

**Hero Dashboard Mockup:**
- Position: Right side of hero (40% width on desktop)
- Style: Modern dashboard UI showing contact tracing network visualization with node connections
- Treatment: Floating with shadow (shadow-2xl), slight 3D perspective tilt
- Alt text: "MediTrack Pro dashboard showing real-time contact tracing network with exposure chains and risk alerts"

**Feature Icons:**
- Use Heroicons for all 6 feature cards via CDN
- Icons: MapPinIcon, BellAlertIcon, ChartBarIcon, CircleStackIcon, ChartPieIcon, ShieldCheckIcon
- Size: w-8 h-8 within containers

**Trust Badges:**
- Simple icon representations (lock for encryption, shield for HIPAA, server for uptime)
- Monochrome treatment for consistency

## Interaction Patterns

**Buttons:**
- Primary (Sign Up, Request Demo): px-8 py-3, rounded-lg, font-semibold
- Secondary (Login, Watch): px-8 py-3, rounded-lg, border-2, font-semibold
- Hover states: Managed by button component (no custom implementation)
- Hero CTA buttons on gradient: backdrop-blur-sm background for readability

**Form Interactions:**
- Focus states: ring-2 with offset on all inputs
- Error states: Border treatment with inline error text (text-sm)
- Success: Checkmark icon with confirmation message

**Navigation:**
- Active page: Underline indicator (2px thick)
- Hover: Subtle opacity change (0.7)

**Scroll Behavior:**
- Sticky header with subtle shadow on scroll
- Smooth scroll for anchor links
- Minimal scroll-triggered animations (fade-in only)

## Responsive Breakpoints

**Mobile (< 768px):**
- Single column layouts throughout
- Stacked navigation in drawer
- Full-width buttons
- Hero image moves below headline
- Features stack to single column

**Tablet (768px - 1024px):**
- 2-column feature grid
- Side-by-side hero maintained
- Condensed header navigation

**Desktop (> 1024px):**
- Full 3-column feature grid
- Maximum container width enforced
- Expanded navigation visible

## Accessibility Implementation

- All form inputs with associated labels (not placeholders alone)
- Focus indicators with 2px ring on all interactive elements
- Skip-to-content link for keyboard users
- Alt text on all images describing function, not decoration
- ARIA labels on icon-only buttons
- Minimum touch target: 44x44px for mobile
- Color contrast minimum 4.5:1 for body text, 3:1 for large text