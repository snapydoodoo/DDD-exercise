/*  USER REGISTRATION   */

type User = {
	name: any
	email: string
	phone: string
	password: string
}

const createUser = (
	name: any,
	email: string,
	phone: string,
	password: string,
): User => {
	return {
		name,
		email,
		phone,
		password,
	}
}
// CAREFUL ! This function is very flexible but also very error-prone. It accepts any strings !

/*  manual tests   */
const newUser = createUser(
	true,
	"alice@example.com",
	"123-456-7890",
	"secret123",
)

console.table(newUser)
/*
/*
/*
/*
/*
/*
/*
/*
/*
/*
/*
/*
/********/
