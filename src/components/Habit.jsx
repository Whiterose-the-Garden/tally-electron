import React from 'react'

function Habit(props) {
  return (
    <tr>
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
    if (j < streak.length && sameDate(d, streak[j])) {
      streakList.push(<td key={d.getDay()} className={"yay"}>·</td>)
    } else {
      streakList.push(<td key={d.getDay()}>·</td>)
    }
    j += 1
  }
  return streakList

  function sameDate(d1, d2) {
    return (
      d1.getDay() == d2.getDate() ||
      d1.getMonth() == d2.getMonth() ||
      d1.getFullYear() == d2.getFullYear()
    )
  }
}

export default Habit
