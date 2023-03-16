import { useHistory } from 'react-router-dom'

const Hello = () => {
  // window.reload()
  const history = useHistory()
  history.go(0)
  return <div></div>
}

export default Hello
