import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Curso from 'App/Models/Curso'
import Leccion from 'App/Models/Leccion'
import Modulo from 'App/Models/Modulo'

export default class LeccionesController {
  public async index({ params, response }: HttpContextContract) {
    try {
      const moduloId = params.moduloId
      if (!moduloId) {
        return response.status(400).json({ error: 'Se requiere el ID del modulo' })
      }
      const lecciones = await Leccion.query().where('moduloId', moduloId)
      response.status(200).json(lecciones)
    } catch (error) {
      response.status(500).json({ error: error.message })
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const moduloId = params.moduloId
      if (!moduloId) {
        return response.status(400).json({ error: 'Se requiere el ID del módulo' })
      }
      const leccion = await Leccion.findOrFail(params.id)
      response.status(200).json(leccion)
    } catch (error) {
      response.status(500).json({ error: error.message })
    }
  }

  public async store({ params, request, response, auth }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      if (!user) {
        throw new Error('El usuario no está autenticado')
      }
      const curso = await Curso.findOrFail(params.cursoId)
      if (curso.userId !== user.id) {
        throw new Error('No tiene permiso para modificar este módulo')
      }
      const { nombre, descripcion } = request.body()
      const modulo = await Modulo.findOrFail(params.moduloId)
      const leccion = await modulo.related('lecciones').create({ nombre, descripcion })
      response.status(201).json(leccion)
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
      const curso = await Curso.findOrFail(params.cursoId)
      if (curso.userId !== user.id) {
        throw new Error('No tiene permiso para modificar este módulo')
      }
      const leccion = await Leccion.findOrFail(params.id)
      const { nombre, descripcion } = request.body()
      leccion.merge({ nombre, descripcion })
      await leccion.save()
      response.status(200).json(leccion)
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
      const curso = await Curso.findOrFail(params.cursoId)
      if (curso.userId !== user.id) {
        throw new Error('No tiene permiso para modificar este módulo')
      }
      const leccion = await Leccion.findOrFail(params.id)
      await leccion.delete()
      response.status(200)
      return {
        message: 'Lección eliminada correctamente',
      }
    } catch (error) {
      response.status(500).json({ error: error.message })
    }
  }
}
