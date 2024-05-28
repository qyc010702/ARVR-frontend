import React from 'react';
import AppRouter from "./router/router";
import SimplePageWrapper from "./components/SimplePageWrapper"
import Login from "./views/login";
import './App.css'

class App extends React.Component {
    constructor(props) {
        super(props);
        let userId = localStorage.getItem("user_id")
        this.state = {
            userId: userId
        }
    }

    checkFailed=()=>{
        alert("用户名或密码错误!")
    }

    setUserId=(userId)=>{this.setState({userId: userId}); localStorage.setItem("user_id",userId.toString())}

    checkFailed=()=>{
        alert("用户名或密码错误!")
    }

    logout=()=>{this.setState({userId:null}); localStorage.removeItem("user_id");}

    render() {
        if (this.state.userId === null) {
            return(
            <div className="App">
                <h1>Login Page</h1>
                <Login checkFailed={this.checkFailed}
                       setUserId={this.setUserId}/>
            </div>)
        }
        return (
            <>
                {SimplePageWrapper(
                    <>
                        <AppRouter ></AppRouter>
                    </>,this.logout
                )}
            </>
        );
    }
}


export default App;
