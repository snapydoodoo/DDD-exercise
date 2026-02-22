import { logError } from "./logger.js"

//============================================================================
// EXERCISE 7: Currency Confusion
//
// ANTI-PATTERN: Using a raw `number` for money without specifying the unit.
// Is 1850 dollars or cents? When two developers use different conventions,
// adding their values produces nonsense.
//
// DDD FIX: Create a Money Value Object that pairs amount with currency/unit.
// In DDD, a Value Object is defined by its attributes and has no identity.
// Money is a textbook example -- $10 is $10 regardless of which bill it is.
//
// HINT - Money Value Object:
//   type Currency = "USD" | "EUR" | "GBP"
//
//   class Money {
//       private constructor(
//           private readonly cents: number, // always stored in smallest unit
//           public readonly currency: Currency,
//       ) {}
//
//       static fromDollars(amount: number, currency: Currency): Money {
//           return new Money(Math.round(amount * 100), currency)
//       }
//       static fromCents(cents: number, currency: Currency): Money {
//           if (!Number.isInteger(cents)) throw new Error("Cents must be integer")
//           return new Money(cents, currency)
//       }
//
//       add(other: Money): Money {
//           if (this.currency !== other.currency)
//               throw new Error("Cannot add different currencies")
//           return new Money(this.cents + other.cents, this.currency)
//       }
//
//       format(): string {
//           return `$${(this.cents / 100).toFixed(2)}`
//       }
//   }
//
// KEY INSIGHT: By storing everything in cents (smallest unit), you avoid
// floating-point issues. The type system prevents mixing currencies, and
// the single representation eliminates dollars-vs-cents ambiguity.
//============================================================================

type Currency = "USD" | "EUR" | "GBP"

class Money {
	private constructor(
		private readonly cents: number,
		public readonly currency: Currency
	) {}

	static fromDollars(amount: number, currency: Currency): Money {
		return new Money(Math.round(amount * 100), currency)
	}

	static fromCents(cents: number, currency: Currency): Money {
		if (!Number.isInteger(cents)) throw new Error("Cents must be integer")
		return new Money(cents, currency)
	}

	add(other: Money): Money {
		if (this.currency !== other.currency)
			throw new Error("Cannot add different currencies")
		return new Money(this.cents + other.cents, this.currency)
	}

	format(): string {
		return `$${(this.cents / 100).toFixed(2)}`
	}
}

export function exercise7_CurrencyConfusion() {
	type MenuItem = {
		name: string
		price: Money
	}

	const burger: MenuItem = {
		name: "Burger",
		price: Money.fromDollars(12.5, "USD"),
	}

	const pizza: MenuItem = {
		name: "Pizza",
		price: Money.fromDollars(18.5, "USD"),
	}

	const total = burger.price.add(pizza.price)
	const formattedTotal = total.format()

	logError(7, "Currency unit safely handled with Money Value Object", {
		items: [burger, pizza],
		calculatedTotal: formattedTotal,
	})
}