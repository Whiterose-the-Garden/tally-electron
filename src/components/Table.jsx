import React from 'react'
import Habit from './Habit.jsx'

function Table(props) {
  const habitList = props.habits.map((h, i) => {
    return (
      <Habit 
        key={h.name}
        name={h.name} 
        selected={i == props.h_idx}
        displayDates={props.displayDates}
        streak={h.streak}
      />
    )
  });
  return (
    <table>
      <tbody>
        {habitList}
      </tbody>
    </table>
  )
}

export default Table
