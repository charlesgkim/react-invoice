import React, { Component } from 'react'
import styles from './Invoice.module.scss'

import LineItems from './LineItems'

import uuidv4 from 'uuid/v4'

class Invoice extends Component {
  state = {
    companyName: 'DEEPEYES LTD',
    companyAddress: '141 New Road, London',
    companyRegNo: '10711452',
    companyVatNo: '',
    companyPostcode: 'E4 9EZ',
    customerName: 'NAVIEN LTD',
    customerAddress: 'Building 2, Ground Floor, Guildford Business Park, Guildford.',
    customerPostcode: 'GU2 8XH',
    locale: 'en-GB',
    currency: 'GBP',
    taxRate: 20.00,
    paymentTerms: '7 days',
    notes: 'Details of payment to be made via BACS. %Bank Details%',
    footer: 'Registered in England and Wales No: ',
    invoiceNo: '19-10-000',
    invoiceDate: '02-10-2019',
    lineItems: [
      {
        id: 'initial',      // react-beautiful-dnd unique key
        name: '',
        description: '',
        quantity: 0,
        price: 0.00,
      },
    ]
  }

  handleInvoiceChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  handleLineItemChange = (elementIndex) => (event) => {
    let lineItems = this.state.lineItems.map((item, i) => {
      if (elementIndex !== i) return item
      return {...item, [event.target.name]: event.target.value}
    })
    this.setState({lineItems})
  }

  handleAddLineItem = (event) => {
    this.setState({
      // use optimistic uuid for drag drop; in a production app this could be a database id
      lineItems: this.state.lineItems.concat(
        [{ id: uuidv4(), name: '', description: '', quantity: 0, price: 0.00 }]
      )
    })
  }

  handleRemoveLineItem = (elementIndex) => (event) => {
    this.setState({
      lineItems: this.state.lineItems.filter((item, i) => {
        return elementIndex !== i
      })
    })
  }

  handleReorderLineItems = (newLineItems) => {
    this.setState({
      lineItems: newLineItems,
    })
  }

  handleFocusSelect = (event) => {
    event.target.select()
  }

  handlePayButtonClick = () => {
    alert('Not implemented')
  }

  formatCurrency = (amount) => {
    return (new Intl.NumberFormat(this.state.locale, {
      style: 'currency',
      currency: this.state.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount))
  }

  calcTaxAmount = (c) => {
    return c * (this.state.taxRate / 100)
  }

  calcLineItemsTotal = () => {
    return this.state.lineItems.reduce((prev, cur) => (prev + (cur.quantity * cur.price)), 0)
  }

  calcTaxTotal = () => {
    return this.calcLineItemsTotal() * (this.state.taxRate / 100)
  }

  calcGrandTotal = () => {
    return this.calcLineItemsTotal() + this.calcTaxTotal()
  }

  render = () => {
    return (

      <div className={styles.invoice}>
        <div className={styles.brand}>
          <img src='https://via.placeholder.com/180x60.png?text=DEEP EYES LTD' alt="Logo" className={styles.logo} /><br />
          {this.state.companyAddress} {this.state.companyPostcode}
        </div>        
        <div className={styles.addresses}>
          <form>
            <div className={`${styles.to}`}>
              <div className={styles.row}>
                <div className={`${styles.label} ${styles.value}`}>Invoice to: <input name="customerName" type="text" step="0.01" value={this.state.customerName} onChange={this.handleInvoiceChange} onFocus={this.handleFocusSelect} /></div>
                <div className={styles.value}>{this.state.customerAddress} {this.state.customerPostcode}</div>
              </div>
              <div className={styles.row}>
                <div className={`${styles.value} ${styles.value} ${styles.date}`}><p>Date: {this.state.invoiceDate}</p></div>
              </div>
            </div>
          </form>
        </div>
        <h3>Invoice #{this.state.invoiceNo}</h3>

          <LineItems
            items={this.state.lineItems}
            currencyFormatter={this.formatCurrency}
            addHandler={this.handleAddLineItem}
            changeHandler={this.handleLineItemChange}
            focusHandler={this.handleFocusSelect}
            deleteHandler={this.handleRemoveLineItem}
            reorderHandler={this.handleReorderLineItems}
          />

        <div className={styles.totalContainer}>
          <form>
            <div className={styles.valueTable}>
              <div className={styles.row}>
                <div className={styles.label}>VAT Rate (%)</div>
                <div className={styles.value}><input name="taxRate" type="number" step="0.01" value={this.state.taxRate} onChange={this.handleInvoiceChange} onFocus={this.handleFocusSelect} /></div>
              </div>
            </div>
          </form>
          <form>
            <div className={styles.valueTable}>
              <div className={styles.row}>
                <div className={styles.label}>Subtotal</div>
                <div className={`${styles.value} ${styles.currency}`}>{this.formatCurrency(this.calcLineItemsTotal())}</div>
              </div>
              <div className={styles.row}>
                <div className={styles.label}>VAT ({this.state.taxRate}%)</div>
                <div className={`${styles.value} ${styles.currency}`}>{this.formatCurrency(this.calcTaxTotal())}</div>
              </div>
              <div className={styles.row}>
                <div className={styles.label}>Total Due</div>
                <div className={`${styles.value} ${styles.currency}`}>{this.formatCurrency(this.calcGrandTotal())}</div>
              </div>
            </div>
          </form>
        </div>

        <div className={styles.pay}>
          <button className={styles.payNow} onClick={this.handlePayButtonClick}>Click here to save the invoice</button>
        </div>

        <div className={styles.footer}>
          <div className={styles.comments}>
            <h4>Notes</h4>
            <p>Payment Terms: {this.state.paymentTerms}. {this.state.notes}</p>

          </div>
          <div className={styles.closing}>
            <div>
              <p>{this.state.companyName}, {this.state.companyAddress}. {this.state.companyPostcode}. {this.state.footer} {this.state.companyRegNo}</p>
            </div>
          </div>
        </div>

      </div>

    )
  }
}

export default Invoice
