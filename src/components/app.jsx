import React from 'react'
import Table from './Table.jsx'
import SelectedDate from './SelectedDate.jsx'
import Command from './Command.jsx'

const Mousetrap = require('mousetrap')
const Store = require('electron-store')

const TABLE = 0 
const COMMAND = 1
const HABIT = 2 

const DATE_LENGTH = 14
const HABIT_LENGTH = 10

class App extends React.Component {

  constructor(props) {
    super(props)
    this.store = new Store()
    this.commandRef = React.createRef()
    const habits = this.toHabitList(this.store.store)
    this.state = {
      curr_date: new Date(),
      h_idx: 0,
      start: 0,
      end: Math.min(HABIT_LENGTH, habits.length),
      habits: habits,
      command: '',
      mode: TABLE
    }
    console.log(this.state)
  }

  //TODO: change how store is set up
  //TODO:  - currently habits are sorted by name
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
    // Mousetrap.bind('enter', this.yay)
  }

  componentWillUnmount() {
    Mousetrap.unbind('j')
    Mousetrap.unbind('k')
    Mousetrap.unbind(':')
    // Mousetrap.unbind('enter')
  }

  yay = () => {
    // const { h_idx, habits, view_range } = this.state
    // const h = habits[view_range[0] + h_idx]
    // const { streak } = this.store.get(h.name)
    // if (streak.length === 0) {
      
    // }
    // change in db
    // reflect the change in view
  } 

  debug = () => { console.log(this.state) }

  enterCommand = () => {
    this.setState({ mode: COMMAND })
    this.commandRef.current.focus()
  }

  down = () => {
    const { h_idx, start, end, habits } = this.state
    const tot_len = habits.length
    const range_len = start - end
    if (!range_len) return;

    // need to shift range
    if (h_idx + 1 == end) {
      // only shift if not at end  
      const at_end = end == tot_len
      this.setState({
        start: at_end ? start: start+1,
        end: at_end ? end: end+1,
      })
    } else {
      this.setState({h_idx: h_idx+1})
    }
  }

  up = () => {
    const { h_idx, start, end, habits } = this.state
    const range_len = start - end
    if (!range_len) return

    // need to shift range
    if (h_idx == start) {
      // only shift if not at start
      const at_end = start == 0
      this.setState({
        start: at_end ? start: start-1,
        end: at_end ? end: end-1,
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
    const { curr_date } = this.state
    const displayDates = []
    let d = new Date(curr_date), date_len = DATE_LENGTH
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

  onKeyDown = (event) => {   
    const { mode, command, start, end } = this.state
    const range_len = end - start
    if (event.code === 'Escape') {
      this.setState({mode: TABLE, command: ''})
    } else if (event.code === 'Enter') {
      const com = command.split(' ')
      // TODO: prob refactor soon
      if (com.length >= 2 && com[1].length <= 10) {
        const inst = com[0], arg = com[1]
        if (inst == ':add') {
          // TODO: check that item doesn't already exit
          // TODO: disable node integration
          this.store.set(com[1], {streak:[]})  
          const habits = this.toHabitList(this.store.store)
          const growthVisible = habits.length <= HABIT_LENGTH
          this.setState({
            habits, 
            // range_len: habits.length <= MAX_SHOW ? range_len + 1: range_len, 
            // start: growthVisible ? [0, range_len+1] : view_range,
            end: growthVisible ? end+1 : end,
          }, this.debug)
        } else if (inst == ':del') {
          const del_idx = this.state.habits.findIndex((h) => h.name === com[1])
          if (del_idx == -1) return
          this.handleDel(del_idx, com[1])
        } 
      } 
    }
  }

  // TODO: Pre change or post change?
  handleDel = (del_idx, arg) => {
    let {start, end, habits, h_idx} = this.state
    if (end === habits.length) {
      end-- 
      start = habits.length <= HABIT_LENGTH ? start : start-1
    } 
    h_idx = del_idx < h_idx || (h_idx + 1 == habits.length) ? h_idx - 1 : h_idx
      
    this.store.delete(arg)
    habits = this.toHabitList(this.store.store)
    this.setState({
      habits, 
      h_idx,
      start,
      end,
    }, this.debug)
  }

  render() {
    const { 
      start, end, 
      habits, 
      h_idx,
      curr_date,
      command,
      mode,
    } = this.state
    const displayDates = this.getDisplayDates()
    return (
      <div id='app'>
        <Table 
          habits={habits.slice(start, end)}
          idx={h_idx - start} 
          displayDates={displayDates}
        /> 
        <div id='control'>
          <SelectedDate date={curr_date} />
          <Command 
            command={command} 
            active={COMMAND === mode}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            commandRef={this.commandRef}
          />
        </div>
      </div>
    )
  }
}

export default App
