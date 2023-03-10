import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Curso from 'App/Models/Curso'
import Modulo from 'App/Models/Modulo'

export default class ModulosController {
  public async index({ params, response }: HttpContextContract) {
    try {
      const cursoId = params.cursoId
      if (!cursoId) {
        return response.status(400).json({ error: 'Se requiere el ID del curso' })
      }
      const modulos = await Modulo.query().where('cursoId', cursoId)
      response.status(200).json(modulos)
    } catch (error) {
      response.status(500).json({ error: error.message })
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const cursoId = params.cursoId
      if (!cursoId) {
        return response.status(400).json({ error: 'Se requiere el ID del curso' })
      }
      const modulo = await Modulo.findOrFail(params.id)
      response.status(200).json(modulo)
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
      const modulo = await curso.related('modulos').create({ nombre, descripcion })
      response.status(201).json(modulo)
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
      const modulo = await Modulo.findOrFail(params.id)
      const { nombre, descripcion } = request.body()
      modulo.merge({ nombre, descripcion })
      await modulo.save()
      response.status(200).json(modulo)
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
        throw new Error('No tiene permiso para eliminar este módulo')
      }
      const modulo = await Modulo.findOrFail(params.id)
      await modulo.delete()
      response.status(200)
      return {
        message: 'Módulo eliminado correctamente',
      }
    } catch (error) {
      response.status(500).json({ error: error.message })
    }
  }
}
