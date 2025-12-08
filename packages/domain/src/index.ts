// Domain-driven design core exports
// Shared kernel base classes
export * from './shared-kernel/base/Entity';
export * from './shared-kernel/base/AggregateRoot';
export * from './shared-kernel/base/ValueObject';
export * from './shared-kernel/base/DomainEvent';

// Value objects
export * from './shared-kernel/value-objects/Email';
export * from './shared-kernel/value-objects/PhoneNumber';
export * from './shared-kernel/value-objects/Address';
export * from './shared-kernel/value-objects/Money';

// Core entities
export * from './shared-kernel/entities/Customer';
export * from './shared-kernel/entities/User';

// Common types
export * from './shared-kernel/types/common-types';
