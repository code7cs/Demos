# Angular → React mental-model map

The most important difference:

- **Angular is a full framework** with official solutions for routing, DI, forms, HTTP, and testing.
- **React is primarily a UI library.** React supplies components, state, context, refs, and effects; your framework or libraries supply the rest.

Do not search for a perfect one-to-one translation. Translate the **purpose**, not merely the syntax.

## 1. Core concepts

| Angular | React equivalent | Important difference |
|---|---|---|
| Component class | Function component | React components are ordinary functions |
| `@Component()` | `function Component()` | No component decorator |
| HTML template | JSX/TSX | Markup lives inside JavaScript/TypeScript |
| Component selector | JSX component name | `<app-user>` → `<User />` |
| Template context | Function scope | Variables are normal JS variables |
| Component instance fields | Local variables, state, refs | Choose based on whether changes affect rendering |
| Component method | Function inside component | Event handlers are ordinary functions |
| Standalone component | Normal React component | React components are naturally standalone |
| NgModule | ES modules | No React module registry |
| Angular CLI | Vite or framework CLI | Common choices: Vite and Next.js |
| Zone/change detection | Render triggered by state/props/context | React rerenders component functions |

```tsx
// Angular idea
@Component({ selector: 'app-counter' })
export class Counter {
  count = 0;
}

// React
function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

## 2. Templates and JSX

| Angular template | React JSX |
|---|---|
| `{{ name }}` | `{name}` |
| `[value]="name"` | `value={name}` |
| `(click)="save()"` | `onClick={save}` |
| `[(ngModel)]="name"` | `value={name}` + `onChange` |
| `[class.active]="active"` | `className={active ? 'active' : ''}` |
| `[style.color]="color"` | `style={{ color }}` |
| `*ngIf="visible"` | `{visible && <Thing />}` |
| `@if (visible)` | `{visible ? <Thing /> : <Fallback />}` |
| `*ngFor="let item of items"` | `{items.map(item => ...)}` |
| `@for (...; track item.id)` | `.map()` with `key={item.id}` |
| `ng-template` | JSX variable, function, or component |
| `ng-container` | Fragment `<>...</>` |
| `ng-content` | `children` |
| Named content projection | Explicit props such as `header`, `footer` |
| Template reference `#input` | `useRef()` |
| Pipe | Function call or derived value |
| `async` pipe | Framework query hook or local async state |
| Safe navigation `user?.name` | Same JavaScript optional chaining |
| `[innerHTML]` | `dangerouslySetInnerHTML` |
| `trackBy` | `key` |

```tsx
function UserList({ users }: { users: User[] }) {
  return (
    <>
      {users.length === 0 ? (
        <p>No users</p>
      ) : (
        users.map(user => <UserCard key={user.id} user={user} />)
      )}
    </>
  );
}
```

A React `key` is not available as a normal prop. If the child needs the ID, pass it separately.

## 3. Inputs, outputs, and communication

| Angular | React |
|---|---|
| `@Input()` / `input()` | Props |
| `@Output()` / `output()` | Callback prop |
| `EventEmitter<T>` | `(value: T) => void` |
| Required input | Required TypeScript prop |
| Input alias | Different prop name |
| Parent → child | Props |
| Child → parent | Callback prop |
| Two-way binding | Controlled value + callback |
| Content projection | `children` or JSX props |
| `ViewChild` | `useRef` |
| Shared service | Lifted state, context, or external store |

```tsx
type SearchProps = {
  query: string;
  onQueryChange: (query: string) => void;
};

function Search({ query, onQueryChange }: SearchProps) {
  return (
    <input
      value={query}
      onChange={event => onQueryChange(event.target.value)}
    />
  );
}
```

React callbacks are the closest equivalent to Angular outputs:

```html
<!-- Angular -->
<app-search
  [query]="query"
  (queryChange)="query = $event"
/>
```

```tsx
<Search query={query} onQueryChange={setQuery} />
```

## 4. Local state

