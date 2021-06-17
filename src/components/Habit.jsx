import React from 'react'
import { sameDate } from '../scripts/CustomDate.js'

function Habit(props) {
  return (
    <tr className={props.selected ? 'selected' : ''}>
      <td>
        {props.name}
      </td>
      <Streak displayDates={props.displayDates} streak={props.streak}/>
    </tr>
  )
}

function Streak(props) {
  const {streak, displayDates} = props 
  const streakList = []
  let j = 0
  for (let i in displayDates) {
    let d = displayDates[i]
    if (j < streak.length && sameDate(d, new Date(streak[j]))) {
      streakList.push(<td key={d.getDate()} className={'yay'}>·</td>)
      j += 1
    } else {
      streakList.push(<td key={d.getDate()}>·</td>)
    }
  }
  return streakList
}

export default Habit
