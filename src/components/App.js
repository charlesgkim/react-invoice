import React, { Component } from 'react'
import './App.module.scss'
import Invoice from './Invoice/Invoice'
import Customer from './Customers/Customer'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Invoice />
        <Customer />
      </div>
    )
  }
}

export default App
