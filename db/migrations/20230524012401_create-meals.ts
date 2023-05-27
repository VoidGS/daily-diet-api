import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('meals', (table) => {
		table.uuid('id').primary()
		table.text('name').notNullable()
		table.text('description')
		table.timestamp('date_hour').notNullable()
		table.boolean('on_diet').notNullable()
		table.uuid('session_id').notNullable().index()
		table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('meals')
}
