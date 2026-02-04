# Layout Resilience Guide

Small changes can break layouts when flex/grid overflow isn't handled. Follow these patterns to avoid cascading breakages.

## Key Patterns

### 1. Flex containers – add `min-w-0`

Flex children default to `min-width: auto`, which can prevent shrinking and cause horizontal overflow. Add `min-w-0` to flex containers so children can shrink:

```tsx
<div className="flex flex-1 min-w-0">
  <Sidebar />
  <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
    {children}
  </main>
</div>
```

### 2. Grid items – add `min-w-0`

Grid items can overflow when content is wide. Add `min-w-0` to grid containers and cards:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">
  <div className="min-w-0">...</div>
</div>
```

### 3. Text – use `break-words` for long content

Prevent text from overflowing on small screens:

```tsx
<h1 className="break-words">Long title that might wrap</h1>
```

### 4. Header branding – prevent flex squeeze

Use `flex-shrink-0` on logo and primary text so they don't truncate:

```tsx
<div className="flex items-center gap-3 min-w-0 flex-shrink-0">
  <div className="flex-shrink-0">Logo</div>
  <h1 className="whitespace-nowrap">Brand</h1>
</div>
```

### 5. Root overflow

Use `overflow-x-hidden overflow-y-auto` instead of `overflow-hidden` when you need vertical scroll but want to clip horizontal overflow:

```tsx
<div className="min-h-screen overflow-x-hidden overflow-y-auto">
```

## When in doubt

- Add `min-w-0` to flex and grid children that might overflow
- Add `overflow-x-hidden` to main content areas
- Use responsive text sizes: `text-4xl sm:text-5xl md:text-6xl`
- Test on narrow viewports (375px, 390px) for mobile
