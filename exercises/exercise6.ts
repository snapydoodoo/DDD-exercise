import { logError } from "./logger.js"

//============================================================================
// EXERCISE 6: Temporal Logic Error - Operating Hours
//
// ANTI-PATTERN: Representing domain-specific time concepts as raw numbers.
// Two problems: (1) invalid values (25, -5) are accepted, and (2) the
// business logic for "is the restaurant open?" is wrong for overnight spans.
//
// DDD FIX: Encapsulate the concept of "operating hours" in a Value Object
// that owns its own validation AND its own logic.
//
// HINT - Value Object with behavior:
//   type Hour = number & { readonly __brand: unique symbol }
//   function createHour(h: number): Hour {
//       if (!Number.isInteger(h) || h < 0 || h > 23)
//           throw new Error("Hour must be 0-23")
//       return h as Hour
//   }
//
//   class OperatingHours {
//       private constructor(
//           public readonly opens: Hour,
//           public readonly closes: Hour,
//       ) {}
//
//       static create(opens: number, closes: number): OperatingHours {
//           return new OperatingHours(createHour(opens), createHour(closes))
//       }
//
//       isOpenAt(hour: Hour): boolean {
//           // Handles midnight crossover correctly
//           if (this.opens <= this.closes) {
//               return hour >= this.opens && hour < this.closes
//           }
//           return hour >= this.opens || hour < this.closes
//       }
//   }
//
// KEY INSIGHT: In DDD, domain logic lives inside the domain objects, not in
// external utility functions. OperatingHours knows how to answer "am I open?"
// because that question is part of its domain responsibility.
//============================================================================

// Branded type for Hour
type Hour = number & { readonly __brand: unique symbol }

function createHour(h: number): Hour {
	if (!Number.isInteger(h) || h < 0 || h > 23)
		throw new Error("Hour must be 0-23")
	return h as Hour
}

// OperatingHours Value Object
class OperatingHours {
	private constructor(
		public readonly opens: Hour,
		public readonly closes: Hour,
	) {}

	static create(opens: number, closes: number): OperatingHours {
		return new OperatingHours(createHour(opens), createHour(closes))
	}

	isOpenAt(hour: Hour): boolean {
		if (this.opens <= this.closes) {
			return hour >= this.opens && hour < this.closes
		}
		return hour >= this.opens || hour < this.closes
	}
}

export function exercise6_TemporalLogic() {
	const restaurantHours = OperatingHours.create(22, 6) // 10 PM - 6 AM

	const testHour: Hour = createHour(2) // 2 AM

	logError(6, "Operating hours checked using Value Object", {
		testHour,
		isOpenCalculated: restaurantHours.isOpenAt(testHour),
	})

	// Invalid hour example
	try {
		const brokenHours = OperatingHours.create(25, -5)
	} catch (err) {
		logError(6, "Invalid hours prevented by Value Object", { error: err })
	}
}