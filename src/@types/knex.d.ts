// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
	export interface Tables {
		users: {
			id: string
			username: string
			email: string
			created_at: string
			session_id?: string
		}
		meals: {
			id: string
			name: string
			description: string
			date_hour: string
			on_diet: boolean
			session_id: string
			created_at: string
		}
	}
}
