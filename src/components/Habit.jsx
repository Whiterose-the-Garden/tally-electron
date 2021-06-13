import React from 'react'

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
    // Will cause errors with custom list lengths
    if (j < streak.length && sameDate(d, new Date(streak[j]))) {
      streakList.push(<td key={d.getDate()} className={"yay"}>·</td>)
    } else {
      streakList.push(<td key={d.getDate()}>·</td>)
    }
    j += 1
  }
  return streakList

  function sameDate(d1, d2) {
    console.log(d1)
    console.log(d2)
    return (
      d1.getDay() == d2.getDate() ||
      d1.getMonth() == d2.getMonth() ||
      d1.getFullYear() == d2.getFullYear()
    )
  }
}

export default Habit
