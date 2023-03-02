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
      const user = await auth.authenticate()
      if (!user) {
        throw new Error('El usuario no está autenticado')
      }
      const { nombre, descripcion } = request.body()
      const curso = await user.related('cursos').create({ nombre, descripcion })
      response.status(201).json(curso)
    } catch (error) {
      response.status(500).json({ error: error.message })
    }
  }

  public async update({ params, request, response, auth }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      if (!user) {
        throw new Error('El usuario no está autenticado')
      }
      const curso = await Curso.findOrFail(params.id)
      if (curso.userId !== user.id) {
        throw new Error('No tiene permiso para modificar este curso')
      }
      const { nombre, descripcion } = request.body()
      curso.merge({ nombre, descripcion })
      await curso.save()
      response.status(200).json(curso)
    } catch (error) {
      response.status(500).json({ error: error.message })
    }
  }

  public async destroy({ params, response, auth }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      if (!user) {
        throw new Error('El usuario no está autenticado')
      }
      const curso = await Curso.findOrFail(params.id)
      if (curso.userId !== user.id) {
        throw new Error('No tiene permiso para eliminar este curso')
      }
      await curso.delete()
      response.status(200)
      return {
        message: 'Curso eliminado correctamente',
      }
    } catch (error) {
      response.status(500).json({ error: error.message })
    }
  }
}
