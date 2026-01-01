'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [message, setMessage] = useState('')
  const [channel, setChannel] = useState('chat')
  const [customerName, setCustomerName] = useState('Customer')
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResponse(null)

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          channel,
          customer_name: customerName,
        }),
      })

      const data = await res.json()
      setResponse(data)
    } catch (error) {
      console.error('Error:', error)
      setResponse({ error: 'Failed to process request' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          NextPlay AI Business Automation
        </h1>
        <p className={styles.subtitle}>
          Intelligent automation for sales, support, and more
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="customerName">Customer Name</label>
            <input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="channel">Channel</label>
            <select
              id="channel"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
            >
              <option value="chat">Chat</option>
              <option value="email">Email</option>
              <option value="call">Call</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message here..."
              rows={5}
              required
            />
          </div>

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Processing...' : 'Send Message'}
          </button>
        </form>

        {response && (
          <div className={styles.response}>
            <h2>AI Response</h2>
            {response.error ? (
              <div className={styles.error}>{response.error}</div>
            ) : (
              <>
                <div className={styles.intent}>
                  <strong>Intent:</strong> {response.intent}
                </div>
                <div className={styles.reply}>
                  <strong>Reply:</strong>
                  <p>{response.reply}</p>
                </div>
                <div className={styles.time}>
                  <strong>Time:</strong> {new Date(response.time).toLocaleString()}
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
