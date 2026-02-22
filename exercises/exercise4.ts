import { logError } from "./logger.js"

//============================================================================
// EXERCISE 4: Business Rule Violation - Table Capacity
//
// ANTI-PATTERN: Using a plain data structure (anemic type) with no
// invariant enforcement. Nothing prevents currentGuests > capacity or
// negative guest counts. The type is just a bag of numbers.
//
// DDD FIX: Use an Entity with enforced invariants.
// Unlike Value Objects (which are defined by their value), an Entity has
// a unique identity (tableNumber) and a lifecycle. Invariants (business
// rules that must ALWAYS be true) are enforced in the constructor and
// in every method that mutates state.
//
// HINT - Entity with private constructor:
//   class Table {
//       private constructor(
//           public readonly tableNumber: number,
//           public readonly capacity: number,
//           private _currentGuests: number,
//       ) {}
//
//       static create(tableNumber: number, capacity: number): Table {
//           if (capacity <= 0) throw new Error("Capacity must be positive")
//           return new Table(tableNumber, capacity, 0)
//       }
//
//       get currentGuests(): number { return this._currentGuests }
//
//       seatGuests(count: number): void {
//           if (count <= 0) throw new Error("Guest count must be positive")
//           if (this._currentGuests + count > this.capacity)
//               throw new Error("Exceeds table capacity")
//           this._currentGuests += count
//       }
//   }
//
// KEY INSIGHT: The invariant (guests <= capacity) is enforced by the Entity
// itself. External code cannot put the Entity into an invalid state because
// there is no public way to set _currentGuests directly.
//============================================================================

class Table {
	private _currentGuests: number

	private constructor(
		public readonly tableNumber: number,
		public readonly capacity: number,
	) {
		this._currentGuests = 0
	}

	static create(tableNumber: number, capacity: number): Table {
		if (capacity <= 0) throw new Error("Capacity must be positive")
		return new Table(tableNumber, capacity)
	}

	get currentGuests(): number {
		return this._currentGuests
	}

	seatGuests(count: number): void {
		if (count <= 0) throw new Error("Guest count must be positive")
		if (this._currentGuests + count > this.capacity)
			throw new Error("Exceeds table capacity")
		this._currentGuests += count
	}

	removeGuests(count: number): void {
		if (count <= 0) throw new Error("Must remove positive number of guests")
		if (this._currentGuests - count < 0) throw new Error("Cannot have negative guests")
		this._currentGuests -= count
	}
}

export function exercise4_BusinessRuleViolation() {
	const table = Table.create(5, 4)
	try {
		table.seatGuests(3)
		table.seatGuests(2)
	} catch (err) {
		logError(4, "Table overcapacity prevented by Entity", { error: err })
	}

	const emptyTable = Table.create(3, 6)
	try {
		emptyTable.removeGuests(1)
	} catch (err) {
		logError(4, "Negative guest count prevented by Entity", { error: err })
	}

	logError(4, "Table state after operations", {
		table5: table,
		table3: emptyTable,
	})
}