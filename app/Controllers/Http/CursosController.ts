import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Curso from 'App/Models/Curso'

export default class CursosController {
  public async index({ response }: HttpContextContract) {
    const cursos = await Curso.all()
    response.status(200).json(cursos)
  }

  public async show({ params, response }: HttpContextContract) {
    const curso = await Curso.findOrFail(params.id)
    response.status(200).json(curso)
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      await auth.authenticate()
      const { nombre, descripcion } = request.body()
      const curso = await Curso.create({ nombre, descripcion })
      response.status(201).json(curso)
    } catch (error) {
      response.unauthorized({ error })
    }
  }

  public async update({ params, request, response, auth }: HttpContextContract) {
    try {
      await auth.authenticate()
      const curso = await Curso.findOrFail(params.id)
      const { nombre, descripcion } = request.body()
      curso.merge({ nombre, descripcion })
      await curso.save()
      response.status(200).json(curso)
    } catch (error) {
      response.unauthorized({ error: 'No autorizado' })
    }
  }

  public async destroy({ params, response, auth }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const curso = await Curso.query()
        .where('id', params.id)
        .where('autor_Id', user.id)
        .firstOrFail()
      await curso.delete()
      response.status(200)
      return {
        message: 'Curso eliminado correctamente',
      }
    } catch (error) {
      response.unauthorized({ error: 'No autorizado' })
    }
  }
}
