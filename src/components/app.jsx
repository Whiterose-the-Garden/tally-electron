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
const HABIT_LENGTH = 5
const CHAR_LIMIT = 10

const ADD = ':add'
const DEL = ':del'
const EXPORT = ':export'

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
    Mousetrap.bind('nter', this.toggleDate)
    Mousetrap.bind('d d', this.handleDel)
  }

  componentWillUnmount() {
    Mousetrap.unbind('j')
    Mousetrap.unbind('k')
    Mousetrap.unbind(':')
    Mousetrap.unbind('enter')
    Mousetrap.unbind('d d')
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
        this.modState(this.reloadFreshState())
      }
    }
    reader.readAsText(file)
  }

  toggleDate = () => {
    const { h_idx, habits, start, end } = this.state
    const h = habits[h_idx]
    const curr = new Date()
    this.storage.toggleDate(h.name, curr)
    this.modState({
      habits: this.storage.getList(), 
    })
  } 

  debug = () => { console.log(this.state) }

  enterCommand = () => {
    this.modState({ 
      mode: COMMAND 
    })
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
    const range_len = end - start
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

  // setState, but check for date change 
  modState = (obj) => {
    const d = new Date()
    if (!sameDate(this.state.curr_date, d)) {
      obj.curr_date = d
    }
    this.setState(obj, this.debug)
  }

  // get array of 14 days
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
    this.setState({ 
      command: value[0] !== ':' ? ':' + value : value
    })
  }

  onKeyDown = (event) => {   
    const { mode, command, start, end } = this.state
    const range_len = end - start
    if (event.code === 'Escape') {
      this.modState({mode: TABLE, command: ''})
    } else if (event.code === 'Enter') {
      this.controller(command)
    }
  }

  // object: grouping of related functions
  // function: no individual state
  // ideally access to modState
  controller = (command) => {
    const [inst, arg] = command.split(' ')
    switch (inst) {
      case ADD:
        if (!arg || arg.length > CHAR_LIMIT) return;
        this.handleAdd(arg)         
        break;
      case EXPORT:
        this.storage.export()
        break;
    }
  }

  handleAdd = (arg) => {
    const added = this.storage.add(arg)
    const habits = this.storage.getList()
    const growthVisible = habits.length <= HABIT_LENGTH
    const { end, command } = this.state
    this.modState({
      command: added ? ADD + ' ' : command,
      habits, 
      end: growthVisible ? end+1 : end,
    })
  }

  handleDel = (arg) => {
    let {start, end, habits, h_idx} = this.state
    if (!habits.length) return;
    const name = habits[h_idx].name
    // 4 cases
    // there are extras on left/right or not
    if (end === habits.length) { //none on right
      end--;
      // none on left?
      start = habits.length <= HABIT_LENGTH 
        ? start : start-1
    }

    // last element and not the only element
    if (h_idx === habits.length - 1 && 
      habits.length !== 1) h_idx--
    this.storage.del(name)
    habits = this.storage.getList()
    this.modState({
      habits, 
      h_idx,
      start,
      end,
    })
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
    const content = mode !== HABIT ? 
          <Table 
            habits={habits.slice(start, end)}
            idx={h_idx - start} 
            displayDates={displayDates}
          />  : <div></div>
    return (
      <div id='app'
        onDragOver={this.drag}
        onDrop={this.drop}
      >
        {content}
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
