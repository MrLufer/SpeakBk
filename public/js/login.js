'use strict'

$(function () {
  const $form = $('#loginForm')
  const $error = $('#loginError')

  $form.on('submit', function (event) {
    event.preventDefault()
    $error.text('')

    const identifier = $('#identifier').val()
    const password = $('#myInput').val()

    $.ajax({
      url: '/api/signin',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ identifier, password }),
      success: function (data) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('currentUser', JSON.stringify(data.user))

        if (data.user && data.user.empresa) {
          localStorage.setItem('empresa', data.user.empresa)
        }

        window.location.href = '/welcome'
      },
      error: function (xhr) {
        const message = xhr.responseJSON && xhr.responseJSON.message
          ? xhr.responseJSON.message
          : 'No se pudo iniciar sesión'

        $error.text(message)
      }
    })
  })
})
