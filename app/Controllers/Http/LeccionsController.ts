import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Leccion from 'App/Models/Leccion'
import Modulo from 'App/Models/Modulo'

export default class LeccionesController {
  public async index({ response }: HttpContextContract) {
    const lecciones = await Leccion.all()
    response.status(200).json(lecciones)
  }

  public async show({ params, response }: HttpContextContract) {
    const leccion = await Leccion.findOrFail(params.id)
    response.status(200).json(leccion)
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      await auth.authenticate()
      const { nombre, descripcion, moduloId } = request.body()
      const modulo = await Modulo.findOrFail(moduloId)
      const leccion = await modulo.related('lecciones').create({ nombre, descripcion })
      response.status(201).json(leccion)
    } catch (error) {
      response.unauthorized({ error: 'No autorizado' })
    }
  }

  public async update({ params, request, response, auth }: HttpContextContract) {
    try {
      await auth.authenticate()
      const leccion = await Leccion.findOrFail(params.id)
      const { nombre, descripcion } = request.body()
      leccion.merge({ nombre, descripcion })
      await leccion.save()
      response.status(200).json(leccion)
    } catch (error) {
      response.unauthorized({ error: 'No autorizado' })
    }
  }

  public async destroy({ params, response, auth }: HttpContextContract) {
    try {
      await auth.authenticate()
      const leccion = await Leccion.findOrFail(params.id)
      await leccion.delete()
      response.status(200)
      return {
        message: 'Lección eliminada correctamente',
      }
    } catch (error) {
      response.unauthorized({ error: 'No autorizado' })
    }
  }
}
