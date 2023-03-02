import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Curso from 'App/Models/curso'
import Leccion from 'App/Models/Leccion'

export default class Modulo extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nombre: string

  @column()
  public descripcion: string

  @column()
  public cursoId: number

  @belongsTo(() => Curso, { foreignKey: 'curso_id' })
  public curso_id: BelongsTo<typeof Curso>

  @hasMany(() => Leccion)
  public lecciones: HasMany<typeof Leccion>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
