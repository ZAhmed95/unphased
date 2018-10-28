console.log('successfully uploaded file.')
$.notify({
  //options
  message: 'Assets uploaded successfully'
}, {
  //settings
  type: 'success',
  delay: 1000,
  allow_dismiss: false,
  placement: {
    from: 'bottom',
    align: 'right',
  },
  animate: {
    enter: "animated fadeInDown",
    exit: "animated fadeOutDown",
  }
})