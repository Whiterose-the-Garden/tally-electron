import { sameDate } from './CustomDate.js'

const Store = require('electron-store')

const HABIT_DICT = 'habitDict'

export default function Storage() {
  this.store = new Store() 
  // this.dict = this.store.has(HABIT_DICT) 
  //   ? this.store.get(HABIT_DICT) : {}

  this.getList = () => {
    const dict = this.store.get(HABIT_DICT)
    return Object.keys(dict)
      .reduce((acc, name) => {
        acc.push({
          name,
          streak: dict[name].streak,
        })
        return acc
      }, [])
  } 

  this.toggleDate = (name, curr) => {
    const dict = this.store.get(HABIT_DICT) 
    let { streak } = dict[name]
    if (!streak.length) {
      streak.push(curr.getTime())
    } else {
      if (sameDate(curr, new Date(streak[0]))) {
        streak.shift() 
      } else { 
        streak.unshift(curr.getTime())      
      }
      dict[name] = {streak}
    }

    this.store.set(HABIT_DICT, dict)
  }
  
  this.add = (name) => {
    const dict = this.store.get(HABIT_DICT)
    if (name in dict) {
      return false
    } else {
      dict[name] = { streak:[] }
      this.store.set(HABIT_DICT, dict)
      return true
    }
  }

  // check existence?
  this.del = (name) => {
    const dict = this.store.get(HABIT_DICT)
    if (name in dict) {
      delete dict[name]
      this.store.set(HABIT_DICT, dict)
      return true
    } else {
      return false
    }
  }

}
