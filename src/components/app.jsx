import React from 'react'
import Table from './Table.jsx'
import SelectedDate from './SelectedDate.jsx'
import Command from './Command.jsx'

const Mousetrap = require('mousetrap')
const Store = require('electron-store')
const TABLE = 0 
const COMMAND = 1
const HABIT = 2 

class App extends React.Component {

  constructor(props) {
    super(props)
    const store = new Store()
    this.commandRef = React.createRef()
    this.state = {
      curr_date: new Date(),
      h_idx: 0,
      date_len: 14,
      view_range: [0,10],
      range_len: 10,
      habits: this.toHabitList(store.store),
      command: '',
      mode: TABLE
    }
  }

  toHabitList = (store) => {
    return Object.keys(store)
      .reduce((acc, name) => {
        if (name !== "__internal__") {
          acc.push({
            name,
            streak: store[name].streak,
          })
        }
        return acc
      }, [])
  }

  componentDidMount() {
    Mousetrap.bind('j', this.down)
    Mousetrap.bind('k', this.up)
    Mousetrap.bind(':', this.enterCommand)
    // Mousetrap.bind('esc', this.exitCommand)
  }

  componentWillUnmount() {
    Mousetrap.unbind('j')
    Mousetrap.unbind('k')
    Mousetrap.unbind(':')
    // Mousetrap.unbind('esc')
  }

  


  enterCommand = () => {
    this.setState({ mode: COMMAND })
    // console.log(this.commandRef.current)
    this.commandRef.current.focus()
  }

  down = () => {
    const { h_idx, view_range, habits, range_len } = this.state
    const tot_len = habits.length
    // need to shift range
    if (h_idx + 1 == range_len) {
      // only shift if not at end  
      this.setState({
        view_range: [
          view_range[1] == tot_len ? view_range[0] : view_range[0]+1, 
          view_range[1] == tot_len ? tot_len : view_range[1]+1
        ]
      })
    } else {
      this.setState({h_idx: h_idx+1})
    }
  }

  up = () => {
    const { h_idx, view_range, habits, range_len } = this.state
    // need to shift range
    if (h_idx == 0) {
      // only shift if not at start
      this.setState({
        view_range: [
          view_range[0] == 0 ? view_range[0] : view_range[0]-1, 
          view_range[0] == 0 ? range_len : view_range[1]-1
        ]
      })
    } else {
      this.setState({h_idx: h_idx-1})
    }
  }

  // updateDay = () => {
  //   const d = Date.now()
  // }

  sameDate = (d1, d2) => {
    return (
      d1.getDay() == d2.getDate() ||
      d1.getMonth() == d2.getMonth() ||
      d1.getFullYear() == d2.getFullYear()
    )
  }

  getDisplayDates = () => {
    let { curr_date, date_len } = this.state
    const displayDates = []
    let d = new Date(curr_date)
    while(date_len--) {
      displayDates.push(d) 
      d = new Date(d)
      d.setDate(d.getDate() - 1)
    }
    return displayDates
  }

  onChange = (event) => {
    let value = event.target.value
    if (!value) {
      this.setState({command:':'})
    } else if (value[0] != ':') {
      this.setState({command:':' + value})
    } else {
      this.setState({command:value})
    }
  }

  exitCommand = (event) => {   
    const { mode } = this.state
    if (event.code === "Escape" && mode === COMMAND) {
      this.setState({mode: TABLE, command: ''})
    }
  }

  render() {
    const { 
      view_range, 
      habits, 
      h_idx,
      curr_date,
      command,
      mode,
    } = this.state
    const [start, end] = view_range
    const displayDates = this.getDisplayDates()
    return (
      <div id='app'>
        <Table 
          habits={habits.slice(start, end)}
          h_idx={h_idx}
          displayDates={displayDates}
        /> 
        <SelectedDate date={curr_date} />
        <Command 
          command={command} 
          active={COMMAND === mode}
          onChange={this.onChange}
          onKeyDown={this.exitCommand}
          commandRef={this.commandRef}
        />
      </div>
    )
  }
}

export default App
