---
name: senior-developer-standard
description: Use when implementing production-ready code, applying industry best practices, ensuring code quality standards, following architectural patterns, writing maintainable code, and following clean development practices. Reference this skill when any professional coding standards are needed.
---

# Senior Developer Standard: Production-Ready Code Guide

Use this skill when:
- Implementing production-grade applications
- Writing maintainable and scalable code
- Applying industry best practices
- Ensuring code quality and consistency
- Designing robust systems
- Guiding team code reviews
- Setting coding standards
- Creating reference implementations

## Code Quality Standards

### Naming Conventions

**Variables and Functions:**
```javascript
// GOOD - Descriptive, camelCase
const userFirstName = 'John';
const calculateTotalPrice = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// BAD - Abbreviations, unclear names
const fn = (i) => i.reduce((s, x) => s + x.p, 0);
const userdata = { fnm: 'John', age: 30 };
```

**Classes and Interfaces:**
```javascript
// GOOD - PascalCase for classes
class UserProfileManager {}
class PaymentProcessor {}

// GOOD - PascalCase with clear names
interface AuthenticationHandler {}
interface IPaymentGateway {}
```

**Constants:**
```javascript
// GOOD - UPPER_SNAKE_CASE for constants
const MAX_RETRY_COUNT = 3;
const DEFAULT_TIMEOUT_MS = 5000;
const API_BASE_URL = 'https://api.example.com';

// BAD - CamelCase
const maxRetryCount = 3;
const defaultTimeoutMs = 5000;
```

### Error Handling

**Structured Error Handling:**
```javascript
// GOOD - Custom error classes with proper messages
class ValidationError extends Error {
  constructor(message, field, value) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }
}

class NetworkError extends Error {
  constructor(message, statusCode, originalError = null) {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

// GOOD - Try-catch with proper error types
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new NetworkError(
        'Failed to fetch data',
        response.status
      );
    }
    return response.json();
  } catch (error) {
    if (error instanceof NetworkError) {
      throw error;
    }
    throw new NetworkError('Unknown error', 500, error);
  }
}

// GOOD - Error classification
function handleError(error) {
  const errorCategories = {
    network: NetworkError,
    validation: ValidationError,
    business: BusinessLogicError
  };

  for (const [category, Class] of Object.entries(errorCategories)) {
    if (error instanceof Class) {
      // Log separate category
      logError(category, error);
      return error;
    }
  }

  // Default to unknown
  logError('unknown', error);
  throw new UnknownError('An unexpected error occurred');
}
```

**Error Boundary Components:**
```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>Something went wrong</h1>
          <p>{this.state.error.message}</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### Component Design Patterns

**React Functional Components:**
```javascript
// GOOD - Proper imports, clear component structure
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../hooks/useAuth';
import { fetchData as fetchUserData } from '../services/userService';

const UserProfile = ({ userId, editable }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    let mounted = true;

    async function loadUserData() {
      try {
        setLoading(true);
        const data = await fetchUserData(userId);
        if (mounted) {
          setUser(data);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      }
    }

    loadUserData();

    return () => {
      mounted = false;
    };
  }, [userId]);

  const handleUpdate = useCallback(async (updates) => {
    try {
      const updatedData = await updateUserService(userId, updates);
      setUser(updatedData);
      showSuccessToast('Profile updated successfully');
    } catch (error) {
      showErrorToast('Failed to update profile');
      logError(error);
    }
  }, [userId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <EmptyState />;

  return (
    <UserEditForm
      user={user}
      onSave={handleUpdate}
      editable={editable && currentUser.id === userId}
    />
  );
};

UserProfile.propTypes = {
  userId: PropTypes.number.isRequired,
  editable: PropTypes.bool
};

// GOOD - Custom hooks for reuse
function useUserProfile(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const data = await fetchUserData(userId);
        setUser(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    if (userId) fetchUser();
  }, [userId]);

  return { user, loading, error, refetch: () => fetchUser(userId) };
}
```

### API Integration Patterns

**REST API Client:**
```javascript
class ApiClient {
  constructor(baseUrl, options = {}) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    this.timeout = options.timeout || 5000;
  }

  async get(endpoint, params = {}) {
    const queryString = this.buildQueryString(params);
    const url = `${this.baseUrl}${endpoint}${queryString}`;

    return this.request('GET', url);
  }

  async post(endpoint, body = {}, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    return this.request('POST', url, body, options);
  }

  async put(endpoint, body = {}, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    return this.request('PUT', url, body, options);
  }

  async delete(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    return this.request('DELETE', url, null, options);
  }

  async request(method, url, body = null, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: this.defaultHeaders,
        body: body ? JSON.stringify(body) : null,
        signal: options.signal || controller.signal,
        ...options
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw await this.handleError(response);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw this.handleError(error);
    }
  }

  handleError(response) {
    return new ApiError(
      response.statusText,
      response.status,
      await response.json()
    );
  }

  buildQueryString(params) {
    return Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }
}

