import s, { type RunResult } from 'sqlite3'
import argon2 from 'argon2'
import crypto from 'node:crypto'
import casual from 'casual'
const sqlite3 = s.verbose()

const createDatabase = async () => {
	const start = new Date()
	const db = new sqlite3.Database(':memory:')

	await new Promise<void>((res) => {
		db.serialize(async () => {
			db.run(
				'CREATE TABLE if not exists users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, md5password TEXT, argon2Password TEXT, credit INTEGER )'
			)

			const stmt = db.prepare('INSERT OR IGNORE INTO users VALUES (?, ?, ?, ?, ?, ?)')
			const users = [
				['John', '1234'],
				['Eve', 'secretpassword'],
				['Alice', 'moresecret'],
				['Bob', 'hushdonttellanyone'],
				...new Array(40).fill(null).map(() => [casual.username, casual.password])
			]
			for (const [i, [name, pw]] of users.entries()) {
				const md5pw = crypto.createHash('md5').update(pw).digest('hex')
				const argon2pw = await argon2.hash(pw)
				stmt.run(i, name, pw, md5pw, argon2pw, Math.floor(Math.random() * 10000))
			}
			stmt.finalize()
			res()
		})
	})

	type ErrOr<T> = [T | undefined, Error] | [T, null]
	const meta: {
		lastUsed: Date
		count: number
	} = {
		count: 0,
		lastUsed: new Date()
	}
	const incMeta = () => {
		meta.count++
		meta.lastUsed = new Date()
	}

	const dbAll = async <T>(statement: string) => {
		console.debug('[sqlAll]', statement)
		incMeta()
		return new Promise<ErrOr<T[]>>((res) =>
			db.all<T>(statement, (err, row) => {
				return res([row, errWithStatement(err, statement)])
			})
		)
	}
	const dbGet = async <T>(statement: string) => {
		incMeta()
		console.debug('[sqlGet]', statement)
		return new Promise<ErrOr<T>>((res) =>
			db.get<T>(statement, (err, row) => {
				return res([row, errWithStatement(err, statement)])
			})
		)
	}
	const dbRun = async (statement: string, args) => {
		incMeta()
		console.debug('[sqlRun]', statement)
		return new Promise<ErrOr<RunResult>>((res) =>
			db.run(statement, args, (result: RunResult, err: Error | null) => {
				console.debug('[sqlRun]', statement, result, err)
				return res([result, errWithStatement(err, statement)])
			})
		)
	}

	const errWithStatement = (err: Error | null, statement: string) => {
		if (!err) {
			return null
		}
		return {
			...err,
			message: err.message + ' ' + statement,
			stack: err.stack,
			sql: statement
		}
	}

	type User = {
		id: string
		username: string
		password: string
		credit: number
		md5password: string
		argon2Password: string
	}

	const funcs = {
		__db: db,
		meta,
		getUsers: (where = '') => dbAll<User>(`select * from users ${where};`),
		updateUser: (user: User) => {
			const sql = `update users set password = '${user.password}', credit = '${user.credit}' where id=${user.id} `
			return dbRun(sql)
		},
		inserUser: async (user: Pick<User, 'password' | 'credit' | 'username'>) => {
			const md5pw = crypto.createHash('md5').update(user.password).digest('hex')
			const argon2pw = await argon2.hash(user.password)
			const sql = `INSERT INTO users VALUES (NULL, '${user.username}', '${user.password}', '${md5pw}', '${argon2pw}', ${user.credit});`
			return dbRun(sql, undefined)
		},
		login: (username: string, password: string) => {
			return dbGet<User>(
				`select * from users where username = '${username}' and password ='${password}'`
			)
		}
	}
	const diff = new Date().getTime() - start.getTime()
	console.debug('created db in ', diff, 'ms')
	return funcs
}

const databases = new Map<string, Awaited<ReturnType<typeof createDatabase>>>()

const cleanup = () => {
	if (databases.size < 200) {
		return
	}
	const now = new Date().getTime()
	for (const [k, db] of databases.entries()) {
		if (k.startsWith('__next_')) {
			continue
		}
		const sinceMs = now - db.meta.lastUsed.getTime()
		if (sinceMs > 3000) {
			db.__db.close()
			console.debug(`cleared database ${k} since it has not been used since ${db.meta.lastUsed}`)
			databases.delete(k)
		}
	}
}

setInterval(cleanup, 1000)

const getDatabase = async (scope: string) => {
	if (databases.size > 200) {
		cleanup()
	}
	let db = databases.get(scope)
	if (!db) {
		const next = findFromNext(1, 5)
		if (next) {
			console.debug('got from next', next)
			db = next.db
			databases.set(scope, db)
			databases.delete(next.key)
			createDatabase().then((d) => databases.set(next.key, d))
		}
		if (!db) {
			db = await createDatabase()
			databases.set(scope, db)
		}
	}
	console.debug('db', scope)
	return db
}

const findFromNext = (
	count: number = 0,
	max: number = maxNext
): { key: string; db: Awaited<ReturnType<typeof createDatabase>> } | null => {
	const key = '__next_' + count
	const db = databases.get(key)
	if (!db) {
		count++
		if (count > max) {
			return null
		}
		return findFromNext(count, max)
	}
	return { key, db }
}

const maxNext = 10

const precreate = (i: number, max: number) => {
	const key = '__next_' + i
	createDatabase().then((d) => {
		databases.set(key, d)
		i++
		if (i >= max) {
			return
		}

		precreate(i, max)
	})
}

precreate(0, maxNext)

// db.close();
export default getDatabase
