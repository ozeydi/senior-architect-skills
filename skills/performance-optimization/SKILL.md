---
name: performance-optimization
description: Use when reviewing code for performance bottlenecks, implementing optimization patterns, code profiling, caching strategies, and reducing time complexity.
---

# Performance Optimization Patterns

Use this skill when:
- Reviewing application performance
- Implementing optimization strategies
- Refactoring inefficient code
- Designing caching mechanisms
- Optimizing database queries
- Reducing memory consumption
- Improving computational efficiency
- Analyzing time complexity

## Code Optimization Patterns

### Array & Collection Operations

**Avoid Repeated Operations in Loops:**
```javascript
// BAD - O(n²) complexity
for (let i = 0; i < items.length; i++) {
  for (let j = 0; j < items.length; j++) {
    // operation - repeated access
  }
}

// GOOD - O(n) complexity
const len = items.length;
for (let i = 0; i < len; i++) {
  // operation - single access
}
```

**Use appropriate collection types:**
- Use Set for O(1) membership lookup
- Use Object/Set for deduplication
- Consider Map for structured data with keys beyond strings
- Prefer arrays for ordered sequential access

### Caching Strategies

**Memoization Pattern:**
```javascript
// Cache function results
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = args.join(',');
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Use for expensive computations
const expensiveCalculation = memoize((a, b) => {
  // expensive work
  return a + b;
});
```

**In-Memory Caching:**
```javascript
const cache = new Map();

function getProduct(productId) {
  if (cache.has(productId)) {
    return cache.get(productId);
  }
  const data = db.query('SELECT * FROM products WHERE id = ?', [productId]);
  cache.set(productId, data);
  return data;
}
```

**Cache Invalidation:**
```javascript
function invalidateCache(productId) {
  cache.delete(productId);
}

function invalidateAllCache() {
  cache.clear();
}
```

### Database Optimization

**Query Optimization:**
```javascript
// BAD - N+1 query problem
const users = await db.query('SELECT * FROM users');
for (const user of users) {
  const orders = await db.query('SELECT * FROM orders WHERE user_id = ?', [user.id]);
}

// GOOD - Single query with JOIN
const usersWithOrders = await db.query(
  'SELECT users.*, orders.* FROM users LEFT JOIN orders ON users.id = orders.user_id'
);
```

**Index Usage:**
```sql
-- Create indexed columns for frequently filtered/ordered columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);
CREATE INDEX idx_product_category ON products(category_id);

-- Use indexed columns in WHERE clauses
SELECT * FROM orders WHERE user_id = 123 AND created_at > '2024-01-01';
```

**Connection Pooling:**
```javascript
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydb'
});
```

### Memory Management

**Use Efficient Data Structures:**
```javascript
// BAD - String concatenation in loops
let result = '';
for (let i = 0; i < 1000; i++) {
  result += i + ','; // Creates new strings each iteration
}

// GOOD - Array and join
const result = Array.from({ length: 1000 }, (_, i) => i).join(',');

// GOOD - Buffer for binary data
const buffer = Buffer.alloc(1024);
buffer.write(stringData);
```

**Lazy Loading:**
```javascript
// BAD - Loading everything
const allPosts = await db.query('SELECT * FROM posts');

// GOOD - Lazy loading
async function getPost(id) {
  return db.query('SELECT * FROM posts WHERE id = ?', [id]);
}

async function getPostWithComments(id) {
  const post = await getPost(id);
  post.comments = await db.query('SELECT * FROM comments WHERE post_id = ?', [id]);
  return post;
}
```

### Async Juggling

**Parallel vs Sequential Execution:**
```javascript
// BAD - Sequential execution
const user1 = await fetchUser(1);
const user2 = await fetchUser(2);
const user3 = await fetchUser(3);

// GOOD - Parallel execution
const [user1, user2, user3] = await Promise.all([
  fetchUser(1),
  fetchUser(2),
  fetchUser(3)
]);

// GOOD - Race conditions (first complete)
const result = await Promise.race([
  fastApiCall(),
  slowApiCall()
]);
```

**Error Handling in Parallel:**
```javascript
const results = await Promise.allSettled([
  fetchUser(1),
  fetchUser(2),
  fetchUser(3)
]);

const successes = results.filter(r => r.status === 'fulfilled');
const failures = results.filter(r => r.status === 'rejected');
```

