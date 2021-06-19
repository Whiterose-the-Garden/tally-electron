import { sameDate } from './CustomDate.js'

const Store = require('electron-store')
const fs = require('fs')

const HABIT_DICT = 'habitDict'
const STORAGE_FILE_NAME = 'storage.json'

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

  this.load = (data) => {
    //check integrity of data
    if (this.validStorage(data)) {
      const newStorage = JSON.parse(data)
      console.log(newStorage)
      this.store.set(HABIT_DICT, newStorage)
      return true
    } 
    return false
  }

  this.export = () => {
    const json = this.store.has(HABIT_DICT) ? 
      this.store.get(HABIT_DICT) : {}
    fs.writeFile(STORAGE_FILE_NAME, JSON.stringify(json), ()=>{})  
  }

  this.validStorage = (s) => {
    try {
      const newStorage = JSON.parse(s)
      return Object.keys(newStorage).every((key) => {
        if (0 < key.length && key.length <= 10 && !/\s/g.test(key)) {
          return Array.isArray(newStorage[key].streak) && 
            newStorage[key].streak.every((a) => typeof a === 'number')
        }
        return false
      })
    } catch (e) {}
    return false
  }
}