| Angular | React |
|---|---|
| Plain component field | Usually `useState` if rendered |
| `signal()` | `useState` |
| `computed()` | Calculate during render; occasionally `useMemo` |
| `effect()` | `useEffect`, but only for external synchronization |
| `signal.update()` | Functional state update |
| Mutable private field | `useRef` when rendering should not change |
| Derived getter | Derived variable during render |
| Multiple related fields | Object state or `useReducer` |

```tsx
const [count, setCount] = useState(0);

setCount(previous => previous + 1);

const doubled = count * 2;
```

Do not automatically translate every Angular field into `useState`.

Use:

- Normal variable for a value calculated during render.
- `useState` for data that affects rendering.
- `useRef` for a persistent mutable value that should not rerender.
- `useReducer` for related transitions or complex state.

React state is a render-time snapshot. Calling a setter schedules another render; it does not mutate the current render’s value. [React state documentation](https://react.dev/learn/state-as-a-snapshot)

## 5. Signals and derived state

| Angular Signals | React |
|---|---|
| `signal(initial)` | `useState(initial)` |
| `value()` | Read `value` directly |
| `value.set(next)` | `setValue(next)` |
| `value.update(fn)` | `setValue(fn)` |
| `computed(() => ...)` | Calculate directly during render |
| Expensive `computed()` | `useMemo()` if measurement justifies it |
| `effect()` | `useEffect()` for external systems |

```tsx
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');

// Derived—not separate state
const fullName = `${firstName} ${lastName}`;
```

Avoid this:

```tsx
const [fullName, setFullName] = useState('');

useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
```

If a value can be calculated from props/state, calculate it during rendering.

## 6. Lifecycle

| Angular lifecycle | Closest React concept |
|---|---|
| Constructor | Function execution—not initialization lifecycle |
| `ngOnInit` | Often state initializer; sometimes `useEffect(..., [])` |
| `ngOnChanges` | Render with new props; occasionally an effect |
| `ngDoCheck` | Usually unnecessary |
| `ngAfterViewInit` | `useEffect` or `useLayoutEffect` with a DOM ref |
| `ngAfterViewChecked` | Usually avoid |
| `ngOnDestroy` | Effect cleanup function |
| Input setter | Derive from props or handle in an effect |
| Route init | Router/framework loader or component render |

```tsx
useEffect(() => {
  const connection = connect(roomId);

  return () => {
    connection.disconnect();
  };
}, [roomId]);
```

Do not think of `useEffect` as a general-purpose `ngOnInit`. It exists to synchronize React with an external system: network connection, timer, subscription, DOM API, third-party widget, and similar systems. [React effect documentation](https://react.dev/reference/react/useEffect)

## 7. Events

| Angular | React |
|---|---|
| `(click)="save()"` | `onClick={save}` |
| `$event` | Event handler argument |
| `EventEmitter` | Callback prop |
| `HostListener` | JSX event or effect-based listener |
| `stopPropagation()` | Same DOM API |
| `preventDefault()` | Same DOM API |
| Template statement | JavaScript callback |

```tsx
function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  // Submit
}

<form onSubmit={handleSubmit}>...</form>
```

React handlers must be passed, not called:

```tsx
<button onClick={save}>Save</button>      // Correct
<button onClick={save()}>Save</button>    // Calls during render
```

## 8. Services and dependency injection

| Angular | React solution |
|---|---|
| Injectable service | Plain module, custom hook, context, or store |
| `providedIn: 'root'` | Module singleton or provider near app root |
| Constructor injection | Imports or `useContext()` |
| Injection token | Context object |
| Hierarchical injector | Nested context providers |
| Service with RxJS state | External store/query library/custom hook |
| Facade service | Feature hook or facade module |
| HTTP service | API module plus query hook |

```tsx
const AuthContext = createContext<AuthContextValue | null>(null);

function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return value;
}
```

Do not put every Angular service into Context.

- Stateless API functions → plain imported module.
- Reusable stateful behavior → custom hook.
- Tree-wide dependency/state → Context.
- Server cache → TanStack Query, SWR, or framework solution.
- Complex client state → reducer or external store.

## 9. RxJS

| Angular/RxJS | React approach |
|---|---|
| `Observable<T>` | Promise, state, query hook, or Observable |
| `subscribe()` | Query hook or `useEffect` subscription |
| `async` pipe | Query hook rendering its current status |
| `BehaviorSubject` | Context/store; sometimes `useState` |
| `Subject` event bus | Prefer callbacks or reducer actions |
| `switchMap` for search | Query library, abortable effect, or RxJS |
| `combineLatest` | Derived render value |
| `takeUntilDestroyed` | Effect cleanup |
| `debounceTime` | Debounced custom hook |
| `catchError` | `try/catch` or query error state |
| `shareReplay` | Query cache or external store |

RxJS remains usable in React, but it is not the default model. Do not replace Observables mechanically with `useEffect`.

For server data, think:

```tsx
const {
  data,
  isPending,
  error,
  refetch,
} = useQuery({
  queryKey: ['transactions', accountId],
  queryFn: () => getTransactions(accountId),
});
```

## 10. HTTP and server state

| Angular | React ecosystem |
|---|---|
| `HttpClient` | `fetch`, Axios, framework fetch |
| HTTP interceptor | Fetch wrapper, Axios interceptor, middleware |
| Observable response | Promise |
| Resolver | Router loader or server component |
| Transfer state | Framework hydration/cache |
| Global loading interceptor | Query/client state or router pending UI |
| API service class | Plain typed functions |
| `HttpErrorResponse` | Custom error normalization |

A useful architecture:

```text
API function → query hook → page/container → presentational components
```

```tsx
async function getTransactions(): Promise<Transaction[]> {
  const response = await fetch('/api/transactions');

  if (!response.ok) {
    throw new Error('Unable to load transactions');
  }

  return response.json();
}
```

Always model loading, error, empty, and success separately.

## 11. Forms

| Angular Forms | React |
|---|---|
| Template-driven form | Controlled or uncontrolled form |
| Reactive Forms | React Hook Form, Formik, or controlled state |
| `FormControl` | Input state or library field |
| `FormGroup` | State object or form-library form |
| `FormArray` | Array state or field array |
| `valueChanges` | `onChange`, watch function, or effect |
| Sync validator | Validation function/schema |
| Async validator | Async validation/query |
| `touched` | Form-library metadata |
| `dirty` | Compare/current metadata |
| `setValue` | State setter/form API |
| `patchValue` | Merge state/form reset API |
| Control Value Accessor | Controlled component contract |
| Angular validation errors | Error object |

Controlled component:

```tsx
function EmailField() {
  const [email, setEmail] = useState('');
  const error =
    email && !email.includes('@') ? 'Enter a valid email' : null;

  return (
    <label>
      Email
      <input
        value={email}
        onChange={event => setEmail(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'email-error' : undefined}
      />
      {error && <span id="email-error">{error}</span>}
    </label>
  );
}
```

For serious forms, React Hook Form plus a schema library is closer to Angular Reactive Forms.

## 12. Routing

React itself has no built-in router.

| Angular Router | React Router / Next.js |
|---|---|
| `Routes` | Route configuration or filesystem routes |
| `routerLink` | `<Link>` |
| `router.navigate()` | `navigate()` / `router.push()` |
| `ActivatedRoute` | Router hooks/route props |
| Route params | `useParams()` or framework props |
| Query params | Search-parameter hook |
| Route guard | Loader/middleware/layout/auth wrapper |
| Resolver | Loader or server component fetching |
| Lazy route | Lazy component or filesystem chunk |
| Child route | Nested route/layout |
| `router-outlet` | `<Outlet />` or layout children |
| `CanDeactivate` | Navigation blocker |
| Route data | Loader data, metadata, or route handle |
| Preloading strategy | Framework/router prefetching |

Angular guard logic does not map cleanly to a React component. Authentication may need enforcement at several boundaries:

- Server/middleware
- Route loader
- API authorization
- UI visibility

Hiding a component is not authorization.

## 13. Component composition

| Angular | React |
|---|---|
| `ng-content` | `children` |
| Named slots | JSX props |
| Structural directive | Component or hook |
| Attribute directive | Props, hook, wrapper component |
| Host binding | Props/class/style |
| Dynamic component outlet | Component variable |
| Component factory | JSX with selected component |
| Container/presentational split | Stateful/custom-hook + UI component |
| Smart/dumb components | Container/presentational components |

```tsx
type CardProps = {
  header: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

function Card({ header, children, footer }: CardProps) {
  return (
    <article>
      <header>{header}</header>
      {children}
      {footer && <footer>{footer}</footer>}
    </article>
  );
}
```

React leans heavily on composition. Often the React replacement for an Angular directive is not another directive—it is a component, prop, or hook.

## 14. Directives and pipes

| Angular | React |
|---|---|
| Component directive | Component |
| Attribute directive | Hook, wrapper, props |
| Structural directive | Conditional JSX/component |
| Custom pipe | Plain function |
| Pure pipe | Function; maybe `useMemo` if expensive |
| Impure pipe | Avoid; explicitly model updates |
| `NgClass` | `className` expression |
| `NgStyle` | `style` object |
| Custom autofocus directive | Ref + effect or callback ref |
| Permission directive | Permission component/hook |

```tsx
function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

<span>{formatCurrency(amount)}</span>
```

## 15. DOM access

| Angular | React |
|---|---|
| `ElementRef` | `useRef<HTMLElement>()` |
| `ViewChild` | `useRef` |
| `ViewChildren` | Ref collection |
| `Renderer2` | Usually declarative JSX; occasionally DOM APIs |
| `HostBinding` | JSX props |
| `HostListener` | JSX event or effect listener |
| After-view lifecycle | Effect/layout effect |

```tsx
const inputRef = useRef<HTMLInputElement>(null);

function focusInput() {
  inputRef.current?.focus();
}

<input ref={inputRef} />
```

Changing a ref does not trigger rendering. [React refs documentation](https://react.dev/learn/referencing-values-with-refs)

## 16. Change detection and rendering

| Angular | React |
|---|---|
| Change-detection pass | Component rerender |
| `OnPush` | Good state placement; sometimes `memo` |
| Signal dependency tracking | State/props/context rerender flow |
| `markForCheck()` | Usually state setter |
| `detectChanges()` | Usually unnecessary |
| Pure pipe optimization | Derivation; occasionally `useMemo` |
| `trackBy` | `key` |
| Zone event detection | React event/state scheduling |
| Zoneless Angular | Still not identical to React rendering |

A React rerender means the component function runs again. It does **not** automatically mean the browser DOM is rebuilt.

Before `memo`:

1. Colocate state.
2. Split the component tree.
3. Pass stable JSX as `children`.
4. Narrow Context.
5. Remove unnecessary effects.
6. Profile.
7. Then consider memoization.

## 17. Memoization

| Angular performance idea | React |
|---|---|
| Pure pipe | `useMemo` for expensive calculation |
| Stable handler not usually considered | `useCallback` |
| OnPush component | `memo`—rough analogy only |
| `trackBy` | Stable `key` |
| Cached service result | Query cache |
| Lazy module | Lazy component/route |

```tsx
const sortedUsers = useMemo(
  () => [...users].sort(compareUsers),
  [users]
);
```

Do not use `useMemo` for correctness. Your code should still work if React recalculates it.

## 18. Shared client state

| Angular | React |
|---|---|
| Service with signals | Context + reducer or external store |
| NgRx Store | Redux Toolkit |
| NgRx ComponentStore | Zustand, reducer, feature store |
| NgRx selectors | Store selectors |
| NgRx effects | Async thunks/listeners/query layer |
| Akita/Elf | Zustand/Jotai/Redux alternatives |
| Shared `BehaviorSubject` | Store or context |
| Local service provider | Local context provider |

Decision ladder:

1. Local `useState`
2. Lift state to nearest common parent
3. `useReducer` for structured transitions
4. Context for broadly required values
5. Query library for server state
6. External store only when complexity justifies it

React officially teaches lifting state, reducer, and Context as the built-in scaling path. [React state-management guide](https://react.dev/learn/managing-state)

## 19. Context

| Angular DI | React Context |
|---|---|
| Provider | `<SomeContext.Provider>` or provider component |
| Injection token | Context object |
| `inject(Token)` | `useContext(SomeContext)` |
| Hierarchical provider | Nested provider |
| Root provider | Provider around app |
| Component provider | Provider around subtree |

But Context is reactive: consumers rerender when its value changes.

Good Context uses:

- Current user/auth information
- Theme
- Locale
- Stable application dependencies
- Feature-scoped reducer state

Poor Context uses:

- Every API response
- Rapidly changing input state
- A replacement for all props
- One giant global object

## 20. Custom hooks

Custom hooks have no exact Angular equivalent. Think of them as a mixture of:

- Injectable service behavior
- Reusable lifecycle logic
- Reactive state composition
- Facade logic

```tsx
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
```

A hook:

- Must begin with `use`
- Can call other hooks
- Reuses logic, not component instances
- Does not render UI itself

## 21. Error handling

| Angular | React |
|---|---|
| Global `ErrorHandler` | Framework boundary/logging integration |
| HTTP interceptor errors | API/query error normalization |
| Template error state | Conditional JSX |
| Route error component | Router/framework error boundary |
| Global error page | Framework error route |
| RxJS `catchError` | `try/catch` or query error handling |
| Component exception | Error boundary |

React error boundaries catch rendering failures below them. They do not replace handling expected API failures in normal state.

## 22. Loading and async UI

| Angular | React |
|---|---|
| `observable$ | async` | Query hook or state |
| `@if (loading)` | Conditional rendering |
| Resolver | Loader/server component |
| Skeleton component | Same component pattern |
| `@defer` | Lazy/Suspense/framework feature |
| HTTP cancellation | `AbortController` or query cancellation |

```tsx
if (isPending) return <Spinner />;
if (error) return <ErrorState onRetry={refetch} />;
if (!data.length) return <EmptyState />;

return <TransactionList transactions={data} />;
```

## 23. Styling

| Angular | React |
|---|---|
| Component stylesheet | CSS module, styled solution, or normal CSS |
| View encapsulation | CSS Modules/CSS-in-JS scoping |
| Global styles | Global CSS |
| `:host` | Wrapper class or component selector |
| `ngClass` | `className` |
| `ngStyle` | `style` |
| Angular Material | MUI, Chakra, Ant Design, etc. |
| CDK | Various focused libraries |

React has no official styling system.

## 24. Testing

| Angular | React |
|---|---|
| TestBed | Usually render directly |
| ComponentFixture | Testing-library render result |
| `fixture.detectChanges()` | Usually automatic through `act`/user event |
| DebugElement query | Testing Library role/label queries |
| Jasmine/Jest | Vitest or Jest |
| Karma | Vitest/Jest browser-like environment |
| Angular Testing Library | React Testing Library |
| `fakeAsync/tick` | Fake timers or async queries |
| Http testing controller | MSW or mocked API layer |
| RouterTestingModule | Memory router/framework utility |
| Cypress/Playwright | Same |
| Harness | User-facing Testing Library queries |

```tsx
render(<Search />);

await user.type(
  screen.getByRole('textbox', { name: /search/i }),
  'credit'
);

expect(screen.getByText('Credit Builder')).toBeVisible();
```

Prefer behavior over implementation details:

- Query by role/label
- Interact like a user
- Assert visible outcomes
- Avoid testing hook calls or internal state

## 25. Accessibility

| Angular | React |
|---|---|
| Native semantic HTML | Same |
| Angular CDK a11y | Browser APIs or focused libraries |
| Property binding for ARIA | Mostly normal ARIA attributes |
| FocusMonitor | Refs/focus utilities |
| LiveAnnouncer | `aria-live` region/library |
| Material accessible defaults | Depends on selected component library |

React-specific gotchas:

- Use `htmlFor`, not `for`.
- Use `className`, not `class`.
- Preserve semantic elements.
- Do not turn every `<div>` into a clickable control.
- Connect validation errors with `aria-describedby`.

## 26. Architecture

| Angular architecture | React architecture |
|---|---|
| Feature module | Feature folder/package |
| Core module | Application infrastructure |
| Shared module | Shared components/utilities |
| Facade service | Feature hook/facade |
| Container component | Stateful component |
| Presentational component | Props-driven UI component |
| Domain service | Plain domain module |
| Repository service | API/data-access module |
| Smart/dumb split | Logic hook/container + UI component |
| Nx library | Same; Nx supports React |
| Micro-frontend remote | React remote/application boundary |

A sensible feature structure:

```text
transactions/
  api/
    get-transactions.ts
  components/
    transaction-list.tsx
    transaction-row.tsx
  hooks/
    use-transactions.ts
  model/
    transaction.ts
  pages/
    transactions-page.tsx
  tests/
```

## 27. Angular patterns you should not carry over blindly

| Angular instinct | Better React instinct |
|---|---|
| Put logic in a service class | Start with plain functions/custom hooks |
| Store every value in state | Derive what can be derived |
| Use effect as `ngOnInit` | Ask what external system is synchronized |
| Add a global service | Keep state local first |
| Subscribe manually | Use query/framework primitives |
| Mutate object then trigger detection | Create a new state value |
| Reproduce directives everywhere | Use composition, props, and hooks |
| Split files by framework artifact | Split around features and responsibilities |
| Mirror every lifecycle hook | Design around renders and effects |
| Reach for memoization early | Fix state placement and boundaries |
| Use DI for every dependency | Import stable functions directly |
| Build custom form framework | Use native forms or a mature library |

## 28. Fast translation examples

### Angular input → React prop

```ts
@Input({ required: true }) user!: User;
```

```tsx
function UserCard({ user }: { user: User }) {}
```

### Angular output → callback prop

```ts
@Output() selected = new EventEmitter<string>();
```

```tsx
function UserCard({
  onSelected,
}: {
  onSelected: (id: string) => void;
}) {}
```

### Angular computed signal → derived render value

```ts
fullName = computed(() =>
  `${this.firstName()} ${this.lastName()}`
);
```

```tsx
const fullName = `${firstName} ${lastName}`;
```

### Angular effect cleanup → React effect cleanup

```tsx
useEffect(() => {
  const controller = new AbortController();

  loadData(controller.signal);

  return () => controller.abort();
}, []);
```

### Angular service → custom hook

```tsx
function useTransactions(accountId: string) {
  const [state, setState] = useState<TransactionState>({
    status: 'loading',
  });

  // Fetch/synchronization logic...

  return state;
}
```

## 29. The React mental model to memorize

When looking at any value, ask:

1. **Does it affect rendering?**
   - No → regular variable or `useRef`
   - Yes → continue

2. **Can it be calculated from props or state?**
   - Yes → calculate during render
   - No → continue

3. **Does only this component need it?**
   - Yes → `useState` or `useReducer`
   - No → lift it to the nearest common parent

4. **Is it server data?**
   - Yes → router/framework/query solution

5. **Does a broad subtree need it?**
   - Yes → Context or external store

6. **Am I synchronizing with something outside React?**
   - Yes → `useEffect`
   - No → you probably do not need an effect

## Best learning order for your interview

Given your Angular background:

1. JSX, props, callbacks, lists, and keys
2. `useState` and derived state
3. Controlled forms
4. Lifting state and component composition
5. `useEffect` plus cleanup
6. API loading/error/empty/success states
7. `useRef`
8. Context and custom hooks
9. React Testing Library
10. Performance and `memo` last

Your biggest risk is not syntax. It is writing **Angular-shaped React**: excessive services, synchronized derived state, effect-heavy lifecycle code, and premature abstraction.
