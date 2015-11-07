import {Messenger} from './messenger.js'

export default function getMessenger (send) {
  return new Messenger(send)
}
