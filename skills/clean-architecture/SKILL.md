---
name: clean-architecture
description: Use when designing system architecture, implementing clean architecture principles, structuring code with clear separation of concerns, defining services, business logic, and data layers.
---

# Clean Architecture Patterns

Use this skill when:
- Designing system architecture and data flow
- Implementing separation of concerns
- Defining business logic boundaries
- Structuring multi-layer applications
- Creating dependency inversion principles
- Establishing clear interfaces and contracts
- Organizing microservices or monolith structures

## Core Architecture Principles

### Dependency Rule

**Primary Direction of Dependencies:**
- Dependencies point inward: framework → use cases → entities
- Inner layers define contracts, outer layers implement them
- Inner layers should have no dependencies on outer layers

```
┌─────────────────────────────────────┐
│   Frameworks & Drivers (UI, DB)     │  ← Dependencies INWARD
├─────────────────────────────────────┤
│   Interfaces & Use Cases           │  ← Depends on Entities
├─────────────────────────────────────┤
│   Entity (Business Rules)           │  ← Core business logic
└─────────────────────────────────────┘
```

### Layered Architecture

**Presentation/Driver Layer:**
```javascript
// Controllers or UI components
class UserController {
  async getProfile(userId) {
    const user = await userService.getUserById(userId);
    return {
      id: user.id,
      email: user.email,
      profile: user.profile
    };
  }

  async createPost(userId, postData) {
    const post = await postService.createPost(userId, postData);
    return post;
  }
}
```

**Use Case/Interface Layer:**
```javascript
// Business logic orchestration
class CreatePostUseCase {
  constructor(postRepository, userValidation, notificationService) {
    this.postRepository = postRepository;
    this.userValidation = userValidation;
    this.notificationService = notificationService;
  }

  async execute(userId, postData) {
    // Validate user
    await this.userValidation.validate(userId);

    // Create post
    const post = await this.postRepository.create({
      userId,
      title: postData.title,
      content: postData.content,
      createdAt: new Date()
    });

    // Send notifications
    await this.notificationService.notifyPostCreated(userId, post.id);

    return post;
  }
}
```

**Entity/Domain Layer:**
```javascript
// Pure business logic models
class Post {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.title = data.title;
    this.content = data.content;
    this.createdAt = data.createdAt;
    this.published = data.published || false;
  }

  publish() {
    if (this.createdAt < new Date(Date.now() - 86400000)) {
      throw new Error('Cannot publish posts older than 24 hours');
    }
    this.published = true;
  }

  containsSensitiveInfo() {
    return this.content.includes('password') ||
           this.content.includes('apiKey') ||
           this.content.includes('secret');
  }
}

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.username = data.username;
    this.avatar = data.avatar;
    this.role = data.role;
  }

  isAdministrator() {
    return this.role === 'ADMIN';
  }

  canPublishPost() {
    return this.role === 'ADMIN' || this.role === 'MODERATOR';
  }

  isEmailVerified() {
    return this.emailVerified !== false;
  }
}
```

**Repository/Port Layer:**
```javascript
// Database interfaces or repositories
class PostRepositoryInterface {
  findById(id);
  findByUserId(userId);
  create(data);
  update(id, data);
  delete(id);
}

class UserRepositoryInterface {
  findById(id);
  findByEmail(email);
  create(data);
  update(id, data);
  delete(id);
}
```

### Dependency Inversion

**Abstract Interfaces:**
```javascript
// Define interfaces before concrete implementations
interface IEventPublisher {
  publish(eventName: string, any): Promise<void>;
}

interface INotificationService {
  sendEmail(to: string, subject: string, template: string): Promise<void>;
  sendSMS(phone: string, message: string): Promise<void>;
}

// Later implementations
class EmailNotificationService implements INotificationService {
  async sendEmail(to, subject, template) {
    // Database storage and email logic
  }

  async sendSMS(phone, message) {
    // SMS service integration
  }
}

class EventBusPublisher implements IEventPublisher {
  async publish(eventName, data) {
    // Redis or Kafka event publishing
  }
}
```

### DDD (Domain-Driven Design) Patterns

**Value Objects:**
```javascript
class Money {
  constructor(amount, currency) {
    if (amount < 0) throw new Error('Amount cannot be negative');
    this.amount = amount;
    this.currency = currency;
  }

  add(other) {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  isGreaterThan(other) {
    return this.amount > other.amount;
  }
}

class UniqueIdentifier {
  constructor(value) {
    this.value = this.validate(value);
  }

  validate(value) {
    if (!value || typeof value !== 'string') {
      throw new Error('Invalid ID format');
    }
    return value;
  }
}
```

**Aggregates:**
```javascript
class Order {
  constructor(customer, items) {
    this.id = new UniqueIdentifier(generateId());
    this.customer = customer;
    this.items = new Map(items.map(item => [item.id, item]));
    this.orderDate = new Date();
    this.status = 'PENDING';
  }

  addItem(productId, quantity) {
    const existingItem = this.items.get(productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.set(productId, { productId, quantity });
    }
  }

  calculateTotal() {
    let total = 0;
    this.items.forEach(item => {
      total += item.price * item.quantity;
    });
    return new Money(total, 'USD');
  }

  canCancel() {
    return this.status === 'PENDING';
  }

  cancel() {
    if (!this.canCancel()) {
      throw new Error('Order cannot be cancelled');
    }
    this.status = 'CANCELLED';
  }
}
```

