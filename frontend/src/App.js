import { Route, Switch, BrowserRouter } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import HomePage from './pages/HomePage'
import './App.css'
import VerifyPage from './pages/VerifyPage'
import Hello from './pages/hello'
import PageNotFound from './pages/404Page'
import EmailVerify from './components/Authentication/EmailVerify'

export default App

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={HomePage}></Route>
          <Route path='/verify' component={VerifyPage} exact></Route>
          <Route path='/chats' component={ChatPage} exact></Route>
          <Route path='/hello' component={Hello}></Route>
          <Route path='/email/verify/:token' component={EmailVerify}></Route>
          <Route path='*' component={PageNotFound} />
        </Switch>
      </BrowserRouter>
    </div>
  )
}
