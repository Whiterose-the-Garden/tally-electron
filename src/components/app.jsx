import React from 'react'
import Table from './Table.jsx'

const Mousetrap = require('mousetrap')
const Store = require('electron-store')

class App extends React.Component {

  constructor(props) {
    super(props)
    const store = new Store()
    this.state = {
      curr_date: Date.now(),
      h_idx: 0,
      view_range: [0,10],
      range_len: 10,
      habits: toHabitList(store.store),
    }
  }

  toHabitList = (store) => {
    return Object.keys(store)
      .map((name) => {
        return {
          name,
          streak: store[name].streak,
        }
      })
  }

  componentDidMount() {
    Mousetrap.bind('j')
    Mousetrap.bind('k')
    Mousetrap.bind(':')
  }

  componentWillUnmount() {
    Mousetrap.unbind('j')
    Mousetrap.unbind('k')
    Mousetrap.unbind(':')
  }

  down = () => {
    const { h_idx, view_range, habits, range_len } = this.state
    const tot_len = habits.length
    // need to shift range
    if (h_idx + 1 == range_len) {
      // only shift if not at end  
      this.setState({
        view_range: [
          view_len[1] == tot_len ? view_len[0] : view_len[0]+1, 
          view_len[1] == tot_len ? tot_len : view_len[1]+1
        ]
      })
    } else {
      this.setState({h_idx: h_idx+1})
    }
  }

  up = () => {
    const { h_idx, view_range, habits, range_len } = this.state
    const tot_len = habits.length
    // need to shift range
    if (h_idx == 0) {
      // only shift if not at start
      this.setState({
        view_range: [
          view_len[0] == 0 ? view_len[0] : view_len[0]-1, 
          view_len[0] == 0 ? tot_len : view_len[1]-1
        ]
      })
    } else {
      this.setState({h_idx: h_idx-1})
    }
  }

  // updateDay = () => {
  //   const d = Date.now()
  // }

  sameDate(d1, d2) {
    return (
      d1.getDay() == d2.getDate() ||
      d1.getMonth() == d2.getMonth() ||
      d1.getFullYear() == d2.getFullYear()
    )
  }

  render() {
    const { view_range, habits, curr_date } = this.state
    return (
      <div id='app' 
        <Table 
          habits={habits.slice(view_range[0], view_range[1])}
          displayDates={curr_date}
        /> 
      </div>
    )
  }
}

export default App
