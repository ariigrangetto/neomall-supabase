---
name: TypeScript Audit
description: Instructions for auditing TypeScript files for type safety, missing types, and improper generics.
---

# TypeScript Audit Skill

When applying the TypeScript Audit skill to a project or specific files, follow these guidelines to ensure strict type safety and high code quality.

## Objectives
1. **Eliminate Unsafe `any` Usage**: Identify and replace `any` types with specific interfaces, types, or `unknown` where appropriate.
2. **Ensure Complete Typing**: Verify that all functions have explicit return types and typed parameters. Ensure variables and state are properly typed.
3. **Correct Improper Generics**: Review the use of generics in utility types, components, and functions to ensure they are used correctly and constrained properly.
4. **Improve Interface/Type Definitions**: Check existing interfaces and types to ensure they accurately represent the data structures and use utility types (`Partial`, `Pick`, `Omit`, etc.) effectively.
5. **Strict Null Checks**: Ensure that potential `null` or `undefined` values are properly handled, preventing runtime errors.

## Step-by-Step Audit Process
1. **Identify Target Files**: Determine which file(s) need auditing based on the user's request.
2. **Scan for `any`**: Search for the `any` keyword. Replace each instance with a more precise type or interface.
3. **Review Function Signatures**: Ensure all function parameters have types, and the return type is explicitly stated (e.g., `void`, `React.FC<Props>`, explicitly typed objects).
4. **Check React Component, Context, and State**:
   - For Contexts, ensure the context type matches the provider's value precisely, and provide a meaningful default value or a custom hook that checks for `undefined` (to avoid null reference errors when used outside of a provider).
   - For `useState`, ensure it's not implicitly typing state as `undefined` when it shouldn't be (e.g., `useState<User | null>(null)`).
   - For Components, prefer explicit `Props` interfaces instead of inline types.
5. **Verify Generics Constraints**: Check if generics are too broad. Add constraints using `extends` where necessary (e.g., `<T extends Record<string, unknown>>`).
6. **Refactor and Propose**: Present the findings and the proposed refactored code to the user, highlighting the specific type safety improvements made.

## Examples

### Fixing `any`
**Bad:**
```typescript
function processData(data: any): any { ... }
```
**Good:**
```typescript
interface UserData { id: string; name: string; }
function processData(data: UserData): void { ... }
```

### Context Typing
**Bad:**
```typescript
const MyContext = createContext<any>(null);
```
**Good:**
```typescript
interface MyContextType { theme: string; setTheme: (theme: string) => void; }
const MyContext = createContext<MyContextType | undefined>(undefined);

// Safe use hook
export const useMyContext = () => {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
};
```