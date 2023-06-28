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

			const user = await knex('users').where('session_id', sessionId).select().first()

			if (!user) {
				return reply.status(404).send('Usuario não encontrado')
			}

			const totalMeals = await knex('meals').where('session_id', sessionId).count()
			const totalMealsOnDiet = await knex('meals')
				.where('session_id', sessionId)
				.where('on_diet', true)
				.count()
			const totalMealsOffDiet = await knex('meals')
				.where('session_id', sessionId)
				.where('on_diet', false)
				.count()

			return {
				user,
				totalMeals: totalMeals[0]['count(*)'],
				totalMealsOnDiet: totalMealsOnDiet[0]['count(*)'],
				totalMealsOffDiet: totalMealsOffDiet[0]['count(*)'],
			}
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
