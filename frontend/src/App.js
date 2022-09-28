import { Route, Switch } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";
import "./App.css";
import VerifyPage from "./pages/VerifyPage";
import Hello from "./pages/hello";

function App() {
  return (
    <div className="App">
      <Route path="/verify" component={VerifyPage} exact></Route>
      <Route path="/" component={HomePage} exact></Route>
      <Route path="/chats" component={ChatPage} exact></Route>
      <Route path="/hello" component={Hello}></Route>
    </div>
  );
}

export default App;