class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Usage
const api = new ApiClient('https://api.example.com');
const users = await api.get('/users', { page: 1, limit: 10 });
```

### State Management

**Redux State Management:**
```javascript
// Actions
const USERActions = {
  FETCH_USER_START: 'USER/FETCH_USER_START',
  FETCH_USER_SUCCESS: 'USER/FETCH_USER_SUCCESS',
  FETCH_USER_FAILURE: 'USER/FETCH_USER_FAILURE',
  UPDATE_USER_START: 'USER/UPDATE_USER_START',
  UPDATE_USER_SUCCESS: 'USER/UPDATE_USER_SUCCESS'
};

function fetchUser(userId) {
  return async (dispatch) => {
    dispatch({ type: USERActions.FETCH_USER_START });
    try {
      const userData = await apiClient.get(`/users/${userId}`);
      dispatch({ 
        type: USERActions.FETCH_USER_SUCCESS, 
        payload: userData 
      });
    } catch (error) {
      dispatch({ 
        type: USERActions.FETCH_USER_FAILURE, 
        payload: error 
      });
    }
  };
}

// Reducer
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USERActions.FETCH_USER_START:
      return { ...state, loading: true };
    case USERActions.FETCH_USER_SUCCESS:
      return { ...state, loading: false, action.payload };
    case USERActions.FETCH_USER_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// React-Redux Integration
function UserProfile() {
  const { data, loading, error } = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser(userId));
  }, [dispatch, userId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <UserDisplay user={data} />;
}
```

### Database Patterns

**TypeORM Repository Pattern:**
```typescript
@Entity('users')
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  profile: JsonType;
}

@Entity('posts')
class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date;
}

// Repository Service
@Injectable()
class UserRepository {
  constructor(private dataSource: DataSource) {}

  async findById(id: number): Promise<User | null> {
    const repository = this.dataSource.getRepository(User);
    return repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    const repository = this.dataSource.getRepository(User);
    return repository.findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const repository = this.dataSource.getRepository(User);
    const user = repository.create(userData);
    return repository.save(user);
  }

  async update(id: number, updates: Partial<User>): Promise<User> {
    const repository = this.dataSource.getRepository(User);
    await repository.update(id, updates);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    const repository = this.dataSource.getRepository(User);
    await repository.delete(id);
  }
}
```

### Testing Standards

**Unit Testing with Jest:**
```javascript
// GOOD - Test file naming and structure
describe('UserService', () => {
  describe('createUser', () => {
    const mockRepository = createMockRepository();
    const service = new UserService(mockRepository);

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should create a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser'
      };
      const createdUser = { id: 1, ...userData };

      mockRepository.create.mockResolvedValueOnce(createdUser);

      const result = await service.createUser(userData);

      expect(mockRepository.create).toHaveBeenCalledWith(userData);
      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        username: 'testuser'
      });
    });

    test('should validate email format', async () => {
      const userData = {
        email: 'invalid-email',
        username: 'testuser'
      };

      await expect(service.createUser(userData)).rejects.toThrow(
        'Invalid email format'
      );
    });
  });
});
```

**Integration Testing:**
```javascript
describe('UserController', () => {
  let mockUserService;
  let request;
  let app;

  beforeEach(async () => {
    mockUserService = createMockUserService();
    app = createTestApp({
      userService: mockUserService
    });
    request = createSupertest(app);
  });

  test('POST /api/users should create a new user', async () => {
    const newUser = {
      email: 'test@example.com',
      username: 'testuser'
    };

    mockUserService.createUser.mockResolvedValueOnce({
      id: 1,
      ...newUser
    });

    const response = await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(201);

    expect(response.body).toEqual({
      id: 1,
      email: 'test@example.com',
      username: 'testuser'
    });
  });

  test('POST /api/users should return 400 for invalid email', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'invalid',
        username: 'user'
      })
      .expect(400);

    expect(response.body.error).toContain('Invalid email');
  });
});
```

### Code Documentation

**JSDoc Standards:**
```javascript
/**
 * Calculates the total price of items in an order
 * @param {Array<{quantity: number, price: number}>} items - Array of item objects
 * @returns {number} The total price of all items
 * @throws {Error} If any quantity is negative
 * @example
 * const total = calculateOrderTotal([
 *   { quantity: 2, price: 19.99 },
 *   { quantity: 1, price: 9.99 }
 * ]);
 * // Returns 49.97
 */
function calculateOrderTotal(items) {
  if (items.some(item => item.quantity < 0)) {
    throw new Error('Quantity cannot be negative');
  }

  return items.reduce((total, item) => {
    return total + (item.quantity * item.price);
  }, 0);
}

/**
 * Async function to fetch user data with error handling
 * @param {number} userId - The ID of the user to fetch
 * @param {Object} [options] - Optional fetch options
 * @param {number} [options.timeout=5000] - Request timeout in milliseconds
 * @param {boolean} [options.useCache=true] - Whether to use cached data
 * @returns {Promise<User>} User object with profile data
 * @async
 * @throws {NetworkError} If the request fails
 */
