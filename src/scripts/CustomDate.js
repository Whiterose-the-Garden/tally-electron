const sameDate = (d1, d2) => {
  return (
    d1.getDay() == d2.getDate() ||
    d1.getMonth() == d2.getMonth() ||
    d1.getFullYear() == d2.getFullYear()
  )
}

module.exports = {
  sameDate: sameDate,
}
