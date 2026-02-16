# UI Kit Documentation

This document outlines the reusable UI components for the Trader Deportivo application.

## Rules

- Do not invent new card patterns. Use the components from this UI kit.
- If a new component is needed, it must be approved and added to the kit.

## Components

### SectionCard

A container for a section of content with a title and an optional link.

**Props:**

- `title`: `string` - The title of the section.
- `link?`: `{ href: string; label: string; }` - An optional link to display in the header.
- `children`: `React.ReactNode` - The content of the section.
- `className?`: `string` - Optional additional CSS classes.

**Example:**

```tsx
import { SectionCard } from '@/components/ui-kit/SectionCard';

<SectionCard title="My Favorite Tipsters">
  <p>Content goes here...</p>
</SectionCard>
```

### MetricCard

A card for displaying a single metric.

**Props:**

- `title`: `string` - The title of the metric.
- `icon?`: `React.ReactNode` - An optional icon to display in the header.
- `children`: `React.ReactNode` - The content of the card.
- `className?`: `string` - Optional additional CSS classes.

**Example:**

```tsx
import { MetricCard } from '@/components/ui-kit/MetricCard';

<MetricCard title="Current Plan" icon="💎">
  <p>Content goes here...</p>
</MetricCard>
```