async function getUserById(userId, options = {}) {
  const {
    timeout = 5000,
    useCache = true
  } = options;

  // Implementation
}
```

### Security Best Practices

**Input Validation:**
```javascript
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateUserCreation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address'),

  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .withMessage('Password must contain at least 8 characters with letters and numbers'),

  body('username')
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-20 alphanumeric characters with underscores'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Usage in route
router.post('/users',
  validateUserCreation,
  authMiddleware,
  userController.createUser
);
```

**Password Hashing:**
```javascript
const crypto = require('crypto');

const SALT_ROUNDS = 12;

async function hashPassword(password) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, process.env.SALT, SALT_ROUNDS, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString('hex'));
    });
  });
}

async function verifyPassword(password, hashedPassword) {
  const hash = await hashPassword(password);
  return hash === hashedPassword;
}

// Usage
async function createUser(userData) {
  const hashedPassword = await hashPassword(userData.password);
  const user = await userRepository.create({
    ...userData,
    password: hashedPassword
  });
  return user;
}
```

### Performance Monitoring

**Logging Strategy:**
```javascript
class Logger {
  constructor() {
    this.logger = {
      trace: console.trace.bind(console),
      debug: console.debug.bind(console),
      info: console.info.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console)
    };
  }

  async logTransaction(transactionId, action, data, duration) {
    await this.logger.info('Transaction completed', {
      transactionId,
      action,
      this.sanitizeData(data),
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
  }

  logPerformanceMetric(metricName, value, metadata = {}) {
    this.logger.info('Performance metric', {
      metric: metricName,
      value,
      ...metadata,
      timestamp: new Date().toISOString()
    });
  }

  sanitizeData(data) {
    if (typeof data !== 'object') return data;
    return {
      ...data,
      password: '[REDACTED]',
      token: '[REDACTED]'
    };
  }
}

// Usage
async function fetchDataWithLogging(id) {
  const logger = new Logger();
  const transactionId = generateTransactionId();
  const startTime = Date.now();

  try {
    const result = await fetchData(id);
    await logger.logTransaction(transactionId, 'fetch_success', { id }, Date.now() - startTime);
    return result;
  } catch (error) {
    await logger.logTransaction(transactionId, 'fetch_failure', { id, error: error.message }, Date.now() - startTime);
    throw error;
  }
}
```

### Configuration Management

**Environment-based Configuration:**
```javascript
class Configuration {
  constructor() {
    this.config = {
      environment: process.env.NODE_ENV || 'development',
      database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 5432,
        database: process.env.DB_NAME || 'myapp',
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        ssl: process.env.DB_SSL !== 'false'
      },
      api: {
        baseUrl: process.env.API_BASE_URL || 'https://api.example.com',
        timeout: parseInt(process.env.API_TIMEOUT) || 5000
      },
      security: {
        jwtSecret: process.env.JWT_SECRET,
        saltRounds: parseInt(process.env.SALT_ROUNDS) || 12
      }
    };

    this.validateConfiguration();
  }

  validateConfiguration() {
    const required = {
      development: ['DB_HOST', 'DB_NAME', 'DB_USER', 'JWT_SECRET'],
      production: ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'JWT_SECRET'],
      test: ['DB_HOST', 'DB_NAME', 'DB_USER', 'JWT_SECRET']
    };

    const env = this.config.environment;
    if (!required[env]) throw new Error(`Invalid environment: ${env}`);

    required[env].forEach(envVar => {
      if (process.env[envVar] === undefined) {
        throw new Error(`Missing required environment variable: ${envVar}`);
      }
    });
  }
}

const config = new Configuration();
```

### Professional Development Workflow

**Git Workflow:**
```bash
# Branch naming convention
feature/user-authentication
bugfix/password-reset-hook
hotfix/security-patch-2023
release/v1.0.0

# Commit message format
type(scope): subject

type: feat, fix, docs, style, refactor, test, chore
scope: user, payment, api, etc.

# Example commit messages
feat(auth): implement JWT token refresh
fix(api): resolve race condition in async operations
docs(readme): add installation instructions
test(user): add unit tests for user service
```

### Final Best Practices Checklist

**Quality Gates:**
- [ ] All tests passing (unit, integration, E2E)
- [ ] Code coverage > 80% for business logic
- [ ] Static analysis tools passing (ESLint, Prettier)
- [ ] No console.log or debug statements in production
- [ ] Proper error handling and logging
- [ ] Security vulnerabilities addressed
- [ ] Documentation updated
- [ ] Performance benchmarks acceptable
- [ ] Dependencies updated and security checked
- [ ] Code review completed

**Code Complete Requirements:**
- [ ] Function names describe intent, not implementation
- [ ] Functions have single responsibility
- [ ] No magic numbers, use constants
- [ ] Comments explain why, not what
- [ ] Input validation at boundaries
- [ ] Output is properly typed/specified
- [ ] State mutation is explicit
- [ ] Error paths are handled explicitly
- [ ] Async operations properly awaited
- [ ] Resource cleanup implemented

**Production Readiness:**
- [ ] Environment variables properly configured
- [ ] Secrets management in place
- [ ] graceful degradation handled
- [ ] Rate limiting implemented
- [ ] Security headers set
- [ ] Monitoring and logging configured
- [ ] Backup/rollback strategy documented
- [ ] Load testing completed
- [ ] Disaster recovery tested
- [ ] Documentation complete
**