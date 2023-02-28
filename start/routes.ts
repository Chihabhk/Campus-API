import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/register', 'AuthController.register')
  Route.post('/login', 'AuthController.login')
}).prefix('auth')

Route.resource('cursos', 'CursosController').apiOnly()
Route.resource('modulos', 'ModulosController').apiOnly()
Route.resource('lecciones', 'LeccionesController').apiOnly()
