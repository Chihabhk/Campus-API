import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/register', 'AuthController.register')
  Route.post('/login', 'AuthController.login')
}).prefix('auth')

Route.resource('cursos', 'CursosController').apiOnly()

Route.group(() => {
  Route.resource('modulos', 'ModulosController').apiOnly()
}).prefix('/curso/:cursoId')

Route.group(() => {
  Route.resource('lecciones', 'LeccionesController').apiOnly()
}).prefix('/curso/:cursoId/modulo/:moduloId')
