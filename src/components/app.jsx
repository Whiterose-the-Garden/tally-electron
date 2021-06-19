import React from 'react'
import Table from './Table.jsx'
import SelectedDate from './SelectedDate.jsx'
import Command from './Command.jsx'
import Storage from '../scripts/storage.js'
import { sameDate } from '../scripts/CustomDate.js'

const Mousetrap = require('mousetrap')

const TABLE = 0 
const COMMAND = 1
const HABIT = 2 

const DATE_LENGTH = 14
const HABIT_LENGTH = 10

class App extends React.Component {

  constructor(props) {
    super(props)
    this.storage = new Storage()
    this.commandRef = React.createRef()
    this.appRef = React.createRef()
    const habits = this.storage.getList()
    this.state = this.reloadFreshState()
    console.log(this.state)
  }

  reloadFreshState = () => {
    const habits = this.storage.getList()
    return {
      curr_date: new Date(),
      h_idx: 0,
      start: 0,
      end: Math.min(HABIT_LENGTH, habits.length),
      habits: habits,
      command: '',
      mode: TABLE
    }
  }

  componentDidMount() {
    Mousetrap.bind('j', this.down)
    Mousetrap.bind('k', this.up)
    Mousetrap.bind(':', this.enterCommand)
    Mousetrap.bind('enter', this.toggleDate)
    // this.appRef.current.addEventListener('dragover', this.drag)
    // this.appRef.current.addEventListener('drop', this.drop)
  }

  componentWillUnmount() {
    Mousetrap.unbind('j')
    Mousetrap.unbind('k')
    Mousetrap.unbind(':')
    Mousetrap.unbind('enter')
  }

  drag = (e) => {
    e.preventDefault() 
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
  }

  drop = (e) => {
    e.preventDefault() 
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    if (!file || !file.name) return;
    const reader = new FileReader()
    reader.onload = (e) => {
      if(this.storage.load(e.target.result)) {
        console.log('1')
        this.setState(this.reloadFreshState(), this.debug)
        console.log('2')
      }
    }
    reader.readAsText(file)
  }

  toggleDate = () => {
    const { h_idx, habits, start, end } = this.state
    const h = habits[h_idx]
    const curr = new Date()
    this.storage.toggleDate(h.name, curr)
    this.setState(this.modState({
      habits: this.storage.getList(), 
    }))
  } 

  debug = () => { console.log(this.state) }

  enterCommand = () => {
    this.setState(this.modState({ 
      mode: COMMAND 
    }))
    this.commandRef.current.focus()
  }

  down = () => {
    const { h_idx, start, end, habits } = this.state
    const tot_len = habits.length
    const range_len = end - start
    if (!range_len) return

    // need to shift range
    if (h_idx + 1 == end) {
      // only shift if not at end  
      const at_end = end == tot_len
      this.setState(this.modState({
        start: at_end ? start: start+1,
        end: at_end ? end: end+1,
      }))
    } else {
      this.setState(this.modState({h_idx: h_idx+1}))
    }
  }
  
  up = () => {
    const { h_idx, start, end, habits } = this.state
    const range_len = end - start
    if (!range_len) return

    // need to shift range
    if (h_idx == start) {
      // only shift if not at start
      const at_end = start == 0
      this.setState(this.modState({
        start: at_end ? start: start-1,
        end: at_end ? end: end-1,
      }))
    } else {
      this.setState(this.modState({h_idx: h_idx-1}))
    }
  }

  modState = (obj) => {
    const d = new Date()
    if (!sameDate(this.state.curr_date, d)) {
      obj.curr_date = d
    }
    return obj
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
    this.setState(this.modState({ 
      command: value[0] !== ':' ? ':' + value : value
    }))
  }

  onKeyDown = (event) => {   
    const { mode, command, start, end } = this.state
    const range_len = end - start
    if (event.code === 'Escape') {
      this.setState(this.modState({mode: TABLE, command: ''}))
    } else if (event.code === 'Enter') {
      const com = command.split(' ')
      // TODO: prob refactor soon
      if (com.length >= 2 && 0 < com[1].length && com[1].length <= 10) {
        const inst = com[0], arg = com[1]
        if (inst == ':add') {
          this.storage.add(com[1])
          const habits = this.storage.getList()
          const growthVisible = habits.length <= HABIT_LENGTH
          this.setState(this.modState({
            habits, 
            end: growthVisible ? end+1 : end,
          }), this.debug)
        } else if (inst == ':del') {
          const del_idx = this.state.habits.findIndex((h) => h.name === com[1])
          if (del_idx == -1) return
          this.handleDel(del_idx, com[1])
        } 
      } else if (com.length == 1) {
        if (com[0] === ':export') {
          this.storage.export()
        }
      } 
    }
  }

  handleDel = (del_idx, arg) => {
    let {start, end, habits, h_idx} = this.state
    if (end === habits.length) {
      end-- 
      start = habits.length <= HABIT_LENGTH ? start : start-1
    } 
    // deleted above or (deleted last habit in list and not the only habit)
    h_idx = del_idx < h_idx || (h_idx + 1 == habits.length && habits.length !== 1) ? h_idx - 1 : h_idx
      
    this.storage.del(arg)
    habits = this.storage.getList()
    this.setState(this.modState({
      habits, 
      h_idx,
      start,
      end,
    }), this.debug)
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
      <div id='app'
        onDragOver={this.drag}
        onDrop={this.drop}
      >
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
