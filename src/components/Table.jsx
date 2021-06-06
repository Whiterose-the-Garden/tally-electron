import React from 'react'
import Habit from './Habit'


function Table(props) {
  const habitList = props.habits.map((h) => {
    <Habit key={h.name} 
      name={props.name} 
      displayDates={props.displayDates}
      streak={props.streak}
    />
  });
  return (
    <table>
      {habitList}
    </table>
  )
}

export default Table
