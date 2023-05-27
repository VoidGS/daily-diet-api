import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { knex } from '../database'
import crypto, { randomUUID } from 'node:crypto'

export async function userRoutes(app: FastifyInstance) {
	app.get(
		'/',
		{
			preHandler: [checkSessionIdExists],
		},
		async (request, reply) => {
			const { sessionId } = request.cookies

			const user = await knex('users')
				.where('session_id', sessionId)
				.select()

			return { user }
		},
	)

	app.post('/', async (request, reply) => {
		const createUserBodySchema = z.object({
			username: z.string(),
			email: z.string(),
		})

		const { username, email } = createUserBodySchema.parse(request.body)

		let sessionId = request.cookies.sessionId

		if (!sessionId) {
			sessionId = randomUUID()

			reply.cookie('sessionId', sessionId, {
				path: '/',
				maxAge: 1000 * 60 * 24 * 7, // 7 days
			})
		}

		await knex('users').insert({
			id: crypto.randomUUID(),
			username,
			email,
			session_id: sessionId,
		})

		return reply.status(201).send()
	})
}
