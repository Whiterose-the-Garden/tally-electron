import React from 'react'
import Habit from './Habit.jsx'

function Table(props) {
  const habitList = props.habits.map((h) => {
    return (
      <Habit 
        key={h.name}
        name={h.name} 
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