### Computation Optimization

**Pre-calculate Values:**
```javascript
// BAD - Repeated calculation
function calculateDistance(point1, point2) {
  const dx = point1.x - point2.x;
  return Math.sqrt(dx * dx);
}

// GOOD - Cache common values
const distanceCache = new Map();

function getDistance(point1, point2) {
  const key = `${point1.x},${point1.y}`;
  if (!distanceCache.has(key)) {
    const dx = point1.x - point2.x;
    distanceCache.set(key, Math.sqrt(dx * dx));
  }
  return distanceCache.get(key);
}
```

**Algorithm Optimization:**
```javascript
// BAD - O(n²) for finding unique pairs
function findDuplicates(arr) {
  const duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
}

// GOOD - O(n) with Set
function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();
  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }
  return Array.from(duplicates);
}
```

### Caching Layer Optimization

**Multi-Level Caching:**
```javascript
const level1Cache = new Map(); // In-memory
const level2Cache = new Map(); // Local storage
const level3Cache = fetcher;    // Original data source

async function getData(id) {
  if (level1Cache.has(id)) {
    return level1Cache.get(id);
  }
  if (level2Cache.has(id)) {
    const data = level2Cache.get(id);
    level1Cache.set(id, data);
    return data;
  }
  const data = await level3Cache(id);
  level2Cache.set(id, data);
  level1Cache.set(id, data);
  return data;
}
```

**TTL Caching:**
```javascript
const cache = new Map();
async function getCachedData(id, ttl = 60000, fetchData) {
  const now = Date.now();
  if (cache.has(id)) {
    const { data, timestamp } = cache.get(id);
    if (now - timestamp < ttl) {
      return data;
    }
  }
  const data = await fetchData(id);
  cache.set(id, { data, timestamp: now });
  return data;
}
```

### Web Performance

**Image Optimization:**
```javascript
// Serve different sizes based on screen
function getImageUrl(productId, width, height) {
  const isMobile = window.innerWidth < 768;
  const size = isMobile ? 'mobile' : 'desktop';
  return `/images/products/${productId}/${size}@${width}x${height}.jpg`;
}
```

**Lazy Loading Images:**
```html
<img 
  src="placeholder.jpg" 
  data-src="actual-image.jpg" 
  loading="lazy" 
  class="lazy-image"
/>

<script>
function lazyLoadImages() {
  document.querySelectorAll('.lazy-image').forEach(img => {
    if (img.getBoundingClientRect().top < window.innerHeight) {
      img.src = img.dataset.src;
      img.classList.remove('lazy-image');
    }
  });
}

window.addEventListener('scroll', lazyLoadImages);
lazyLoadImages();
</script>
```

### React/Vue Performance

**Memoization:**
```javascript
// React
const expensiveComponent = React.memo((props) => {
  return <div>{computeExpensiveValue(props)}</div>;
});

// Vue
const expensiveComponent = Vue.memo(() => {
  return `<div>${computeExpensiveValue(props)}</div>`;
});
```

**Optimizing State Updates:**
```javascript
// BAD - Multiple re-renders
setState({ user: userData });
setState({ user: userData }); // Re-render

// GOOD - Single update
setState({ user: userData });
```

### Best Practices

**Performance Checklist:**
- Analyze and minimize time complexity (aim for O(n) or better)
- Use proper indexing for database queries
- Implement caching layers for frequently accessed data
- Optimize data structures for your use case
- Use lazy loading for large datasets
- Avoid blocking operations in event loops
- Minimize unnecessary re-renders/computations
- Use async functions to prevent blocking
- Profile heavy operations with console.time/cpu.profile
- Consider Web Workers for CPU-intensive tasks

**Measurement Guidelines:**
- A function with < 16ms is optimal for UI
- Database queries should complete within < 100ms
- Cache hits should be handled in < 10ms
- Function call overhead should be minimized

**Common Anti-Patterns:**
- Looping over arrays instead of using Set/Map
- String concatenation within loops
- Multiple database queries in loops
- Repeated calculations
- Blocking operations in event-driven code
- Inefficient data structures
- Premature optimization without profiling
**