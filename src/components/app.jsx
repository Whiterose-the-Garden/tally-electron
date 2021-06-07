import React from 'react'
import Table from './Table.jsx'

class App extends React.Component {

  constructor(props) {
    console.log('construct')
    super(props)
    this.state = {
       
    }
  }

  handleKey = () => {
    console.log("hello")
  }

  render() {
    return (
      <div id='app' onKeyDown={this.handleKey}>
        {/* <Table habits={}/> */} 
      </div>
    )
  }
}

export default App
