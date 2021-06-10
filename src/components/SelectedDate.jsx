import React from 'react'

function SelectedDate(props) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const d = props.date
  const date = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
  const year = d.getFullYear() % 100
  return (
    <div className="date">
      {`${date}/${monthNames[d.getMonth()]}/${year}`} 
    </div>
  )
}

export default SelectedDate
