import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import crypto from 'node:crypto'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import moment from 'moment-timezone'

export async function mealRoutes(app: FastifyInstance) {
	app.get(
		'/',
		{
			preHandler: [checkSessionIdExists],
		},
		async (request, reply) => {
			const { sessionId } = request.cookies

			const meals = await knex('meals')
				.where('session_id', sessionId)
				.select()

			return { meals }
		},
	)

	app.post(
		'/',
		{
			preHandler: [checkSessionIdExists],
		},
		async (request, reply) => {
			const createMealBodySchema = z.object({
				name: z.string(),
				description: z.string(),
				dateHour: z.coerce.date(),
				isOnDiet: z.boolean(),
			})

			const { name, description, dateHour, isOnDiet } =
				createMealBodySchema.parse(request.body)

			const { sessionId } = request.cookies

			const momentDateHour = moment(dateHour)

			const momentDateHourSp = momentDateHour
				.tz('America/Sao_Paulo')
				.format('YYYY-MM-DD HH:mm:ss')

			console.log(momentDateHourSp)

			await knex('meals').insert({
				id: crypto.randomUUID(),
				name,
				description,
				date_hour: momentDateHourSp,
				on_diet: isOnDiet,
				session_id: sessionId,
			})

			return reply.status(201).send()
		},
	)
}
