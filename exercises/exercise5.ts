import { logError } from "./logger.js"

//============================================================================
// EXERCISE 5: The Identity Crisis - Order IDs
//
// ANTI-PATTERN: Using a plain `string` for an identifier. Nothing enforces
// format, non-emptiness, or uniqueness. Duplicate and empty IDs slip through.
//
// DDD FIX: Model identity as a dedicated Value Object with a controlled
// creation strategy. In DDD, the identity of an Entity is a first-class
// concept -- it deserves its own type.
//
// HINT - Branded type + factory:
//   type OrderId = string & { readonly __brand: unique symbol }
//
//   // Option A: Enforce a format (e.g., "ORD-" prefix + numeric)
//   function createOrderId(raw: string): OrderId {
//       if (!/^ORD-\d{5,}$/.test(raw))
//           throw new Error("OrderId must match ORD-XXXXX format")
//       return raw as OrderId
//   }
//
//   // Option B: Generate guaranteed-unique IDs (UUID-based)
//   function generateOrderId(): OrderId {
//       return `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` as OrderId
//   }
//
// For uniqueness across a collection, use a Repository pattern: the
// Repository is responsible for ensuring no two Entities share an ID.
// This separates identity validation (Value Object) from uniqueness
// enforcement (Repository).
//============================================================================

// Branded type for OrderId
type OrderId = string & { readonly __brand: unique symbol }

// Factory to enforce a consistent format
function createOrderId(raw: string): OrderId {
	if (!/^ORD-\d{5,}$/.test(raw))
		throw new Error("OrderId must match ORD-XXXXX format")
	return raw as OrderId
}

// Optional: generate a unique OrderId automatically
function generateOrderId(): OrderId {
	return `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` as OrderId
}

export function exercise5_IdentityCrisis() {
	type Order = {
		orderId: OrderId
		customerName: string
		total: number
	}

	// Correctly use createOrderId() to enforce format
	const orders: Order[] = [
		{
			orderId: createOrderId("ORD-10001"),
			customerName: "Alice",
			total: 25,
		},
		{
			orderId: createOrderId("ORD-10002"),
			customerName: "Bob",
			total: 30,
		},
		{
			orderId: createOrderId("ORD-10003"),
			customerName: "Charlie",
			total: 15,
		},
		{
			orderId: createOrderId("ORD-10004"),
			customerName: "Diana",
			total: 20,
		},
	]

	logError(5, "Order IDs validated with branded type", {
		orders,
	})
}