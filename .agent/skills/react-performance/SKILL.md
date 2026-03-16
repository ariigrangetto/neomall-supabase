---
nane: react-performance
description: Instructions for optimizing React application performance.
---

# React Performance Optimization Skill

When applying the React Performance Optimization skill to a project or specific files, follow these guidelines to ensure optimal performance and user experience.

## Objectives
1. **Eliminate Unnecessary Re-renders**: Identify and fix components that re-render without need, using `React.memo`, `useMemo`, and `useCallback` effectively.
2. **Optimize Data Fetching**: Ensure data is fetched efficiently, avoiding the "waterfall" effect and using appropriate caching strategies.
3. **Improve Bundle Size**: Analyze and optimize the bundle size by implementing code splitting and lazy loading.
4. **Enhance Rendering Performance**: Optimize large lists and complex UI updates using virtualization and efficient state management.
5. **Reduce Memory Leaks**: Identify and fix potential memory leaks caused by event listeners, timers, or subscriptions.

## Step-by-Step Optimization Process
1. **Identify Performance Bottlenecks**:
   - Use React DevTools Profiler to identify components that re-render frequently or take too long to render.
   - Check for large lists or complex calculations that might be blocking the main thread.

2. **Optimize Component Rendering**:
   - Wrap components that receive the same props frequently with `React.memo`.
   - Use `useMemo` to memoize expensive calculations and `useCallback` to memoize functions passed as props to optimized child components.
   - Ensure state updates are batched and avoid unnecessary state changes.

3. **Optimize Data Fetching**:
   - Use `React.lazy` and `Suspense` for code splitting and lazy loading of components.
   - Implement efficient data fetching strategies (e.g., React Query, SWR) to handle caching, re-fetching, and background updates.
   - Avoid fetching the same data multiple times in a single render cycle.

4. **Optimize Large Lists**:
   - Use `react-window` or `react-virtualized` for rendering large lists to improve performance.
   - Implement proper key usage in `map` functions to help React identify items efficiently.

5. **Fix Memory Leaks**:
   - Clean up event listeners, timers, and subscriptions in `useEffect` cleanup functions.
   - Ensure that `useCallback` and `useMemo` are used correctly to prevent unnecessary re-renders that might cause leaks in child components.

## Examples

### Optimizing Component Re-renders
**Bad:**
```typescript
const Parent = ({ data }) => {
  // Re-renders every time Parent re-renders
  const processedData = processData(data);
  
  return (
    <Child data={processedData} />
  );
};
```
**Good:**
```typescript
const Parent = ({ data }) => {
  // Memoize the processed data
  const processedData = useMemo(() => processData(data), [data]);
  
  return (
    <Child data={processedData} />
  );
};
```

### Lazy Loading Components
**Bad:**
```typescript
import HeavyComponent from './HeavyComponent';

const App = () => {
  return (
    <div>
      <HeavyComponent />
    </div>
  );
};
```
**Good:**
```typescript
import React, { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

const App = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <HeavyComponent />
      </Suspense>
    </div>
  );
};
```

### Fixing Memory Leaks
**Bad:**
```typescript
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);
  
  // Missing cleanup
}, []);
```
**Good:**
```typescript
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);
  
  // Cleanup function to clear the interval
  return () => clearInterval(timer);
}, []);
```