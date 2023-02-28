import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Curso from 'App/Models/Curso'
import Modulo from 'App/Models/Modulo'

export default class ModulosController {
  public async index({ response }: HttpContextContract) {
    const modulos = await Modulo.all()
    response.status(200).json(modulos)
  }

  public async show({ params, response }: HttpContextContract) {
    const modulo = await Modulo.findOrFail(params.id)
    response.status(200).json(modulo)
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      await auth.authenticate()
      const { nombre, descripcion, cursoId } = request.body()
      const curso = await Curso.findOrFail(cursoId)
      const modulo = await curso.related('modulos').create({ nombre, descripcion })
      response.status(201).json(modulo)
    } catch (error) {
      response.unauthorized({ error: 'No autorizado' })
    }
  }

  public async update({ params, request, response, auth }: HttpContextContract) {
    try {
      await auth.authenticate()
      const modulo = await Modulo.findOrFail(params.id)
      const { nombre, descripcion } = request.body()
      modulo.merge({ nombre, descripcion })
      await modulo.save()
      response.status(200).json(modulo)
    } catch (error) {
      response.unauthorized({ error: 'No autorizado' })
    }
  }

  public async destroy({ params, response, auth }: HttpContextContract) {
    try {
      await auth.authenticate()
      const modulo = await Modulo.findOrFail(params.id)
      await modulo.delete()
      response.status(200)
      return {
        message: 'Módulo eliminado correctamente',
      }
    } catch (error) {
      response.unauthorized({ error: 'No autorizado' })
    }
  }
}
