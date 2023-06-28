import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import crypto from 'node:crypto'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import moment from 'moment-timezone'

export async function mealRoutes(app: FastifyInstance) {
	app.get(
		'/:id',
		{
			preHandler: [checkSessionIdExists],
		},
		async (request, reply) => {
			const getMealsParamsSchema = z.object({
				id: z.string().optional(),
			})

			const { id } = getMealsParamsSchema.parse(request.params)

			if (!id) {
				const { sessionId } = request.cookies

				const meals = await knex('meals').where('session_id', sessionId).select()

				return reply.status(200).send({ meals })
			}

			const meal = await knex('meals')
				.where({
					id,
					session_id: request.cookies.sessionId,
				})
				.first()

			return reply.status(200).send({ meal })
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

			const { name, description, dateHour, isOnDiet } = createMealBodySchema.parse(
				request.body,
			)

			const { sessionId } = request.cookies

			const momentDateHour = moment(dateHour)

			const momentDateHourSp = momentDateHour
				.tz('America/Sao_Paulo')
				.format('YYYY-MM-DD HH:mm:ss')

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

	app.put(
		'/:id',
		{
			preHandler: [checkSessionIdExists],
		},
		async (request, reply) => {
			const getMealsParamsSchema = z.object({
				id: z.string(),
			})

			const { id } = getMealsParamsSchema.parse(request.params)

			const updateMealBodySchema = z.object({
				name: z.string(),
				description: z.string(),
				dateHour: z.coerce.date(),
				isOnDiet: z.boolean(),
			})

			const { name, description, dateHour, isOnDiet } = updateMealBodySchema.parse(
				request.body,
			)

			const { sessionId } = request.cookies

			const momentDateHour = moment(dateHour)

			const momentDateHourSp = momentDateHour
				.tz('America/Sao_Paulo')
				.format('YYYY-MM-DD HH:mm:ss')

			await knex('meals')
				.where({
					id,
					session_id: sessionId,
				})
				.update({
					name,
					description,
					date_hour: momentDateHourSp,
					on_diet: isOnDiet,
				})

			return reply.status(200).send()
		},
	)

	app.delete(
		'/:id',
		{
			preHandler: [checkSessionIdExists],
		},
		async (request, reply) => {
			const getMealsParamsSchema = z.object({
				id: z.string(),
			})

			const { id } = getMealsParamsSchema.parse(request.params)

			const { sessionId } = request.cookies

			await knex('meals')
				.where({
					id,
					session_id: sessionId,
				})
				.delete()

			return reply.status(200).send()
		},
	)
}
