import {v4 as uuid} from 'uuid'

export class Messenger {
  constructor (send) {
    if (typeof send !== 'function') {
      throw new Error('Messenger\'s argument should be a function')
    }
    this._send = send
    this._topicMap = new Map()
    this._contextMap = new Map()
  }

  accept (context, message, topic) {
    if (typeof topic !== 'string') {
      const topicListener = this._topicMap.get(topic)
      if (topicListener) {
        return topicListener({
          message,
          send: msg2send => this._sendAndWait(context, msg2send),
          done: msg2send => this._send(context, msg2send)
        })
      }
    }
    const listener = this._contextMap.get(context)
    if (!listener) return
    this._contextMap.delete(context)
    listener(message)
  }

  on (topic, listener) {
    if (typeof topic !== 'string' || typeof listener !== 'function') return
    this._topicMap.set(topic, listener)
  }

  send (topic, message) {
    const context = uuid()
    return this._sendAndWait(context, message, topic)
  }

  _sendAndWait (context, message, topic) {
    return new Promise(resolve => {
      this._contextMap.set(context, input => {
        resolve({
          message: input,
          send: msg2send => this._sendAndWait(context, msg2send),
          done: msg2send => this._send(context, msg2send)
        })
      })
      this._send(context, message, topic)
    })
  }
}