### Clean Microservices Architecture

**Service Boundary Definition:**
```javascript
// User Service
class UserService {
  // User-specific business logic
}

// Order Service
class OrderService {
  // Order-specific business logic
}

// Payment Service
class PaymentService {
  // Payment processing logic
}

// Service Orchestration
class OrderPaymentWorkflow {
  async processOrder(order) {
    // Validate order
    // Process payment
    // Update inventory
    // Send notifications
  }
}
```

### API Layer Design

**RESTful Resource Design:**
```javascript
// GET /api/v1/users
// GET /api/v1/users/:id
// POST /api/v1/users
// PUT /api/v1/users/:id
// DELETE /api/v1/users/:id

// GET /api/v1/orders
// GET /api/v1/orders/:id
// POST /api/v1/orders
// PUT /api/v1/orders/:id/pay
// DELETE /api/v1/orders/:id
```

**GraphQL API Structure:**
```typescript
interface User {
  id: ID!
  email: String!
  profile: UserProfile
}

type Query {
  user(id: ID!): User
  users: [User!]!
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
}
```

### Event-Driven Architecture

**Event Chronicle:**
```javascript
class UserCreatedEvent {
  constructor(userId, email, username) {
    this.type = 'user.created';
    this.userId = userId;
    this.email = email;
    this.username = username;
    this.occurredAt = new Date();
  }
}

class OrderCreatedEvent {
  constructor(orderId, customerId, total) {
    this.type = 'order.created';
    this.orderId = orderId;
    this.customerId = customerId;
    this.total = total;
    this.occurredAt = new Date();
  }
}

class EventBus {
  async publish(event) {
    const subscribers = this.subscribers[event.type];
    if (subscribers) {
      await Promise.all(subscribers.map(fn => fn(event)));
    }
  }

  subscribe(eventType, handler) {
    if (!this.subscribers[eventType]) {
      this.subscribers[eventType] = [];
    }
    this.subscribers[eventType].push(handler);
  }
}
```

### Modular Monolith Architecture

**Feature-Based Modules:**
```
src/
├── core/                    # Shared core modules
│   ├── entities/
│   ├── use-cases/
│   └── repositories/
├── features/
│   ├── auth/
│   │   ├── domain/
│   │   ├── use-cases/
│   │   └── interfaces/
│   ├── users/
│   │   ├── domain/
│   │   ├── use-cases/
│   │   └── interfaces/
│   └── orders/
│       ├── domain/
│       ├── use-cases/
│       └── interfaces/
└── infrastructure/
    ├── database/
    ├── services/
    └── external/
```

### Clean Service Patterns

**Service Implementation Structure:**
```javascript
class UserService {
  constructor(userRepository, validator, emailService) {
    this.userRepository = userRepository;
    this.validator = validator;
    this.emailService = emailService;
  }

  // Public API methods
  async createUser(userData) {
    this.validator.validate(userData);
    const user = await this.userRepository.create(userData);
    await this.emailService.sendWelcome(user.email);
    return user;
  }

  // Validation helper
  validate(data) {
    if (!this.validator.email(data.email)) {
      throw new Error('Invalid email address');
    }
    if (data.password.length < 8) {
      throw new Error('Password too short');
    }
  }
}
```

### Repository Pattern

**Repository Implementation:**
```javascript
class UserMapper {
  mapToEntity(data) {
    return new User({
      id: data.id,
      email: data.email,
      username: data.username,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    });
  }

  mapToDatabase(entity) {
    return {
      id: entity.id,
      email: entity.email,
      username: entity.username,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt
    };
  }
}

class UserRepository {
  constructor(db, mapper) {
    this.db = db;
    this.mapper = mapper;
  }

  findById(id) {
    return this.db.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    ).then(results => results.length > 0 ? this.mapper.mapToEntity(results[0]) : null);
  }

  create(data) {
    const entity = new User(data);
    return this.db.query(
      'INSERT INTO users (email, username, created_at) VALUES (?, ?, NOW())',
      [entity.email, entity.username]
    ).then(insertId => this.findById(insertId));
  }
}
```

### Best Practices

**Architecture Rules:**
- Keep business logic in domain/entities layer
- Define clear interfaces for all external dependencies
- Prune dependencies - inner layers should not depend on outer layers
- Use dependency injection for cleaner testing
- Document all public interfaces
- Separation of concerns - each layer should have a single responsibility

**DDD Guidelines:**
- Define bounded contexts for different business areas
- Create rich domain models with business logic
- Identify aggregates and entities properly
- Use value objects for complex values
- Implement repository interfaces for data access

**Testing Strategy:**
- Test business logic with unit tests (domain layer)
- Test data access with integration tests (repository layer)
- Test orchestration with integration tests (use case layer)
- Mock external dependencies for cleaner unit tests
- Test API contracts thoroughly

**Documentation Requirements:**
- Document all public interfaces in JSDoc/Monkdoc
- Include usage examples for complex patterns
- Describe dependency rules clearly
- Document data flow between layers
- Maintain architecture diagrams for complex systems
**